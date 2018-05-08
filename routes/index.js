var express = require('express');
var router = express.Router();
const recipeController = require('../controllers/recipe_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chef++' });
});

router.get('/demo', function(req, res, next) {
  res.render('tutorial-demo-v1');
});


router.get('/demo', function(req, res, next) {
  res.render('tutorial-demo-v1');
});

router.get('/api/getFavorites',   (req, res, next) => {
    var count = req.query.count
    recipeController.getFavorites(count)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        "status" : "error", 
        "errorMsg" : err.message
      })
    })    
  },
);

router.get('/api/getByID',   (req, res, next) => {
    var id = req.query.id
    recipeController.getByID(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        "status" : "error", 
        "errorMsg" : err.message
      })
    })    
  },
),

router.get('/api/search',   (req, res, next) => {
    var term = req.query.term;
    var limit = req.query.limit;
    var offset = req.query.offset;

    recipeController.getBySearchTerm(term, limit, offset)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        "status" : "error", 
        "errorMsg" : err.message
      })
    })    
  },
)


module.exports = router;
