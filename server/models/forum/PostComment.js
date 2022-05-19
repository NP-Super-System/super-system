const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../user/User');
const PostReply = require('./PostReply');

// Sub-schema for post comments

const postCommentSchema = new Schema({

    user: {type: Schema.Types.ObjectId, ref: User, required: true},

    text: String,

    likedUsers: [String],
    dislikedUsers: [String],

    replies: [{type: Schema.Types.ObjectId, ref: PostReply}],

}, { timestamps: true,});

// Create model for forum-post comments

const PostComment = mongoose.model('forum-post-comments', postCommentSchema);

module.exports = PostComment;