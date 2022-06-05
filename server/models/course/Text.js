const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for text
const textSchema = new Schema({
    
    text: {type: String, required: true},

}, {timestamps: true});

// Create model for text collection

const Text = mongoose.model('course-section-text', textSchema);

module.exports = Text;