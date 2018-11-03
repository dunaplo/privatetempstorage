var express = require('express');
var multer  = require('multer');
const getSize = require('get-folder-size');

var MAXSIZE = 20 * 1000 * 1000;
var MAXCOUNT = 5;

var storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'uploads')
 },
 filename: function (req, file, cb) {
   cb(null, file.originalname)
 }
})

var upload = multer({ 
 storage: storage, 
 limits: {fileSize: MAXSIZE, files: MAXCOUNT}
})

var app = express();

app.use('/q/download', express.static('uploads'));

app.get('/q', function (req, res) {
 getSize(__dirname + '/uploads/', (err, size) => {
  if (err) { throw err; }

  const size_bytes = size;
  const size_mb = (size / 1024 / 1024).toFixed(2);
  console.log(size_bytes + ' bytes / ' + size_mb + ' MB');
  if (size_mb > 20) res.send('files size is over 20MB');
  else res.sendFile(__dirname + '/index.html');
});
  
});

app.post('/upload_file', upload.single('name_upload_file'), function(req, res) {
  res.send('uploaded');
  console.log(req.file)
})

app.listen(80, function () {
  console.log('PTS app listening on port 80!');
});