const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../user/User');

// Schema for announcement

const announcementSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: User, required: true, },
    userUpdate: { type: Schema.Types.ObjectId, ref: User, },
    title: { type: String, required: true, },
    body: { type: String, required: true, },

}, { timestamps: true });

const Announcement = mongoose.model('announcement', announcementSchema);

module.exports = Announcement;