/*
 *                   NOTICE
 *
 *                   This (software/technical data) was produced for the U. S. Government under
 *                   Contract Number HHSM-500-2012-00008I, and is subject to Federal Acquisition
 *                   Regulation Clause 52.227-14, Rights in Data-General. No other use other than
 *                   that granted to the U. S. Government, or to those acting on behalf of the U. S.
 *                   Government under that Clause is authorized without the express written
 *                   permission of The MITRE Corporation. For further information, please contact
 *                   The MITRE Corporation, Contracts Management Office, 7515 Colshire Drive,
 *                   McLean, VA 22102-7539, (703) 983-6000.
 *
 *                                           ©2018 The MITRE Corporation.
 *                                          */
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const GrowingFile = require('growing-file');
const { IamAuthenticator, BearerTokenAuthenticator } = require('ibm-watson/auth');
const tunnel = require('tunnel');

function Watson(file, configs, langCode, background, speechDetector, dialect) {
  console.log('hi');
  this.file = file;
  this.authtype = configs.authtype;
  this.apikey = configs.apikey;
  this.url = configs.url;
  this.model = 'en-US_BroadbandModel';
  this.dialect = 'en-US';
  //this.proxy = '<proxyid>';
  //this.proxy_port = '<proxyport>';
  this.contentType = 'audio/webm; rate=48000';
  this.smart_formatting = true;
  this.background = background;
  this.speechDetector = speechDetector;
}

Watson.prototype.start = function start(callback) {
  console.debug('starting watson');
  console.debug(`file: ${this.file}`);

  const authParams = {};

  const speechToTextParams = {
    url: this.url,
    disableSslVerification: true
  };

  if (this.proxy) {
    const agent = tunnel.httpsOverHttp({
      proxy: {
        host: this.proxy,
        port: this.proxy_port
      }
    });
    authParams.httpsAgent = agent;
    authParams.proxy = false;
    speechToTextParams.httpsAgent = agent;
    speechToTextParams.proxy = false;
  }

  if (this.authtype === 'bearer_token') {
    authParams.bearerToken = this.apikey;
    speechToTextParams.authenticator = new BearerTokenAuthenticator(authParams);
  } else {
    authParams.apikey = this.apikey;
    speechToTextParams.authenticator = new IamAuthenticator(authParams);
  }

  const gf = GrowingFile.open(this.file, {
    timeout: 25000,
    interval: 100
  });

  const speechToText = new SpeechToTextV1(speechToTextParams);

  const recognizeParams = {
    content_type: this.contentType,
    smartFormatting: this.smart_formatting,
    wordConfidence: true,
    timestamps: true,
    interimResults: true,
    model: this.model,
    dialect: this.dialect,
    objectMode: true,
    // backgroundAudioSuppression: this.background,
    // speechDetectorSensitivity: this.speechDetector,
    lowLatency: true,
    profanityFilter: false,
    inactivityTimeout: 300
  };

  const recognizeStream = speechToText.recognizeUsingWebSocket(recognizeParams)
    .on('data', (data) => {
      const results = {
        transcript: data.results[0]?.alternatives[0].transcript,
        final: data.results[0]?.final,
        timestamp: new Date()
      };

      callback(results);
    })
    .on('open', () => {
      console.info('Websocket to watson is open. Resume GrowingFile.');
      gf.resume();
    })
    .on('error', (err) => {
      console.debug(err.toString());
    });

  //  _write is usually reserved for piping a filestream
  // due to an issue with back pressure callback not unpausing
  // the data stream pipe() was switched to this event handler
  let first = true;
  gf.on('data', (data) => {
    // callback is required by _write, omitting it will crash the service.
    recognizeStream._write(data, null, () => true);
    if (first) {
      gf.pause();
      first = false;
    }
  }).on('end', () => {
    console.info('FILE HAS ENDED');
    recognizeStream.finish();
    callback({ end: true });
  });
};

module.exports = Watson;
