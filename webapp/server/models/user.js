// import dependencies
const mongoose = require("mongoose");

// Base Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String, 
        required: true,
    },
});

const User = mongoose.model('User', userSchema)

module.exports = User;