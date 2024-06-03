const express = require('express');
const fs = require('fs');

const router = express.Router();

// test route
router.get('/', (req, res) => {
  res.json({ msg: 'Admin' });
});

router.get('/getCredentials/:account', (req, res) => {
  const { account } = req.params;
  if (account.indexOf('.') == -1) {
    try {
      const data = JSON.parse(
        fs.readFileSync(`./cloud-services/configs/${account}.json`)
      );
      res.status(200).json({ data });
    } catch (error) {
      res.status(400).json({ message: `Config File Not Found [${account}]` });
    }
  } else {
    res.status(400).json({ message: `Config File Not Found [${account}]` });
  }
});

module.exports = router;
