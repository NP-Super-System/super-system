const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for todo item

const todoitemSchema = new Schema({

    body: {
        type: String,
        required: true,
    },
    checked: Boolean,

}, { timestamps: true });

// Create model for todo item collection

const TodoItem = mongoose.model('todoitem', todoitemSchema);

module.exports = TodoItem;