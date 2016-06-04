var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('public/index.html');
});

router.get('/chat', function(req, res) {
  res.send('You said ' + req);
  console.log(req);
});

module.exports = router;
