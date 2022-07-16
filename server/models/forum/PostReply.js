const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../user/User');

// Sub-schema for post replies

const postReplySchema = new Schema({

    user: {type: Schema.Types.ObjectId, ref: User, required: true},

    text: String,

    likedUsers: [String],
    dislikedUsers: [String],
    likedPastUsers: [String],
    
}, { timestamps: true, });

// Create model for forum post replies

const PostReply = mongoose.model('forum-post-replies', postReplySchema);

module.exports = PostReply;