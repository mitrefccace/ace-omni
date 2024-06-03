const express = require('express');
const Experiment = require('../models/Experiment');

const router = express.Router();
// const mongoose = require('mongoose');
// const Experiment = require('../models/Experiment.js');

/* GET experiment listing. */
/*
router.get('/:expurl', (req, res, _next) => {
  console.log('DB CALL HERE:', req.params.expurl);

  // Experiment.findOne({'url':req.params.expurl}, function (err, exp) {
  //   if (err) return next(err);
  //   res.json(exp);
  // });

  switch (req.params.expurl) {
    case 'test':
      res.json({ msg: 'Test Complete' });
      break;
    case 'abc':
      res.json({ msg: 'ABC complete' });
      break;
    default:
      res.json({ msg: 'Default page' });
      break;
  }
});
*/

router.get('/getExperiment/:studyAlias', (req, res) => {
  Experiment.find({ alias: req.params.studyAlias }, {})
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

router.get('/getExperiments/:userid', (req, res) => {
  Experiment.find({ createdBy: req.params.userid }, {})
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

router.post('/createExperiment', async (req, res) => {
  const { experiment } = await req.body;
  await Experiment.findOne({ alias: experiment.alias }, {})
    .then((err, queryResult) => {
      if (!err) {
        if (!queryResult) {
          // TODO Add a validator for user input
          console.log('Make a new entry');
          const newExperiment = new Experiment({
            name: experiment.name,
            phase: experiment.phase,
            alias: experiment.alias,
            description: experiment.description,
            purpose: experiment.purpose,
            createdBy: experiment.createdBy,
            modifiedBy: experiment.modifiedBy,
            lastUsedBy: experiment.lastUsedBy,
            // lastModifiedDate: experiment.lastModifiedDate,
            modules: experiment.modules,
            callData: experiment.callData
          });
          newExperiment.save()
            .then((res2) => {
              res.status(200).send({ msg: `Successfully added study: ${res2}` });
            })
            .catch((err3) => {
              res.status(400).send({ msg: `Error creating study: ${err3}` });
            });
        } else {
          console.log('ALREADY IN DB');
          res.status(400).json({ status: 'Failure', msg: 'This study already exists.' });
        }
      } else {
        console.log('ERROR');
        res.status(500).json({
          status: 'Failure', msg: 'Server failure.  Please contact your server administrator.'
        });
      }
    });
});

// Update Experiment
router.post('/updateExperiment', async (req, res) => {
  const { alias, experiment } = await req.body;
  const options = { new: true, returnDocument: 'after' };
  await Experiment.findOneAndUpdate({ alias }, experiment, options)
    .then((queryResult) => {
      console.log('queryResult', queryResult);
      res.status(200).send({ msg: `Successfully Updated Experiment: ${alias}` });
    })
    .catch((err) => {
      console.log('Error Updating Experiment:', err);
      res.status(500).json({ status: 'Failure', msg: 'Server failure.  Please contact your server administrator.' });
    });
});

module.exports = router;
