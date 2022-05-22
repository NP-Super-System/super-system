const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = require('./Section').schema;
const AnnouncementSchema = require('../announcement/Announcement').schema;

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
    sections: [SectionSchema],
    announcements: [AnnouncementSchema],

}, { timestamps: true });

// Create model for courses collection

const Course = mongoose.model('course', courseSchema);

module.exports = Course;