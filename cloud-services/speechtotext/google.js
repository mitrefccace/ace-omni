const GrowingFile = require('growing-file');
const Stream = require('stream').Stream;
const Speech = require('@google-cloud/speech');
const unpipe = require('unpipe');
const MemoryStream = require('memorystream');

const maxTimeoutForReconnect = 45000;
const growingFileOffset = -5000;

function Google(file, liveFile = true) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = `${process.cwd()}/cloud-services/configs/google.json`;
  this.memStream = new MemoryStream();
  this.speech = new Speech.SpeechClient();
  this.file = file;
  this.gfWavPolling = null;
  this.growingWav = null;
  this.lastResults = {};
  this.liveFile = liveFile;
  this.request = {
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode:'en-US',
      useEnhanced: true,
      model: 'phone_call',
      profanityFilter: false
    },
    interimResults: true,
    verbose: true,
  };
}

Google.prototype.start = function start(callback) {
  this.done = false;
  this.growingWav = GrowingFile.open(this.file,
    {
      timeout: maxTimeoutForReconnect + growingFileOffset,
      interval: 100,
    });

  this.audioHeader = Buffer.from('1a45dfa39f4286810142f7810142f2810442f381084282847765626d42878104428581021853806701ffffffffffffff1549a966992ad7b1830f42404d80864368726f6d655741864368726f6d651654ae6bbfaebdd7810173c587fdbff4f972802b8381028686415f4f50555363a2934f707573486561640101000080bb0000000000e18db584473b80009f8101626481201f43b67501ffffffffffffffe78100a38c81000080fb03fffefffefffea38c81003c80fb03fffefffefffea3', 'hex');
 
  this.growingWav.pipe(this.speechStream(callback));
  this.gfWavPolling = setTimeout(this.reconnectStreams, maxTimeoutForReconnect, this,
    'timeout', callback);

  this.growingWav.on('end', () => {
    clearTimeout(this.gfWavPolling);
    this.done = true;
    callback({ end: true });
  });
};

Google.prototype.reconnectStreams = function reconnectstreams(that, reason, callback) {
  const that2 = that;
  clearTimeout(that.gfWavPolling);
  unpipe(that.memStream);
  unpipe(that.growingWav);
  if (!that2.done) {
    const gstream = that2.speechStream.call(that2, callback);
    that2.memStream.pipe(gstream, { end: false });
    that2.memStream.write(that2.audioHeader);
    that2.growingWav.pipe(gstream);
    that2.gfWavPolling = setTimeout(that2.reconnectStreams, maxTimeoutForReconnect, that2, 'timeout', callback);
  }
};

Google.prototype.speechStream = function speechstream(callback) {
  return this.speech.streamingRecognize(this.request)
    .on('error', (error) => {
      console.log(`Google Error: ${error}`);
    })
    .on('data', (data) => {
      if (!data.error) {
        clearTimeout(this.gfWavPolling);
        if (data.results[0]) {
          const results = {
            transcript: data.results[0].alternatives[0].transcript,
            final: data.results[0].isFinal,
            timestamp: new Date(),
          };

          if (results.final) {
            if (this.liveFile) this.reconnectStreams(this, 'final', callback);
          }
          this.lastResults = results;
          callback(results);
        }
      } else {
        console.log(`Error: ${JSON.stringify(data)}`);
        if (data.error.code === 11) {
          if (this.lastResults.final === false) {
            this.lastResults.final = true;
            callback(this.lastResults);
          }
          if (this.liveFile) this.reconnectStreams(this, 'Restartable Error', callback);
        } else {
          this.done = true;
        }
      }
    });
};

module.exports = Google;
