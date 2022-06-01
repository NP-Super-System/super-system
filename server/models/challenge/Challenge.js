const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = require('./Question').schema;
const UserSchema = require('../user/User').schema;
const User = require('../user/User');

// Schema for challenges

const challengeSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: User, required: true,  },
    title: { type: String, required: true, },

    pointCount: { type: Number, required: true, },
    rating: { type: Number, required: true, },

    questions: [QuestionSchema],

}, { timestamps: true });

// Create model for challenge collection

const Challenge = mongoose.model('challenge', challengeSchema);

module.exports = Challenge;