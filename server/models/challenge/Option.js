const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for questions

const optionSchema = new Schema({

    text: { type: String, },
    isCorrect: { type: Boolean, },

});

// Create model for question collection

const Option = mongoose.model('option', optionSchema);

module.exports = Option;