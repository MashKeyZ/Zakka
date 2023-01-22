const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var messageSchema = new Schema({
    key:{
        type : String,
        required: true,
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message:{
        type:String,
        required: true
    }
},
{
timestamps: true,
});


var Message = mongoose.model('Message', messageSchema);

module.exports = Message;