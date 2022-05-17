const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for course announcements

const announcementSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    body: String,

}, { timestamps: true });

// Create model for courses collection

const Announcement = mongoose.model('course-announcement', announcementSchema);

module.exports = Announcement;