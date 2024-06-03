const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const File = require('./Files');

const { Schema } = mongoose;

const moduleSchema = Schema({
  type: { type: String },
  configurations: [
    {
      name: { type: String, default: '' },
      participants: [
        {
          name: { type: String, default: '' },
          extension: { type: String, default: '' },
          userInterface1: {
            IncomingAudio: {
              MonoAudio: { type: Boolean, default: false },
              SpeakerBalanceR: { type: Number, default: 0 },
              SpeakerBalanceL: { type: Number, default: 0 }
            }
          },
          audioStream1: {
            includeDistortionCorruption: {
              injectBackgroundNoise: { type: Boolean, default: false },
              audioFile: { type: Schema.Types.ObjectId, ref: 'File' },
              injectSource: { type: String, default: '' },
              simulatePacketDrops: { type: Boolean, default: false },
              packetDropSource: { type: String, default: '' },
              packetDropDuration: { type: Number, default: 0 },
              repetitionInterval: {
                interval: { type: String, default: '' },
                fromSecs: { type: Number, default: 0 },
                toSecs: { type: Number, default: 0 }
              }
            },
            audioControlFilters: {
              audioFilter: { type: Boolean, default: false },
              filterType: { type: String, default: '' },
              filterSource: { type: String, default: '' },
              frequency: { type: Number, default: 0 },
              rollOff: { type: Number, default: 0 },
              gain: { type: Number, default: 0 },
              pitch: { type: Number, default: 0 },
              quality: { type: Number, default: 0 }
            }
          },
          ASR1: {
            engineSTT: { type: String, default: '' },
            showFinalizedCaptionsOnly: { type: Boolean, default: false },
            punctuation: { type: Boolean, default: false },
            errorSimulation: { type: Boolean, default: false },
            googleCloudSpeechV2: { type: Boolean, default: false },
            dropoutInterval: { type: Number, default: 0 },
            dropoutLength: { type: Number, default: 0 },
            captionDelay: { type: Number, default: 0 },
            // captionLatency: { type: Number, default: 0 },
            backgroundAudioSuppression: { type: Number, default: 0 },
            speechDetectorSensitivity: { type: Number, default: 0 },
            translationSTT: { type: Boolean, default: false },
            translationEngine: { type: String, default: '' },
            participant1Speech: { type: String, default: '' },
            participant2Captions: { type: String, default: '' }
          },
          userInterface2: {
            captions: {
              showCaptions: { type: String, default: '' },
              captionSpeed: { type: String, default: '' },
              captionFormat: {
                senderLabel: { type: Boolean, default: false },
                receiverLabel: { type: Boolean, default: false },
                horizontalRule: { type: Boolean, default: false }
              },
              captionAppearance: { type: String, default: '' },
              captionJustification: { type: String, default: '' }
            },
            IncomingAudio: {
              MonoAudio: { type: Boolean, default: false },
              SpeakerBalanceR: { type: Number, default: 0 },
              SpeakerBalanceL: { type: Number, default: 0 }
            }
          },
          audioStream2: {
            includeDistortionCorruption: {
              injectBackgroundNoise: { type: Boolean, default: false },
              audioFile: { type: Schema.Types.ObjectId, ref: 'File' },
              injectSource: { type: String, default: '' },
              simulatePacketDrops: { type: Boolean, default: false },
              packetDropSource: { type: String, default: '' },
              packetDropDuration: { type: Number, default: 0 },
              repetitionInterval: {
                interval: { type: String, default: '' },
                fromSecs: { type: Number, default: 0 },
                toSecs: { type: Number, default: 0 }
              }
            },
            audioControlFilters: {
              audioFilter: { type: Boolean, default: false },
              filterType: { type: String, default: '' },
              filterSource: { type: String, default: '' },
              frequency: { type: Number, default: 0 },
              rollOff: { type: Number, default: 0 },
              gain: { type: Number, default: 0 },
              pitch: { type: Number, default: 0 },
              quality: { type: Number, default: 0 }
            }
          }
        }
      ]
    }
  ],
  dataCollection: {
    Transcripts: {
      ASRcaptionStream: { type: Boolean, default: true },
      TranslationEngine: { type: Boolean, default: true }
    },
    AudioRecordings: {
      AudioStream1: { type: Boolean, default: true },
      AudioStream2: { type: Boolean, default: true }
    },
    ScreenRecordings: {
      UserInterface1: { type: Boolean, default: true },
      UserInterface2: { type: Boolean, default: true }
    },
    VideoRecordings: {
      Video1: { type: Boolean, default: true },
      Video2: { type: Boolean, default: true }
    },
    OtherData: {
      ASRrawdata: { type: Boolean, default: true }
    }
  }
});

const ExperimentSchema = new Schema({
  name: { type: String, required: true },
  phase: { type: String, required: true },
  alias: { type: String, required: true },
  description: { type: String, default: 'Default Study Description' },
  purpose: { type: String, default: 'Default Study Purpose' },
  createdBy: { type: String, required: true },
  modifiedBy: { type: String, required: true },
  lastUsedBy: { type: String, required: true },
  modules: { type: [moduleSchema] }
}, { timestamps: { createdAt: true, updatedAt: 'lastModifiedDate' } });

module.exports = mongoose.model('Experiment', ExperimentSchema);
