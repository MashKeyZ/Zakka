const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
      
    }
});

var AuthUser = mongoose.model('AuthUser', UserSchema);

module.exports = AuthUser;