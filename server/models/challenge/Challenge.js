const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = require('./Question').schema;
const UserSchema = require('../user/User').schema;

// Schema for challenges

const challengeSchema = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: UserSchema },

    title: { type: String, required: true, },

    pointCount: { type: Number, required: true, },
    rating: { type: Number, required: true, },

    questions: [QuestionSchema],

}, { timestamps: true });

// Create model for challenge collection

const Challenge = mongoose.model('challenge', questionSchema);

module.exports = Challenge;