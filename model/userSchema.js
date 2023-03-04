const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({ 
    firstName:{
        type: String,
        required :true
    },
    lastName:{
        type: String,
        required :true
    },
    email:{
        type: String,
        required :true
    },
    password:{
        type: String,
        default: true
    },
    createdAt:{
        type: Date,
        dafault: Date.now
    },
    updatedAt:{
        type: Date,
        dafault: Date.now
    },
})

const User = mongoose.model('users',UserSchema);
exports.User = User