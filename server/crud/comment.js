const ForumPost = require('../models/forum/ForumPost');
const PostComment = require('../models/forum/PostComment');
const PostReply = require('../models/forum/PostReply');
const User = require('../models/user/User');

const appUrl = 'http://localhost:3000';

const operations = app => {
    // Get user
    const getUser = async userId => {
        const user = await User.findOne({_id: userId});
        return user;
    }

    // Create - add comment / reply

    // Read - read comment / reply

    // Update - update comment / reply

    const addComment = async (res, postId, userId, commentText) => {
        const forumPost = await ForumPost.findOne({_id: postId});

        if(!forumPost){
            res.redirect(`${appUrl}/forum`);
            return;
        }

        const user = await getUser(userId);
        const commentData = {
            user,
            text: commentText,
            likedUsers: [],
            dislikedUsers: [],
            replies: [],
        }
        const comment = new PostComment(commentData);
        await comment.save();

        forumPost.comments.push(comment);
        await forumPost.save();

        res.redirect(`${appUrl}/forum/post/${postId}`);
    }

    app.post('/add-comment', async (req, res) => {
        const { postId, userId, commentText } = req.body;
        await addComment(res, postId, userId, commentText);
    });

    const addReply = async (res, postId, commentId, userId, replyText) => {
        const postComment = await PostComment.findOne({_id: commentId});

        if(!postComment){
            res.redirect(`${appUrl}/forum`);
            return;
        }

        const user = await getUser(userId);
        const replyData = {
            user,
            text: replyText,
            likedUsers: [],
            dislikedUsers: [],
        }
        const reply = new PostReply(replyData);
        await reply.save();

        postComment.replies.push(reply);
        await postComment.save();

        res.redirect(`${appUrl}/forum/post/${postId}`);
    }

    app.post('/add-reply', async (req, res) => {
        const { postId, commentId, userId, replyText } = req.body;
        await addReply(res, postId, commentId, userId, replyText);
    });

    const addLikedUser = (element, userId) => {
        if(element.likedUsers.includes(userId)) {
            console.log(`User already liked ${element.constructor.name}`);
            return;
        }
        element.likedUsers.push(userId);
    }

    const addDislikedUser = (element, userId) => {
        if(element.dislikedUsers.includes(userId)) {
            console.log(`User already disliked ${element.constructor.name}`);
            return;
        }
        element.dislikedUsers.push(userId);
    }

    const removeLikedUser = (element, userId) => {
        if(!element.likedUsers.includes(userId)) {
            console.log(`User has not liked ${element.constructor.name}`);
            return;
        }

        let index = element.likedUsers.indexOf(userId);
        element.likedUsers.splice(index, 1);
    }

    const removeDislikedUser = (element, userId) => {
        if(!element.dislikedUsers.includes(userId)) {
            console.log(`User has not disliked ${element.constructor.name}`);
            return;
        }

        let index = element.dislikedUsers.indexOf(userId);
        element.dislikedUsers.splice(index, 1);
    }
    
    // Like
    app.post('/forum-post/update/comment/like', async (req, res) => {
        const { type, commentId, userId } = req.body;
        console.log(req.body);
    
        let comment = 
            type == 'comment' 
            ? await PostComment.findOne({_id: commentId})
            : await PostReply.findOne({_id: commentId});
        
        if(!comment){
            res.redirect(`${appUrl}/forum`);
            console.log('Comment does not exist');
            return;
        }
    
        addLikedUser(comment, userId);
        removeDislikedUser(comment, userId);
    
        const result = await comment.save();
        res.send(result);
    });
    
    // Unlike
    app.post('/forum-post/update/comment/unlike', async (req, res) => {
        const { type, commentId, userId } = req.body;
        console.log(req.body);
    
        let comment = 
            type == 'comment' 
            ? await PostComment.findOne({_id: commentId})
            : await PostReply.findOne({_id: commentId});
        
        if(!comment){
            res.redirect(`${appUrl}/forum`);
            console.log('Comment does not exist');
            return;
        }
    
        removeLikedUser(comment, userId);
    
        const result = await comment.save();
        res.send(result);
    });
    
    // Dislike
    app.post('/forum-post/update/comment/dislike', async (req, res) => {
        const { type, commentId, userId } = req.body;
        console.log(req.body);
    
        let comment = 
            type == 'comment' 
            ? await PostComment.findOne({_id: commentId})
            : await PostReply.findOne({_id: commentId});
        
        if(!comment){
            res.redirect(`${appUrl}/forum`);
            console.log('Comment does not exist');
            return;
        }
    
        addDislikedUser(comment, userId);
        removeLikedUser(comment, userId);
    
        const result = await comment.save();
        res.send(result);
    });
    
    // Undislike
    app.post('/forum-post/update/comment/undislike', async (req, res) => {
        const { type, commentId, userId } = req.body;
        console.log(req.body);
    
        const comment = 
            type == 'comment' 
            ? await PostComment.findOne({_id: commentId})
            : await PostReply.findOne({_id: commentId});
        
        if(!comment){
            res.redirect(`${appUrl}/forum`);
            console.log('Comment does not exist');
            return;
        }
    
        removeDislikedUser(comment, userId);
    
        const result = await comment.save();
        res.send(result);
    });

    // Delete - delete comment / reply
}

module.exports = operations;