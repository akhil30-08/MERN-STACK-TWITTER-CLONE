const multer = require('multer');
const express = require('express');
const tweetRouter = express.Router();
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tweetpictures');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    // res.status(400).send("Only JPEG, PNG, JPG images are supported");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const downloadFile = (req, res) => {
  const fileName = req.params.filename;
  const parentDirectory = path.resolve(__dirname, '..');
  const filePath = path.join(parentDirectory, 'tweetpictures', fileName);

  res.download(filePath, (error) => {
    if (error) {
      res.status(500).send({ meassge: 'File cannot be downloaded ' + error });
    }
  });
};
tweetRouter.get('/tweetpictures/:filename', downloadFile);

module.exports = {
  upload: upload,
  tweetRouter: tweetRouter,
};
