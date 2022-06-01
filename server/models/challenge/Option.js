const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for questions

const optionSchema = new Schema({

    text: { type: String, required: true, },
    isCorrect: { type: Boolean, required: true, },

});

// Create model for question collection

const Option = mongoose.model('option', optionSchema);

module.exports = Option;