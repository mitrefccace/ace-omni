const got = require('got');
const tunnel = require('tunnel');
const { v4: uuidv4 } = require('uuid');

const winston = require('winston');
const logger = require('../utils/logger')
const error = winston.loggers.get('error');
const info = winston.loggers.get('info');
const debug = winston.loggers.get('debug');

// function Azure() {}

function Azure(configs) {
  this.subscriptionKey = configs.key;
  this.endpoint = configs.url;
  this.region = configs.location;
  this.proxy = configs.proxy;
}

Azure.prototype.translate = function translation(text, source, target, callback) {
  info.info('text ,', text);
  info.info('source ,', source);
  info.info('target ,', target);
  const options = {
    prefixUrl: this.endpoint,
    searchParams: {
      'api-version': '3.0',
      'to': target,
    },
    headers: {
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      'Ocp-Apim-Subscription-Region': this.region,
      'Content-type': 'application/json',
      'X-ClientTraceId': uuidv4().toString(),
    },
    responseType: 'json',
    json: [
      {
        text,
      },
    ]
  };

  if(this.proxy){
    if(this.proxy.protocol==='https:'){
      options.agent={ https: tunnel.httpsOverHttps({
        proxy: {
          host: this.proxy.hostname,
          port: this.proxy.port
        }
      })};
    }
    else{
      options.agent={ https: tunnel.httpsOverHttp({
        proxy: {
          host: this.proxy.hostname,
          port: this.proxy.port
        }
      })};
    }
  }
  got.post('translate', options).then(response => {
    info.info(JSON.stringify(response.body[0].translations[0].text, null, 4));
    callback(null, response.body[0].translations[0].text);
  })
  .catch(err => {
    error.error(err.response.body);
    callback(err.response.body, '');
  });
};

module.exports = Azure;
