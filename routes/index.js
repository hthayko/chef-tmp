const _ = require("lodash")
const express = require('express');
const router = express.Router();
const bCrypt = require('bcrypt')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const expressSession = require('express-session');
const userModel = require('../models/user_model')
const urModel = require('../models/ur_model')
const recipeController = require('../controllers/recipe_controller');
const helper = require("../controllers/helper")
router.use(expressSession({secret: 'mySecretKey'}));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

var isAuthenticated = function (req, res, next) {
  console.log("isAuthenticated called: " + req.isAuthenticated())
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

passport.serializeUser(function(userInfo, done) {
  console.log(`serializeUser called with user: ${JSON.stringify(userInfo)}`);
  done(null, userInfo.id);
});
 
passport.deserializeUser(function(id, done) {
  console.log(`deserializeUser called with id: ${id}`);
  userModel.getByID(id)
  .then(userInfo => {
    done(null, userInfo);
  })
  .catch(err => {
    done(err);
  })
});

// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    console.log(`got login called with ${username}, ${password}`)
    // check in mongo if a user with username exists or not
    userModel.getByUsername(username)
    .then(userInfo => {
      // User exists but wrong password, log the error 
      if (!userModel.isValidPassword(userInfo, password)){
        console.log('Invalid Password');
        return done(null, false, req.flash('message', 'Invalid Password'));
      }
      return done(null, userInfo, req.flash('message', 'success'));
    })
    .catch(err => {
      console.log('User Not Found with username '+username);
      return done(null, false, req.flash('message', 'User Not found'));
    })
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      userModel.getByUsername(username)
      .then(userInfo => {
        // already exists
        console.log('User already exists');
        return done(null, false, req.flash('message', 'User already exists'));
      })
      .catch(err => {
        var newUser = {};
        newUser.username = username;
        newUser.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
        // newUser.email = req.body.email;
        // newUser.first_name = req.body.first_name;
        // newUser.last_name = req.body.last_name;

        // save the user
        userModel.addUser(newUser)
        .then((userInfo) => {
          return done(null, userInfo, req.flash('message', 'success'));
        })
        .catch(err => {
          console.log('Error in Saving user: '+err);            
        })
      })
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }))

router.post('/login', passport.authenticate('login', {
  successRedirect: '/loginSuccess',
  failureRedirect: '/loginFail',
  failureFlash : true,
  successFlash : true
}));

router.get('/signout', function(req, res) {
  req.logout();
  res.send('success');
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/loginSuccess',
  failureRedirect: '/loginFail',
  failureFlash : true ,
  successFlash: true
}));

router.get('/loginFail', function(req, res, next) {
  res.send({mes : req.flash('message')})
});

router.get('/loginSuccess', function(req, res, next) {
  res.send({mes : req.flash('message'), user: req.user})
});


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("isAuthenticated is: " + req.isAuthenticated())
  var userInfo = req.user || null;
  recipeController.getFavorites(9)
    .then((data) => {
      res.render('tutorial-demo-v1', {recipes: JSON.stringify(data), user : JSON.stringify(userInfo) });
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        "status" : "error", 
        "errorMsg" : err.message
      })
    })      
});

router.get('/recipe/:id', function(req, res, next) {
  var id = req.params.id;
  recipeController.getByID(id)
  .then((data) => {
    res.render('view_recipe', {recipe : JSON.stringify(data)});
  })
  .catch((err) => {
    console.log(err)
    return res.send({
      "status" : "error", 
      "errorMsg" : err.message
    })
  })      
  
});


router.get('/api/getFavorites',  (req, res, next) => {
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
);

router.post('/api/addSaved', isAuthenticated, (req, res, next) => {

    urModel.addUR(req.user.id, req.body.recipe_id)
    .then((data) => {
      res.send("OK")
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

router.post('/api/removeSaved', isAuthenticated, (req, res, next) => {
    urModel.removeUR(req.user.id, req.body.recipe_id)
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

router.get('/api/getSaved', isAuthenticated, (req, res, next) => {
    urModel.getByUserID(req.user.id)
    .then(recipes => {
      var ret = _.map(recipes, helper.formatRecipe)
      res.send(ret)
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


router.post('/api/addRecipe', isAuthenticated, (req, res, next) => {
    console.log("got hit with:")
    console.log(req.body)
    recipeController.addRecipe(req.body)
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


module.exports = router;
