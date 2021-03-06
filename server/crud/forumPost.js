const fs = require('fs');
const multer = require('multer');
const uploadLocal = multer({dest: __dirname + '/../uploads/'});
const { uploadFile, getFileStream, deleteFile } = require('../s3');
const ForumPost = require('../models/forum/ForumPost');
const PostComment = require('../models/forum/PostComment');
const User = require('../models/user/User');
const Course = require('../models/course/Course');
const PostReply = require('../models/forum/PostReply');

const { addPointsToUser } = require('./points'); 

const appUrl = 'http://localhost:3000';

// CRUD operations

const operations = app => {

    // Get user
    const getUser = async userId => {
        const user = await User.findOne({_id: userId});
        return user;
    }

    // Create - add forum post

    const uploadFiles = async req => {
        let fileKeyList = [];
        if(req.files['files[]']){
            const {'files[]': files} = req.files;

            for (var file of files){
                let fileKey = '';
                try{
                    const uploadFileRes = await uploadFile(file, 'file');
                    console.log(uploadFileRes);
                    fileKey = uploadFileRes.key || '';
                }
                catch(err){
                    console.log(err);
                }
                fileKeyList.push(fileKey);
            }
        }
        
        let imgKey = '';
        if(req.files.img){
            let img = req.files.img[0];

            try{
                const uploadImgRes = await uploadFile(img, 'image');
                console.log(uploadImgRes);
                imgKey = uploadImgRes.key || '';
            }
            catch(err){
                console.log(err);
            }
        }

        return { fileKeyList, imgKey };
    }


    const createForumPost = async (res, userId, title, body, files, imgKey, tags) => {
        const user = await getUser(userId);
        const post = {
            user,
    
            title, 
            body, 

            files,
            imgKey,
    
            likedUsers: [],
            dislikedUsers: [],
            likedPastUsers: [],

            tags,
            comments: [],
        };
        console.log(post);
        const forumPost = new ForumPost(post);
    
        forumPost.save()
            .then(result => {
                //redirect to forum page after submitting post
                console.log('Successfully posted!');
                res.send(result);
            })
            .catch(err => console.log(err));
        // res.send('debug');
    }

    app.post(
        '/forum/create', 
        uploadLocal.fields([
            { name: 'files[]', maxCount: 4, },
            { name: 'img', maxCount: 1, },
        ]), 
        async (req, res)=>{
            console.log(req.body);
            // const imgKey = await uploadImage(req);
            const { imgKey } = await uploadFiles(req);
            console.log({imgKey});
            const files =
                req.files['files[]'] ?
                req.files['files[]'].map( (file, i)=>{
                    return {
                        name: file.originalname,
                        key: file.filename,
                    }
                } )
                :
                [];
            const {userId, title, body, tags} = req.body;
            await createForumPost(res, userId, title, body, files, imgKey, tags.split(','));
        }
    );

    // Read - get forum posts

    const readForumPost = async (res, query={}) => {
        ForumPost.find(query)
            .populate('user')
            .populate('comments')
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
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user replies',
                    populate: {
                        path: 'user',
                        strictPopulate: false,
                    },
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
        const query = { _id: postId, }
        await readSingleForumPost(res, query);
    });

    // Update - update forum post

    // like / dislike functions

    const addLikedUser = (element, userId) => {
        if(element.likedUsers.includes(userId)) {
            console.log(`User already liked ${element.constructor.name}`);
            return;
        }
        element.likedUsers.push(userId);

        if(element.likedPastUsers.includes(userId)) return;
        element.likedPastUsers.push(userId);
        console.log(`Add point to poster ${element.user}`);
        addPointsToUser(element.user, 1);
    }

    const addDislikedUser = (element, userId) => {
        if(element.dislikedUsers.includes(userId)) {
            console.log(`User already disliked ${element.constructor.name}`);
            return
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
    app.post('/forum-post/update/like', async (req, res) => {
        const { postId, userId } = req.body;

        const forumPost = await getForumPost(res, postId);
        addLikedUser(forumPost, userId);
        removeDislikedUser(forumPost, userId);

        const result = await forumPost.save();
        res.send(result);
    });

    // Unlike post
    app.post('/forum-post/update/unlike', async (req, res) => {
        const { postId, userId } = req.body;

        const forumPost = await getForumPost(res, postId);
        removeLikedUser(forumPost, userId);

        const result = await forumPost.save();
        res.send(result);
    });

    // Dislike post
    app.post('/forum-post/update/dislike', async (req, res) => {
        const { postId, userId } = req.body;

        const forumPost = await getForumPost(res, postId);
        addDislikedUser(forumPost, userId);
        removeLikedUser(forumPost, userId);

        const result = await forumPost.save();
        res.send(result);
    });

    // Undislike post
    app.post('/forum-post/update/undislike', async (req, res) => {
        const { postId, userId } = req.body;

        const forumPost = await getForumPost(res, postId);
        removeDislikedUser(forumPost, userId);

        const result = await forumPost.save();
        res.send(result);
    });

    // Delete - delete forum post

    const deleteImageFromS3 = async (postId) => {
        try{
            const forumPost = await ForumPost.findOne({_id: postId});
            const { imgKey } = forumPost;
            imgKey && await deleteFile(imgKey, 'image');
            console.log(`Deleted post img: ${imgKey}`);
        }
        catch(err){
            console.log(err);
        }
    }

    const deleteReplies = async (postId) => {
        try{
            const forumPost = await ForumPost.findOne({_id: postId});
            try{
                for (var commentId of forumPost.comments){
                    try{
                        const comment = await PostComment.findOne({_id: commentId});
                        console.log(comment.replies);
                        const result = await PostReply.deleteMany({
                            _id: {
                                $in: comment.replies,
                            }
                        });
                        console.log(result);
                        console.log(`Deleted replies for post: ${postId}`);
                    }
                    catch(err){console.log(err);}
                }
            }
            catch(err){console.log(err);}
        }
        catch(err){console.log(err);}
    }

    const deleteComments = async (postId) => {
        try{
            const forumPost = await ForumPost.findOne({_id: postId});
            try{
                console.log(forumPost.comments);
                const result = await PostComment.deleteMany({
                    _id: {
                        $in: forumPost.comments,
                    }
                });
                console.log(result);
                console.log(`Deleted comments for post: ${postId}`);
            }
            catch(err){console.log(err);}
        }
        catch(err){console.log(err);}
    }

    const deletePost = async (postId) => {
        try{
            const result = await ForumPost.deleteOne({_id: postId});
            console.log(result);
            console.log(`Deleted post: ${postId}`);
        }
        catch(err){
            console.log(err);
        }
    }

    app.post('/forum-post/delete/', async (req, res) => {
        const { postId } = req.body;
        await deleteImageFromS3(postId);
        await deleteReplies(postId);
        await deleteComments(postId);
        await deletePost(postId);

        res.redirect(`${appUrl}/forum`);
    });
}

module.exports = operations;