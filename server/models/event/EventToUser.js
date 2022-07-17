const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../user/User');
const Event = require('./Event');

// Event-user relationship

const eventToUserSchema = new Schema({

    user: { type: Schema.Types.ObjectId,  ref: User, required: true},

    registeredEvents: [
        { type: Schema.Types.ObjectId, ref: Event, required: true },
    ],

    organisedEvents: [
        { type: Schema.Types.ObjectId, ref: Event, required: true },
    ],

}, { timestamps: true });

const EventToUser = mongoose.model('event-to-user', eventToUserSchema);

module.exports = EventToUser;