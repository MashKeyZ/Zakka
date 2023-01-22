const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var ChannelSchema = new Schema({
    key:{
        type : String,
        required: true,
        unique: true,
    },
    user_id_1:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user_id_2:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
timestamps: true,
});


var ComChannel = mongoose.model('ComChannel', ChannelSchema);

module.exports = ComChannel;