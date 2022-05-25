const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = require('./File').schema;

// Schema for course sections
const sectionSchema = new Schema({

    title: {
        type: String,
        required: true,
    },

    files: [FileSchema],
    
    challengeId: String,

}, { timestamps: true });

// Create model for courses collection

const Section = mongoose.model('course-section', sectionSchema);

module.exports = Section;