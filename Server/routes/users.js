const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
var authenticate = require('../aunthenticate');
var passport = require('passport');

const User = require('../models/AuthUser');
const UserModel = require('../models/User');

router.use(bodyParser.json());

router.post('/login', (req, res, next) => {
    /**Use JWT */
    User.findOne({email:req.body.email})
    .then((user) => {
      if(!user){
        console.log('failed loggin');
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: false, 
          message: 'User does not exist'
        });
      } 
      if(user.password === req.body.password){
        var token = authenticate.getToken({_id: user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully logged in!'});
       
      }else{
        console.log('failed loggin');
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: false, 
          message: 'Invalid username or password'
        });
      }
      
    },(err) => next(err))
    .catch((err) => next(err));
  })

router.post('/signup',(req,res,next)=>{
  User.create(req.body)
  .then((user) => {
    var token = authenticate.getToken({_id: user._id});
      console.log('User Created ', user);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success:true ,user:user,token:token})
  })
  .catch((err) => next(err));
})

router.post('/register/:userid',authenticate.verifyUser, (req, res,next) => {
  var userId = req.params.userid;

  UserModel.create(req.body)
  .then((user) => {

    User.findById(userId)
    .then((user2) => { 
      user2.user_id = user._id;
      user2.save((err, user3) => {
        if(err){
          console.log('failed to Update user');
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: false, 
          message: err
        });
        return;
        }
        console.log('User Registered', user);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({user:user,authUser:user2});
      })
   
    },(err) => next(err))
    .catch((err) => next(err))
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.get('/', (req, res,next) => {
  User.find({})
  .populate("user_id")
  .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
})

router.get('/allusers',authenticate.verifyUser, (req, res,next) => {
  UserModel.find({})
  .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
})
  
router.get('/logout', (req, res,next) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
  });

  module.exports = router;