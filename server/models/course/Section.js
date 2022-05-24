const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for course sections

const sectionSchema = new Schema({

    title: {
        type: String,
        required: true,
    },

    files: [String],
    
    challengeId: String,

}, { timestamps: true });

// Create model for courses collection

const Section = mongoose.model('course-section', sectionSchema);

module.exports = Section;