const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for file
const fileSchema = new Schema({
    
    name: {type: String, required: true},
    key: {type: String, required: true}

});

// Schema for course sections
const sectionSchema = new Schema({

    title: {
        type: String,
        required: true,
    },

    files: [fileSchema],
    
    challengeId: String,

}, { timestamps: true });

// Create model for courses collection

const Section = mongoose.model('course-section', sectionSchema);

module.exports = Section;