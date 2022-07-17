const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionSchema = require('./Option').schema;

// Schema for questions

const questionSchema = new Schema({

    // isMultipleAns: { type: Boolean, required: true, },
    // isImageUpload: { type: Boolean, required: true, },
    type: { type: String, required: true, },
    /*
        single-answer, multiple-answer, image-upload
    */
    points: { type: Number, required: true, },

    text: { type: String, required: true, },
    imgKey: String,

    options: [OptionSchema],

});

// Create model for question collection

const Question = mongoose.model('question', questionSchema);

module.exports = Question;