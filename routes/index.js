var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chef++' });
});

router.get('/demo', function(req, res, next) {
  res.render('tutorial-demo-v1');
});

module.exports = router;
