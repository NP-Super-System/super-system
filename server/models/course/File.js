const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for file
const fileSchema = new Schema({
    
    name: {type: String, required: true},
    key: {type: String, required: true}

}, {timestamps: true});

// Create model for files collection

const File = mongoose.model('course-section-files', fileSchema);

module.exports = File;