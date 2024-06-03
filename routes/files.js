const express = require('express');
const multer = require('multer');
const fs = require('fs');
// const path = require('path');
const File = require('../models/Files');

const router = express.Router();

const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 2 * 1024 * 1024 // 8 MB (max file size)
};

const upload = multer({ dest: 'uploads', limits });

// test route
router.get('/', (req, res) => {
  res.json({ msg: 'Files' });
});

// get all files
router.get('/all', (req, res) => {
  console.log('💾 GET ALL FILES');
  File.find({}, 'name filename')
    .then((files) => {
      res.status(200).json({ files });
    })
    .catch((err) => {
      console.log(console.log('💾 Error in getting files', err));
      res.status(500).send({
        message: '💾 Error in getting files'
      });
    });
});

// add file
router.post('/upload', upload.single('file'), (req, res, _next) => {
  console.log('💾 UPLOAD FILE', req.file);
  const file = fs.readFileSync(req.file.path);
  const encodeFile = file.toString('base64');
  const finalFile = {
    name: req.file.originalname,
    filename: req.file.filename,
    file: {
      data: Buffer.from(encodeFile, 'base64'),
      contentType: req.file.mimetype
    }
  };
  File.create(finalFile)
    .then((_result) => {
      console.log('💾 File successfully uploaded');
      res.status(200).send({
        message: '💾 File successfully uploaded',
        id: _result._id,
        filename: _result.filename
      });
    })
    .then(() => {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error(err);
      }
      // console.log('💾 Clean up file', req.file.path);
    })
    .catch((err) => {
      console.log('💾 Error in file creation', err);
      res.status(500).send({
        message: '💾 Error in file creation'
      });
    });
});

// delete file
router.delete('/delete/:filename', (req, res, _next) => {
  console.log('💾 DELETE FILE', req.params.filename);
  File.findOneAndDelete({ filename: req.params.filename })
    .then(() => {
      res.status(200).send({
        message: '💾 File successfully deleted'
      });
    })
    .catch((err) => {
      console.log(console.log('💾 Error in deleting file', err));
      res.status(500).send({
        message: '💾 Error in deleting file'
      });
    });
});

module.exports = router;
