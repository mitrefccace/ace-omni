/* eslint-disable no-underscore-dangle */
const express = require('express');
const archiver = require('archiver');
const Experiment = require('../models/Experiment');
const { Call, CallFileArrayFields } = require('../models/Call');

const router = express.Router();

// Moving these functions out of the routes so they can be used directly by socket.js
const createCall = async (name, study, module_, configuration, dir) => {
  const newCall = new Call({
    callName: name,
    studyId: study._id,
    participants: [],
    callDir: dir
  });
  if (module_) {
    // This module might have all the configurations, we don't want to save that here
    newCall.module = { type: module_.type, dataCollection: module_.dataCollection };
  }
  if (configuration) {
    newCall.configuration = configuration;
    // For now we assume the first participant is the caller
    const { participants } = configuration;
    newCall.participants = [
      {
        id: participants[0]._id, name: participants[0].name, extension: participants[0].extension, role: 'Caller'
      },
      {
        id: participants[1]._id, name: participants[1].name, extension: participants[1].extension, role: 'Callee'
      }];

    if (participants[2]) {
      newCall.participants.push({
        id: participants[2]._id, name: participants[2].name, extension: participants[2].extension, role: 'Ca'
      });
    }
  }
  return newCall.save();
};

const findCall = async (callId) => {
  return Call.findOne(
    { _id: callId }
  );
};

const updateCall = async (callId, update) => {
  // Doing this validation up front so a bad update in a batch of updates
  // doesn't leave us with a partially updated call (Not sure how mongoose handles that)
  for (const updateField of Object.keys(update)) {
    if (Call.schema.path(updateField) === undefined) {
      throw new Error(`Invalid call data field: ${updateField}`);
    }
  }
  const setUpdates = {};
  const pushUpdates = {};
  for (const updateField of Object.keys(update)) {
    const fieldType = Call.schema.path(updateField);
    // Note we need to use a different operator ($push) when appending to an array
    // Don't use find() and .save(), its not atomic
    if (fieldType.instance === 'Array') {
      if (update[updateField] instanceof Array) {
        pushUpdates[updateField] = { $each: update[updateField] };
      } else {
        pushUpdates[updateField] = { $each: [update[updateField]] };
      }
    } else {
      setUpdates[updateField] = update[updateField];
    }
  }
  return Call.findOneAndUpdate(
    { _id: callId },
    { $set: setUpdates, $push: pushUpdates },
    { new: true }
  );
};

// Updating an existing object in an array is a special case of updating the call object
// For example, updating the size of a call recording file after the call ends
// You can only update one object in an array at a time
const updateCallFile = async (callId, field, filePath, update) => {
  if (Call.schema.path(field) === undefined) {
    throw new Error(`Invalid call data field: ${update.field}`);
  }
  const setUpdates = {};
  for (const updateField of Object.keys(update)) {
    // To update an existing object within an array,
    // the fieldname looks like: 'audioRecordings.$.fileSize' : 5
    setUpdates[`${field}.$.${updateField}`] = update[updateField];
  }

  const query = { _id: callId };
  query[`${field}.filePath`] = filePath;
  return Call.findOneAndUpdate(
    query,
    { $set: setUpdates },
    { new: true }
  );
};

router.get('/getCall/:callId', (req, res) => {
  Call.findOne({ _id: req.params.callId }, {})
    .then((queryResult) => {
      if (queryResult) {
        res.status(200).json({ queryResult });
      } else {
        res.status(500).json({ result: {} });
      }
    })
    .catch(() => {
      res.status(500).json({ status: 'Failure', msg: 'Server failure.  Please contact your server administrator.' });
    });
});

router.get('/getCalls/:studyId', (req, res) => {
  Call.find({ studyId: req.params.studyId }, {})
    .sort({ startTime: 1 })
    .then((queryResult) => {
      if (queryResult) {
        res.status(200).json({ queryResult });
      } else {
        res.status(500).json({ result: {} });
      }
    })
    .catch(() => {
      res.status(500).json({ status: 'Failure', msg: 'Server failure.  Please contact your server administrator.' });
    });
});

router.get('/getFile/:callId/:fileType/:fileId', (req, res) => {
  const { callId, fileType, fileId } = req.params;
  Call.findOne({ _id: callId }, {})
    .then((queryResult) => {
      if (queryResult) {
        const file = queryResult[fileType]?.find((x) => x._id.toString() === fileId);
        if (file) {
          res.sendFile(file.filePath, {
            root: '.',
            headers: {
              'Content-Type': 'application/octet-stream',
              'Content-Disposition': `attachment;filename=${file.filename}`
            }
          });
        } else {
          res.status(404).json({ status: 'Failure', msg: 'File not found' });
        }
      } else {
        res.status(404).json({ status: 'Failure', msg: 'Call not found' });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: 'Failure', msg: 'Server failure.  Please contact your server administrator.' });
    });
});

router.get('/getCallFiles/:callIds', (req, res) => {
  const archive = archiver('zip', {
    zlib: { level: 2 }
  });
  archive.on('error', (err) => {
    // If the file isn't in the fileystem any more there will be an error we can't do anything about
    console.log(`Error creating zip file: ${err}`);
  });
  const callIds = req.params.callIds.split(',');
  Call.find({ _id: { $in: callIds } }, {})
    .then((queryResults) => {
      if (queryResults) {
        for (const call of queryResults) {
          const callDir = call.callDir.split('/').pop();
          for (const fileArrayType of CallFileArrayFields) {
            // Don't just add the entire call data directory,
            // some files may not be allowed to be downloaded
            for (const file of call[fileArrayType]) {
              archive.file(`./${file.filePath}`, { prefix: callDir, name: file.filename });
            }
          }
        }
        const [dateStr, timeStr] = (new Date()).toISOString().split('T');
        const [hours, mins] = timeStr.split(':');
        res.attachment(`call-data-${dateStr}_${hours}_${mins}.zip`).type('zip');
        archive.on('end', () => res.end());
        archive.pipe(res);
        archive.finalize();
      } else {
        res.status(404).json({ status: 'Failure', msg: 'Calls not found' });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: 'Failure', msg: 'Server failure.  Please contact your server administrator.' });
    });
});

router.post('/createCall', async (req, res) => {
  const body = await req.body;
  try {
    const newCall = await createCall(
      body.name,
      body.study,
      body.module,
      body.configuration,
      body.dir
    );
    res.status(200).send({ call: newCall, msg: 'Successfully created call' });
  } catch (err) {
    res.status(400).send({ msg: `Error creating call: ${err}` });
  }
});

router.post('/updateCall', async (req, res) => {
  const body = await req.body;
  try {
    const updatedCall = await updateCall(body.callId, body.updates);
    res.status(200).send({ call: updatedCall, msg: `Successfully updated call: ${updatedCall}` });
  } catch (err) {
    res.status(400).send({ msg: `Error updating call: ${err}` });
  }
});

router.post('/updateCallFile', async (req, res) => {
  const {
    callId, field, filePath, updates
  } = await req.body;
  try {
    const updatedCall = await updateCallFile(callId, field, filePath, updates);
    res.status(200).send({ call: updatedCall, msg: `Successfully updated call: ${updatedCall}` });
  } catch (err) {
    res.status(400).send({ msg: `Error updating call: ${err}` });
  }
});


module.exports = {
  createCall, findCall, updateCall, updateCallFile, router
};
