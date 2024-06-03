const fs = require('fs');
const uuid  = require('uuid');
const nconf = require('nconf');
const decode  = require('../utils/decode');
const winston = require('winston');
const info  = winston.loggers.get('info');
const error = winston.loggers.get('error');
const debug = winston.loggers.get('debug');
const { getAWSConfigWithProxy }  = require('../utils/aws-config');
const { Readable } = require('stream');
const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");

function Amazon() {
  this.pollyConfig = getAWSConfigWithProxy();
  this.Polly = new PollyClient(this.pollyConfig);
  info.info('Amazon TTS config: ', this.pollyConfig);
}

Amazon.prototype.textToSpeech = function texttospeech(text, language, voice, callback) {
  const audiofilename = `${uuid.v4()}.mp3`;
  var voiceid;
  if (voice == "Male"){
    voiceid = language == 'es' ? 'Miguel' :'Matthew'
  }
  else{
    voiceid = language == 'es' ? 'Penelope' :'Joanna'
  }
  const command = new SynthesizeSpeechCommand({ Text: text,
                                                OutputFormat: 'mp3',
                                                VoiceId: voiceid });
  this.Polly.send(command).then(
    (data) => {
      if (data.AudioStream instanceof Readable) {
        const writeStream = fs.createWriteStream(`./texttospeech/audiofiles/${audiofilename}`);
        writeStream.on('finish', ()=>{
            info.info(`TTS file saved: ./texttospeech/audiofiles/${audiofilename}`);
            callback(null, audiofilename);
          }).on('error', (err2)=>{
            error.error(`ERROR: TTS file save fail: ./texttospeech/audiofiles/${audiofilename}`);
            error.error(err2);
            callback(null, audiofilename);
          });
        data.AudioStream.pipe(writeStream);
      }
    },
    (err) => {
      error.error(err, err.message);
    }
  );
};

module.exports = Amazon;
