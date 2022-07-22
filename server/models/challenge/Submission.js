const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../user/User');

// Schema for submissions (image)

const submissionSchema = new Schema({

    imgKey: String,
    text: String,

    user: {type: Schema.Types.ObjectId, ref: User, required: true},
    likedUsers: [
        {type: Schema.Types.ObjectId, ref: User},
    ],
    pastLikedUsers: [
        {type: Schema.Types.ObjectId, ref: User},
    ],

}, {timestamps: true});

const Submission = mongoose.model('submission', submissionSchema);

module.exports = Submission;