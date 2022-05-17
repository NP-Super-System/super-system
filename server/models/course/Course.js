const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Section = require('./Section');
const Announcement = require('./Announcement');

// Schema for courses

const courseSchema = new Schema({

    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    sections: [Section],
    announcements: [Announcement],

}, { timestamps: true });

// Create model for courses collection

const Course = mongoose.model('course', courseSchema);

module.exports = Course;