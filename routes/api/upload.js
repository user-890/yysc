const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const config = require('config');
const db = config.get('mongoURI');

const storage = require('multer-gridfs-storage')({
  url: db,
  options: {
    useNewUrlParser: true
  },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'resource-file'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage: storage });

router.post('/', [auth, upload.array('file')], async (req, res) => {
  /***/
});

module.exports = router;
