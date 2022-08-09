const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = require('./Question').schema;
const UserSchema = require('../user/User').schema;
const User = require('../user/User');

// Schema for challenges

const challengeSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: User, required: true, },
    title: { type: String, required: true, },
    updated: Boolean,

    pointCount: { type: Number, required: true, },
    rating: { type: Number, required: true, },
    numberOfRatings: { type: Number, required: true, },

    questions: [QuestionSchema],
    usersCompleted: [Schema.Types.ObjectId],

    tags: [String],

}, { timestamps: true });

// Create model for challenge collection

const Challenge = mongoose.model('challenge', challengeSchema);

module.exports = Challenge;