const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var product= new Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity:{
        type: Number,
        Min: 1,
    }
});

var cartSchema = new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products:[product]
    
});



var Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;