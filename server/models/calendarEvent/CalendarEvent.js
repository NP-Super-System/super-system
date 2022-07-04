const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendarEventSchema = new Schema({
    
    text: {type: String, required: true},
    colour: String,
    date: {type: String, required: true},

}, {timestamps: true});

const CalendarEvent = mongoose.model('calendar-event', calendarEventSchema);
module.exports = CalendarEvent;