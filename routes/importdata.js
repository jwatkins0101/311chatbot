var express = require('express'),
    router = express.Router(),
    dataimporter = require('../scripts/dataimporter');

/* GET users listing. */
router.get('/', function (req, res, next) {
    dataimporter();
    res.send('Data imported?');
});

module.exports = router;
