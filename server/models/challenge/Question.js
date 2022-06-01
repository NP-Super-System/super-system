const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionSchema = require('./Option').schema;

// Schema for questions

const questionSchema = new Schema({

    isMultipleAns: { type: Boolean, required: true, },

    text: { type: String, required: true, },

    options: [OptionSchema]

});

// Create model for question collection

const Question = mongoose.model('question', questionSchema);

module.exports = Question;