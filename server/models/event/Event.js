const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../user/User');

// Schema for events

const eventSchema = new Schema({

    title: {type: String, required: true},
    description: {type: String, required: true},

    startDatetime: {type: String, required: true},
    endDatetime: {type: String, requird: true},

    user: {type: Schema.Types.ObjectId, ref: User, required: true},
    imgKey: String,

}, { timestamps: true });

// Create model for events collection

const Event = mongoose.model('event', eventSchema);

module.exports = Event;