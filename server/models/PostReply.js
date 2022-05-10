const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schema for post replies

const postReplySchema = new Schema({

    userName: {
        type: String,
        required: true,
    },
    userPicture: String,

    text: String,

    likedUsers: [String],
    dislikedUsers: [String],
    
}, { timestamps: true });

// Create model for forum post replies

const PostReply = mongoose.model('forum-post-replies', postReplySchema);

module.exports = PostReply;