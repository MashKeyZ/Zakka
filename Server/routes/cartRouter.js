var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var authenticate = require('../aunthenticate');

const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

router.use(bodyParser.json());
/* GET . */
//http://localhost:3000/cart/:userId
router.get('/:userId',authenticate.verifyUser,(req, res, next)=> {
    Cart.findOne({user_id:req.params.userId})
    .populate("user_id","products.product.item")
    .then((cart) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart); 
    }, (err) => next(err))
    .catch((err) => next(err));
});

//Add items to cart
//http://localhost:3000/cart/additem/:userId
/**
 * {
 "quantity":2,
 "item":"6399703ec4e77ea7b5e8e199"
}
 */
router.post('/additem/:userId',authenticate.verifyUser,(req, res, next)=> {
    Cart.findOne({user_id:req.params.userId})
    .then((cart) => {

            if(cart){
                Product.findById(req.body.item)
                .then((product)=>{
                    let array= product.addedToCart
                    var set = new Set(array)
                    console.log(set)
                    console.log(set.has(req.params.userId))

                    if(set.has(req.params.userId)){
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(cart); 
                    }else{
                       
                        product.addedToCart.push(req.params.userId)
                        console.log("After Adding : "+product.addedToCart)
                        product.save()

                        cart.products.push({item: req.body.item, quantity: req.body.quantity})
                        cart.save()
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(cart); 
                    }
                    
                })
                
            }else{
                Cart.create({
                    user_id: req.params.userId, 
                    products:[{
                        item: req.body.item,
                        quantity: req.body.quantity
                    }]})
                    .then((newCart)=>{
                        Product.findById(req.body.item)
                        .then((product)=>{
                           // console.log(product);
                            product.addedToCart.push(req.params.userId)
                            console.log(product.addedToCart+" cart")
                            product.save((err,item)=>{
                                console.log("error ",err)
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(newCart)
                            })
                        })
                        
                    })
                    .catch((err) => next(err));
            }
        
    }, (err) => next(err))
    .catch((err) => next(err));
});

//Remove item from cart
//http://localhost:3000/cart/remove/:userId
router.post('/remove/:userId',authenticate.verifyUser,(req, res, next)=> {
    Cart.findOne({user_id:req.params.userId})
     //.populate("products.product.item")
    .then((cart) => {
                console.log(cart)
                cart.updateOne({},{$pull:{item:req.body.item}},(err,result)=>{
                    if(err){
                        next(err)
                    }else{
                        console.log(result)
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(result); 
        
                    }
                });
                
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
