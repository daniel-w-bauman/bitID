const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const multer  = require('multer')
const path = require('path')
const nft = require('./scripts/mint-nft')
var counter = 0;

server.use(express.static('public'))

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only! file: '+file.originalname);
  }
}

let storage = multer.diskStorage({
  destination: './public/',
  filename: function(req, file, cb){
    cb(null, 'ID-' + req.body.name + path.extname(file.originalname));
  }
})

let upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('file')

server.get('/hello', (req, res) => {
  res.end('Hello World')
})

server.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      console.log(err)
      res.sendFile(__dirname + '/public/result.html')
      res.end(err+'')
    } else {
      if(req.file == undefined){
        console.log('Error: undefined file')
        res.end('Error: undefined file')
      } else {
        console.log('uploaded ID-' + req.body.name)
        res.sendFile(__dirname + '/public/result.html')
      }
    }
  })
})

console.log('http://localhost:3000/');
server.listen(3000)
