const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for forum posts

const forumPostSchema = new Schema({

    userName: {
        type: String,
        required: true,
    },
    userPicture: String,

    title: {
        type: String,
        required: true,
    },
    body: String,
    imgKey: String,

    comments: [Object],

}, { timestamps: true });

// Create model for forum-post collection

const ForumPost = mongoose.model('forum-post', forumPostSchema);

module.exports = ForumPost;