const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../user/User');
const PostComment = require('./PostComment');

// Schema for forum posts

const forumPostSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: User, required: true},
    title: { type: String, required: true, },
    body: String,

    files: [{
        name: String,
        key: String,
    }],
    imgKey: String,

    likedUsers: [String],
    dislikedUsers: [String],
    likedPastUsers: [String],

    tags: [String],
    comments: [{type: Schema.Types.ObjectId, ref: PostComment}],

}, { timestamps: true });

// Create model for forum-post collection

const ForumPost = mongoose.model('forum-post', forumPostSchema);

module.exports = ForumPost;