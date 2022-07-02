const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoItemSchema = require('../todolist/TodoItem').schema;

// Schema for users

const userSchema = new Schema({

    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userPicture: String,
    userRoles: {
        type: Array,
    },

    // Other user info
    level: {
        count: {type: Number},
        progress: {type: Number},
    },
    coinCount: {type: Number},
    todolist: [TodoItemSchema],

}, { timestamps: true });

// Create model for users collection

const User = mongoose.model('user', userSchema);

module.exports = User;