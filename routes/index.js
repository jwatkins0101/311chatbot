var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('public/index.html');
});

router.get('/chat', function(req, res) {
  res.send('You said ' + req.body);
});

router.get('/webhook', require("./webhook").get);
router.post('/webhook', require("./webhook").post);

// Location endpoints
router.get('/verifylocation', require('./verifylocation').post);
router.get('/report', require('./report').post);

module.exports = router;
