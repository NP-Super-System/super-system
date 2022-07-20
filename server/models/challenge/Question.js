const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionSchema = require('./Option').schema;

// Schema for questions

const questionSchema = new Schema({

    type: { type: String, required: true, },
    // type: single-answer, multiple-answer, image-upload

    points: { type: Number, required: true, },

    text: { type: String, required: true, },
    imgKey: String,

    options: [OptionSchema],
    submissions: [String],
});

// Create model for question collection

const Question = mongoose.model('question', questionSchema);

module.exports = Question;