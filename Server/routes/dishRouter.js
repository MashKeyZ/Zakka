const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
var authenticate = require('../aunthenticate');

router.use(bodyParser.json());

//– http://localhost:3000/dishes
router.route('/')
.all((req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get(authenticate.verifyUser,(req,res,next) => {

        res.end('Will send all the dishes to you!');
})
.post(authenticate.verifyUser,(req, res, next) => {
  res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser,(req, res, next) => {
  res.end('Deleting all dishes');
});
//– http://localhost:3000/dishes/:dishId

router.route('/:dishId')
.all((req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get(authenticate.verifyUser,(req,res,next) => {
   
  res.end('Will	send	details	of	the	dish:	'+	req.params.dishId +'	to	you!')
    
})
.post(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST is not supported for /dishes/'+	req.params.dishId);
})
.put(authenticate.verifyUser,(req, res, next) => {
  
  res.end('Will	update dishId:	'+	req.params.dishId +'	with the following details, \nName : ' + req.body.name + '\nDescription ' + req.body.description)
})
.delete(authenticate.verifyUser,(req, res, next) => {
    res.end('Will	delete dishId : '+	req.params.dishId )
});

module.exports = router;
