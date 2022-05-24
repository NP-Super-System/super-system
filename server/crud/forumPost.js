const multer = require('multer');
const uploadLocal = multer({dest: '../uploads/'});
const { uploadFile, getFileStream } = require('../s3');
const ForumPost = require('../models/forum/ForumPost');
const PostComment = require('../models/forum/PostComment');
const User = require('../models/user/User');

const appUrl = 'http://localhost:3000';

// CRUD operations

const operations = app => {

    // Get user
    const getUser = async userId => {
        const user = await User.findOne({_id: userId});
        return user;
    }

    // Create - add forum post
    const uploadImage = async req => {
        let imgKey = '';
        try{
            const uploadFileRes = await uploadFile(req.file, 'image');
            console.log(uploadFileRes);
            imgKey = uploadFileRes.key || '';
    
            //Remove file from server
            fs.unlinkSync(`../uploads/${imgKey}`);
        }
        catch(err){
            console.log('Image does not exist or upload to s3 failed');
        }
        finally{
            imgKey = imgKey || '';
        }

        return imgKey;
    }

    const createForumPost = async (res, userId, title, body, imgKey) => {
        const user = await getUser(userId);
        const post = {
            user,
    
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
        const {userId, title, body} = req.body;
        await createForumPost(res, userId, title, body, imgKey);
    });

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