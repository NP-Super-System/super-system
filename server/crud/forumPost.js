const multer = require('multer');
const uploadLocal = multer({dest: '../uploads/'});
const { uploadFile, getFileStream } = require('../s3');
const ForumPost = require('../models/forum/ForumPost');
const PostComment = require('../models/forum/PostComment');

const appUrl = 'http://localhost:3000';

// CRUD operations

const operations = app => {

    // Create - add forum post
    const uploadImage = async req => {
        let imgKey = '';
        try{
            const uploadFileRes = await uploadFile(req.file);
            console.log(uploadFileRes);
            imgKey = uploadFileRes.key || '';
    
            //Remove file from server
            fs.unlinkSync(`./uploads/${imgKey}`);
        }
        catch(err){
            console.log('Image does not exist or upload to s3 failed');
        }
        finally{
            imgKey = imgKey || '';
        }

        return imgKey;
    }

    const createForumPost = async (res, userName, userPicture, title, body, imgKey) => {
        const post = {
            userName, 
            userPicture,
    
            title, 
            body, 
            imgKey,
    
            likedUsers: [],
            dislikedUsers: [],
    
            comments: [],
        };
        console.log(post);
        const forumPost = new ForumPost(post);
    
        forumPost.save()
            .then(result => {
                //redirect to forum page after submitting post
                console.log('Successfully posted!');
                res.redirect(`${appUrl}/forum`);
            })
            .catch(err => console.log(err));
    }

    app.post('/add-forum-post', uploadLocal.single('file'), async (req, res)=>{
        const imgKey = await uploadImage(req);

        const {userName, userPicture, title, body} = req.body;
    
        await createForumPost(res, userName, userPicture, title, body, imgKey);
    });

    // Read - get forum posts

    const readForumPost = async (res, query={}) => {
        ForumPost.find(query)
            .populate({
                path: 'comments',
            })
            .exec( (err, result) => {
                if(err){
                    console.log(err);
                    res.redirect(`${appUrl}/forum`);
                    return;
                }
                res.send(result);
            } );
    }

    app.get('/get-all-forum-posts', async (req, res) => {
        await readForumPost(res);
    });

    const readSingleForumPost = async (res, query={}) => {
        ForumPost.findOne(query)
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies',
                }
            })
            .exec( (err, result) => {
                if(err){
                    console.log(err);
                    res.redirect(`${appUrl}/forum`);
                    return;
                }
                res.send(result);
            } )
    }

    app.get('/get-forum-post/:postId', async (req, res) => {
        const { postId } = req.params;
        const query = {
            _id: postId,
        }
        await readSingleForumPost(res, query);
    });

    // Update - update forum post
    const addComment = async (res, postId, userName, userPicture, commentText) => {
        const forumPost = await ForumPost.findOne({_id: postId});

        if(!forumPost){
            res.redirect(`${appUrl}/forum`);
            return;
        }

        const commentData = {
            userName,
            userPicture,
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
        const { postId, userName, userPicture, commentText } = req.body;
        await addComment(res, postId, userName, userPicture, commentText);
    });

    // like / dislike functions

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

    const getForumPost = async (res, postId) => {
        const forumPost = await ForumPost.findOne({_id: postId});

        if(!forumPost){
            res.redirect(`${appUrl}/forum`);
            console.log('Post does not exist');
            return null;
        }

        return forumPost;
    }

    // Like post
    app.post('/like-post', async (req, res) => {
        const { postId, userEmail } = req.body;

        const forumPost = await getForumPost(res, postId);
        addLikedUser(forumPost, userEmail);
        removeDislikedUser(forumPost, userEmail);

        const result = await forumPost.save();
        res.send(result);
    });

    // Unlike post
    app.post('/unlike-post', async (req, res) => {
        const { postId, userEmail } = req.body;

        const forumPost = await getForumPost(res, postId);
        removeLikedUser(forumPost, userEmail);

        const result = await forumPost.save();
        res.send(result);
    });

    // Dislike post
    app.post('/dislike-post', async (req, res) => {
        const { postId, userEmail } = req.body;

        const forumPost = await getForumPost(res, postId);
        addDislikedUser(forumPost, userEmail);
        removeLikedUser(forumPost, userEmail);

        const result = await forumPost.save();
        res.send(result);
    });

    // Undislike post
    app.post('/undislike-post', async (req, res) => {
        const { postId, userEmail } = req.body;

        const forumPost = await getForumPost(res, postId);
        removeDislikedUser(forumPost, userEmail);

        const result = await forumPost.save();
        res.send(result);
    });

    // Delete - delete forum post

}

module.exports = operations;