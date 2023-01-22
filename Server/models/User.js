const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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


var UserSchema = new Schema({
    userName:{
        type: String,
        required: true
    },firstName:{
        type: String,
        required: true
    },lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    admin:  {
        type: Boolean,
        default: false
    },
    institution:{
        type: String,
        required: true
    },
    studentEmail:{
        type: String,
        default: '',
    },
    campus:{
        type: String,
        default: '',
    },
    city:{
        type: String,
        required: true
    },
    phoneNumber:{
        type : String,
        required: true
    },
    reviews:[reviewSchema],
    comChannel:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'ComChannel'
    }],
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    boughtItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});


var User = mongoose.model('User', UserSchema);

module.exports = User;