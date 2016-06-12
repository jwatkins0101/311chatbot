var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('public/index.html');
});

router.get('/chat', function(req, res) {
  res.send({
    isCard: true,
    cards: [{
      image_url: 'http://lorempixel.com/400/200',
      title: 'A card!',
      subtitle: 'structured response',
      buttons: [{
        title: 'a button',
        url: '#'
      }, {
        title: 'another button',
        url: '#'
      }]
    }]
  });
});

router.get('/webhook', require("./webhook").get)
router.post('/webhook', require("./webhook").post)

module.exports = router;
