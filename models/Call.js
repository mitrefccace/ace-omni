const mongoose = require('mongoose');

const { Schema } = mongoose;

const participantSchema = Schema({
  id: { type: Schema.Types.ObjectId, default: null },
  name: { type: String, default: '' },
  extension: { type: String, default: '' },
  role: {
    type: String,
    enum: ['Caller', 'Callee', 'Ca'],
    default: 'Caller'
  }
});

const transcriptSchema = Schema({
  participantName: { type: String, default: '' },
  participantExtension: { type: String, default: '' },
  provider: { type: String, default: '' },
  filename: { type: String, default: '' },
  filePath: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  type: {
    type: String,
    enum: ['AsrStream', 'TranslateStream'],
    default: 'AsrStream'
  }
});

const audioSchema = Schema({
  participantName: { type: String, default: '' },
  participantExtension: { type: String, default: '' },
  filename: { type: String, default: '' },
  filePath: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  source: {
    type: String,
    enum: ['Mic', 'Out'], // 'Mic' is pure microphone input, 'Out' is final output after packet loss or background noise injection
    default: 'Mic'
  }
});

const recordingSchema = Schema({
  participantName: { type: String, default: '' },
  participantExtension: { type: String, default: '' },
  filename: { type: String, default: '' },
  filePath: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  type: {
    type: String,
    enum: ['UserInterfaceStream', 'VideoStream', 'Other'],
    default: 'UserInterfaceStream'
  }
});

const CallSchema = Schema({
  studyId: { type: Schema.Types.ObjectId, ref: 'Experiment' },
  module: { type: Object, default: {} },
  configuration: { type: Object, default: {} },
  callName: { type: String, default: '' },
  callDir: { type: String, default: '' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: null },
  duration: { type: Number, default: 0 },
  participants: { type: [participantSchema], default: [] },
  transcripts: { type: [transcriptSchema], default: [] },
  audioRecordings: { type: [audioSchema], default: [] },
  screenRecordings: { type: [recordingSchema], default: [] },
  videoRecordings: { type: [recordingSchema], default: [] },
  otherData: { type: [recordingSchema], default: [] }
}, { timestamps: { createdAt: true, updatedAt: true } });

// Convenient to be able to list these fields, because sometimes you have to handle them differently
const CallArrayFields = [];
const CallFileArrayFields = [];
CallSchema.eachPath((pathName, schemaType) => {
  if (schemaType instanceof Schema.Types.Array) {
    CallArrayFields.push(pathName);
    if (pathName !== 'participants') {
      CallFileArrayFields.push(pathName);
    }
  }
});

module.exports = { Call: mongoose.model('Call', CallSchema), CallArrayFields, CallFileArrayFields };
