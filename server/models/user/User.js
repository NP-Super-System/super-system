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

    // Other user info
    todolist: [TodoItemSchema],

}, { timestamps: true });

// Create model for users collection

const User = mongoose.model('user', userSchema);

module.exports = User;