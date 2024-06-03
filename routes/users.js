const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/Users');

const router = express.Router();

/* let dbURI = '';
if (config.db.mongo.host && config.db.mongo.port && config.db.mongo.dbname) {
  dbURI = `${config.db.mongo.host}://${config.db.mongo.url}:${config.db.mongo.port}/${config.db.mongo.dbname}`;
} */

router.get('/getUsers', (req, res) => {
  User.find({}, {
    id: 1,
    role: 1,
    username: 1,
    firstname: 1,
    lastname: 1
  })
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

router.post('/deleteUser', (req, res) => {
  const id = req.body.id
  if (typeof id == 'string') {
    User.deleteOne({ _id: id })
      .then((queryResult) => {
        if (queryResult) {
          res.status(200).json({ msg: 'Successful delete' });
        } else {
          res.status(500).json({ msg: 'Failure in deletion' });
        }
      })
      .catch(() => {
        res.status(500).json({ status: 'Failure', msg: 'Server failure.  Please contact your server administrator.' });
      });
  } else {
    res.status(500).json({ msg: 'Failure in deletion' });
  }
});

router.post('/addUser', (req, res) => {
  console.log(`GOT USER ${JSON.stringify(req.body)}`);
  const { username } = req.body;
  const { strPword } = req.body;
  const { firstname } = req.body;
  const { lastname } = req.body;
  const { role } = req.body;
  if (typeof username == 'string') {
    User.findOne({ username: username }, { username: 1 })
      .then((queryResult) => {
        if (!queryResult) {
          // TODO Add a validator for user input
          bcrypt.hash(strPword, 10, (err2, hash) => {
            if (err2) {
              console.log(`Hashing error: ${err2}`);
            }
            const newUser = new User({
              firstname,
              lastname,
              role,
              username,
              password: hash,
              accountLocked: false,
              logins: [],
              studies: []
            });

            newUser.save()
              .then((res2) => {
                res.status(200).send({ msg: `Successfully added user: ${res2}` });
              })
              .catch((err3) => {
                res.status(400).send({ msg: `Error creating profile: ${err3}` });
              });
          });
        } else {
          console.log('ALREADY IN DB');
          res.status(400).json({ status: 'Failure', msg: 'Incorrect username or password' });
        }
      })
      .catch(() => {
        res.status(500).json({ status: 'Failure', msg: 'Server failure.  Please contact your server administrator.' });
      });
  } else {
    res.status(400).json({ status: 'Failure', msg: 'Incorrect username or password' });
  }
});

router.post('/login', (req, res) => {
  const { username } = req.body;
  if (typeof username == 'string') {
    User.findOne({ username: req.body.username }, { password: 1, role: 1 })
      .then((queryResult) => {
        // console.log(`RESULT ${JSON.stringify(queryResult)}`);
        if (req.body.strPword && queryResult) {
          bcrypt.compare(req.body.strPword, queryResult.password, (err2, valid) => {
            if (valid) {
              res.json({ status: 'Success', msg: 'Successful login.', role: queryResult.role });
            } else {
              res.json({ status: 'Failure', msg: 'Incorrect username or password' });
            }
          });
        } else {
          res.json({ status: 'Failure', msg: 'Incorrect username or password' });
        }
      })
      .catch(() => {
        res.json({ status: 'Failure', msg: 'Server failure.  Please contact your server administrator.' });
      });
  } else {
    res.json({ status: 'Failure', msg: 'Incorrect username or password' });
  }
});

module.exports = router;
