const mongoose = require('mongoose');

// Schema
const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "Username is already exists"],
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 4
    },
    address: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
});

usersSchema.index({ name: 1, username: 1 }, { unique: false });

// Collection create
const Users = new mongoose.model('Users', usersSchema);

module.exports = Users;