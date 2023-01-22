const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var addCart = new Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
}
})

var reviewSchema= new Schema({
    ratings:{
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    comment:{
        type:String,
        required: true
    },
    rev_user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' 
    }
},
{
timestamps: true,
});

var Liked= new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' 
    },
},
{
timestamps: true,
});



var ProductSchema = new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    sold_out:  {
        type: Boolean,
        default: false
    },
    damages:{
        type: String,
        default: 'None',
    },
    quantity:{
        type: Number,
        default: 1
    },
    price:{
        type: Currency,
        required: true,
        min: 0,

    },
    location:{
        type: String,
        required: true
    },
    
    images:[{
        type: String,
        
    }],
    how_many_sold:{
        type:Number,
        min: 0,
        increamental: true,
    },
    sold_to:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        paymentMethod:{
            type:String,
            default: 'Cash on delivery'
        },
    }],
    reviews:[reviewSchema],
    addedToCart:[{
        type:String
    }],
    likes:[Liked],
    
},
{
timestamps: true,
});


var Product = mongoose.model('Product', ProductSchema);

module.exports = Product;