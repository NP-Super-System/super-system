const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for forum posts

const forumPostSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    body: String,
    imgKey: String,

}, { timestamps: true });

// Create model for forum-post collection

const ForumPost = mongoose.model('forum-post', forumPostSchema);

module.exports = ForumPost;