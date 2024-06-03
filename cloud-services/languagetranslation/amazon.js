const fs = require('fs');
const nconf = require('nconf');
const decode  = require('../utils/decode');
const winston = require('winston');
const error = winston.loggers.get('error');
const info  = winston.loggers.get('info');
const debug = winston.loggers.get('debug');
const { getAWSConfigWithProxy } = require('../utils/aws-config');
const { TranslateClient, TranslateTextCommand  } = require("@aws-sdk/client-translate");

function Amazon() {
  this.translateConfig = getAWSConfigWithProxy();
  this.Translate = new TranslateClient(this.translateConfig);
  info.info('Amazon Translate config: ', this.translateConfig);
}

Amazon.prototype.translate = function translation(text, source, target, callback) {
  const command = new TranslateTextCommand({ SourceLanguageCode: source,
                                             TargetLanguageCode: target,
                                             Text: text });
  this.Translate.send(command).then(
    (data) => {
      info.info('amazon translation: ', data);
      callback(data, data.TranslatedText);
    },
    (err) => {
      error.error(err, err.message);
    }
  );
};

module.exports = Amazon;
