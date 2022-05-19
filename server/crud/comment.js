const PostComment = require('../models/forum/PostComment');
const PostReply = require('../models/forum/PostReply');

const appUrl = 'http://localhost:3000';

const operations = app => {
    // Create - add comment / reply

    // Read - read comment / reply

    // Update - update comment / reply

    const addLikedUser = (element, userEmail) => {
        if(element.likedUsers.includes(userEmail)) {
            console.log(`User already liked ${element.constructor.name}`);
            return;
        }
        element.likedUsers.push(userEmail);
    }

    const addDislikedUser = (element, userEmail) => {
        if(element.dislikedUsers.includes(userEmail)) {
            console.log(`User already disliked ${element.constructor.name}`);
            return
        }
        element.dislikedUsers.push(userEmail);
    }

    const removeLikedUser = (element, userEmail) => {
        if(!element.likedUsers.includes(userEmail)) {
            console.log(`User has not liked ${element.constructor.name}`);
            return;
        }

        let index = element.likedUsers.indexOf(userEmail);
        element.likedUsers.splice(index, 1);
    }

    const removeDislikedUser = (element, userEmail) => {
        if(!element.dislikedUsers.includes(userEmail)) {
            console.log(`User has not disliked ${element.constructor.name}`);
            return;
        }

        let index = element.dislikedUsers.indexOf(userEmail);
        element.dislikedUsers.splice(index, 1);
    }
    
    // Like
    app.post('/like-comment', async (req, res) => {
        const { type, commentId, userEmail } = req.body;
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
    
        addLikedUser(res, comment, userEmail);
        removeDislikedUser(res, comment, userEmail);
    
        const result = await comment.save();
        res.send(result);
    });
    
    // Unlike
    app.post('/unlike-comment', async (req, res) => {
        const { type, commentId, userEmail } = req.body;
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
    
        removeLikedUser(res, comment, userEmail);
    
        const result = await comment.save();
        res.send(result);
    });
    
    // Dislike
    app.post('/dislike-comment', async (req, res) => {
        const { type, commentId, userEmail } = req.body;
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
    
        addDislikedUser(res, comment, userEmail);
        removeLikedUser(res, comment, userEmail);
    
        const result = await comment.save();
        res.send(result);
    });
    
    // Undislike
    app.post('/undislike-comment', async (req, res) => {
        const { type, commentId, userEmail } = req.body;
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
    
        removeDislikedUser(res, comment, userEmail);
    
        const result = await comment.save();
        res.send(result);
    });

    // Delete - delete comment / reply
}

module.exports = operations;