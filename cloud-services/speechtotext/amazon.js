const GrowingFile = require('growing-file');
const nconf = require('nconf');
const winston = require('winston');
const decode  = require('../utils/decode');
const { PassThrough } = require('stream');
const error = winston.loggers.get('error');
const info  = winston.loggers.get('info');
const debug = winston.loggers.get('debug');
const { getAWSConfig }  = require('../utils/aws-config');
const { TranscribeStreamingClient, StartStreamTranscriptionCommand } = require("@aws-sdk/client-transcribe-streaming");

const eventStreamConsume = async function(stream, callback, that){
  try{
    for await (const event of stream) {
      if (event.TranscriptEvent) {
        const results = event.TranscriptEvent.Transcript.Results;
        for(var result of results){
          for(var alternative of result.Alternatives){
            const response = {
              transcript: alternative.Transcript,
              final: !result.IsPartial,
              timestamp: new Date(),
              raw: JSON.stringify(result),
              wordConfidence: []
            };
            // 'Items' is the individual words and confidences
            if(alternative.Items){
              for (let i = 0; i < alternative.Items.length; i += 1) {
                if(alternative.Items[i].Type != "punctuation") {
                  response.wordConfidence.push((alternative.Items[i].Confidence  || 1 ));
                }
              }
            }
            callback(response);
          }
        }
      }
    }
  }
  catch(err){
    // The connection will time out if it receives no data for 15 seconds
    info.info('Connection to AWS STT has timed out');
    that.timedOut = true;
  }
}

function Amazon(config) {
  console.log('AMAZON STT ACTIVE');
  // Using a custom proxy is currently broken ( @aws-sdk/client-transcribe-streaming version 3.342.0 ), probably because this is a websocket based streaming service
  // Hopefully this is fixed one day, and this code can be uncommented
  // let transcribeConfig = getAWSConfigWithProxy();
  let transcribeConfig = getAWSConfig();
  this.Transcribe = new TranscribeStreamingClient(transcribeConfig);
  this.file = config.file;
  this.language = config.language;
  this.sampleRate = 16000;
  this.commandInput = {
    LanguageCode: this.language,
    MediaSampleRateHertz: this.sampleRate,
    MediaEncoding: "pcm",
    EnablePartialResultsStabilization: true, // Enabling to make transcription faster
    PartialResultsStability:  "medium", // Set this to 'medium' or 'low' for worse results a little faster
    AudioStream: audioStream(),
    // Specifying 1 channel caused an error for some reason, maybe will be fixed in the future
    // NumberOfChannels: 1
  };
  this.timedOut = false;
}

const audioPayloadStream = new PassThrough();
const audioStream = async function* () {
  const chunkSize = 1024 // The service errors out if this is too big
  for await (const payloadChunk of audioPayloadStream) {
    const length = payloadChunk.length;
    var start = 0;
    var end = chunkSize;
    yield { AudioEvent: { AudioChunk: payloadChunk.subarray(start, end) } };
    while(end < length) {
      start = start + chunkSize;
      end = end + chunkSize;
      yield { AudioEvent: { AudioChunk: payloadChunk.subarray(start, end) } };
    }
  }
};

Amazon.prototype.checkStreamingConnection = function checkStreamingConnection(that, callback){
  clearTimeout(that.connectionPoll);
  if(that.timedOut){
    that.timedOut = false;
    that.Transcribe.send(new StartStreamTranscriptionCommand(that.commandInput)).then(
      (data) => {
        eventStreamConsume(data.TranscriptResultStream, callback, that);
      },
      (err) => {
        console.log('AWS STT Error');
        error.error(err, err.message);
      }
    );
  }
  this.connectionPoll = setTimeout(that.checkStreamingConnection, 15000, that, callback);
}

Amazon.prototype.start = function start(callback) {
  this.Transcribe.send(new StartStreamTranscriptionCommand(this.commandInput)).then(
    (data) => {
      eventStreamConsume(data.TranscriptResultStream, callback, this);
      this.growingPCM = GrowingFile.open(this.file, {
        timeout: 30000,
        interval: 100,
      });
      this.growingPCM.pipe(audioPayloadStream);
    },
    (err) => {
      console.log('AWS STT Error');
      error.error(err, err.message);
    }
  );
  // If the socket doesn't get any data for 15 seconds it times out. Probably not a problem during a normal call,
  // but check every 15 seconds and reconnect if necessary
  this.connectionPoll = setTimeout(this.checkStreamingConnection, 15000, this);
};

module.exports = Amazon;
