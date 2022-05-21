const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for announcement

const announcementSchema = new Schema({

    user: { type: Schema.Types.ObjectId, required: true, },
    title: { type: String, required: true, },
    body: { type: String, required: true, },

}, { timestamps: true });

const Announcement = mongoose.model('announcement', announcementSchema);

module.exports = Announcement;