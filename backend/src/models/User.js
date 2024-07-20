const mongoose = require('mongoose');

//User Schema file that is used to store and retrieve data from mongodb cloud
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

module.exports = mongoose.model('User', UserSchema);
