const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
var authenticate = require('../aunthenticate');

const Product = require('../models/Product');
const User = require('../models/User');

router.use(bodyParser.json());

//– http://localhost:3000/Product
router.route('/')
.all((req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get((req,res,next) => {
    //return all products 
    Product.find({})
    .then((Product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Product);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})


//http://localhost:3000/products/additem/:userId

router.post('/additem/:_Id',authenticate.verifyUser,(req, res, next) => {
    Product.create(req.body)
    .then((item) => {
      item.user_id = req.params._Id 
      item.save((err,result)=>{
        if (err){
            res.statusCode = 500;
            res.json({error:err});
            return;
        }
        console.log('User Created ', result);

        //update users products
        User.findById(req.params._Id)
        .then((user)=>{
            user.products.push(item._id)
            user.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success:true ,product:result})
        })
      })
     
  })
  .catch((err) => {
    
    res.json({error: err})});

})

//get product by id
//http://localhost:3000/products/:productId
router.route('/:_Id',)
.all(authenticate.verifyUser,(req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get(authenticate.verifyUser,(req,res,next) => {
    
    Product.findById(req.params._Id)
    .then((item) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    }, (err) => next(err))
    .catch((err) =>{res.json({"error":err}) });
    
})


//buy product
//http://localhost:3000/products/buy/:productId
router.post('/buy/:productId',authenticate.verifyUser,(req,res,next)=>{
    Product.findById(req.params.productId)
    .then((product)=>{
        if(product.sold_out|| req.body.quantity>product.quantity){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({success:false,message:"Purchase Failed"});
            return;
        }

        product.quantity = product.quantity - req.body.quantity;
        product.sold_to.push({userId:req.body.buyerId,paymentMethod:req.body?.paymentMethod});
        if(product.quantity===0){
            product.sold_out = true;
        }

        product.save((err,item)=>{
            User.findById(req.body.buyerId)
            .then((user)=>{
                user.boughtItems.push(item._id);
                user.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true,message:"Product bought"});
            })
        });


    })
})

module.exports = router;
