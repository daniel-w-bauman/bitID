const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const multer  = require('multer')
const path = require('path')
const nft = require('./scripts/mint-nft')
const upload = require("./ImageUpload");
const singleUpload = upload.single("file");

var counter = 0;

server.use(express.static('public'))

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.get('/hello', (req, res) => {
  res.end('Hello World')
})

server.post('/upload', (req, res) => {
  const name = req.body.name

  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }

    let update = { profilePicture: req.file.location };
    nft.mintNFT(req.file.location+'')
    res.end(req.file.location+'')
  })
})

console.log('Listening at http://localhost:'+(process.env.PORT || 5000));
server.listen(process.env.PORT || 5000)
