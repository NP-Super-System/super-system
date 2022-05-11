const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const methodOverride = require('method-override');

// Load environment variables
require('dotenv').config();

// Import MongoDB Schemas
const mongoose = require('mongoose');
const PostReply = require('./models/PostReply');
const PostComment = require('./models/PostComment');
const ForumPost  = require('./models/ForumPost');

//Import AWS S3 upload function
const { uploadFile, getFileStream } = require('./s3');

//Import Middleware for image upload
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, ()=>{
    console.log(`Server listening to port ${port}`);
});
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(methodOverride('_method'));

// Web app Url (will change in the future)
const appUrl = 'http://localhost:3000';

// Set up MongoDB URI
const dbUsername = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbUri = `mongodb+srv://${dbUsername}:${dbPassword}@mycluster.bs4fk.mongodb.net/super-system?retryWrites=true&w=majority`;

// Connect to MongoDB database
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(res => console.log('Connected to database'))
    .catch(err => console.log(err));

// Init gfs
let conn = mongoose.connection;
let gfs;
conn.once('open', ()=>{
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
});

// Storage engine (for files in general - subject to change)
const storage = new GridFsStorage({
    url: dbUri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return reject(err);

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'upload',
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({storage});

const uploadLocal = multer({dest: 'uploads/'});

// ----------------------------------------------------
// ------------------- POST REQUESTS -------------------
// ----------------------------------------------------

// Add forum post
app.post('/add-forum-post', uploadLocal.single('file'), async (req, res)=>{
    let imgKey = '';
    try{
        const uploadFileRes = await uploadFile(req.file);
        console.log(uploadFileRes);
        imgKey = uploadFileRes.key || '';

        //Remove file from server
        fs.unlinkSync(`./uploads/${imgKey}`);
    }
    catch(err){console.log('Image does not exist or upload to s3 failed');}

    const {userName, userPicture, title, body} = req.body;

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
});

// Post comment
app.post('/add-comment', async (req, res)=>{
    const { postId, userName, userPicture, commentText } = req.body;
    console.log(req.body);

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
});

// Post reply to comment
app.post('/add-reply-to-comment', async (req, res) => {
    const {postId, commentId, userName, userPicture, replyText} = req.body;
    console.log(req.body);

    const postComment = await PostComment.findOne({_id: commentId});

    if(!postComment){
        res.redirect(`${appUrl}/forum`);
        return;
    }

    const replyData = {
        userName,
        userPicture,
        text: replyText,
        likedUsers: [],
        dislikedUsers: [],
    }
    const reply = new PostReply(replyData);
    await reply.save();

    postComment.replies.push(reply);
    await postComment.save();

    res.redirect(`${appUrl}/forum/post/${postId}`);
});

const removeLikedUser = (forumPost, userEmail) => {
    if(!forumPost.likedUsers.includes(userEmail)) return;

    let index = forumPost.likedUsers.indexOf(userEmail);
    forumPost.likedUsers.splice(index, 1);
}

const removeDislikedUser = (forumPost, userEmail) => {
    if(!forumPost.dislikedUsers.includes(userEmail)) return;

    let index = forumPost.dislikedUsers.indexOf(userEmail);
    forumPost.dislikedUsers.splice(index, 1);
}

// Like post
app.post('/like-post', async(req, res) => {
    const { postId, userEmail } = req.body;
    console.log(req.body);

    const forumPost = await ForumPost.findOne({_id: postId});

    if(!forumPost){
        res.redirect(`${appUrl}/forum`);
        console.log('Post does not exist');
        return;
    }

    if(forumPost.likedUsers.includes(userEmail)){
        console.log('User has already liked post');
        res.send();
        return;
    }

    forumPost.likedUsers.push(userEmail);
    console.log(`${userEmail} has liked the post!`);

    removeDislikedUser(forumPost, userEmail);

    const result = await forumPost.save();

    res.send(result);
});

// Unlike post
app.post('/unlike-post', async(req, res) => {
    const { postId, userEmail } = req.body;
    console.log(req.body);

    const forumPost = await ForumPost.findOne({_id: postId});

    if(!forumPost){
        res.redirect(`${appUrl}/forum`);
        console.log('Post does not exist');
        return;
    }

    if(!forumPost.likedUsers.includes(userEmail)){
        console.log('User has not liked post yet');
        res.send();
        return;
    }

    removeLikedUser(forumPost, userEmail);
    console.log(`${userEmail} has unliked the post`);

    const result = await forumPost.save();

    res.send(result);
});

// Dislike post
app.post('/dislike-post', async(req, res) => {
    const { postId, userEmail } = req.body;
    console.log(req.body);

    const forumPost = await ForumPost.findOne({_id: postId});

    if(!forumPost){
        res.redirect(`${appUrl}/forum`);
        console.log('Post does not exist');
        return;
    }

    if(forumPost.dislikedUsers.includes(userEmail)){
        console.log('User has already disliked post');
        res.send();
        return;
    }

    forumPost.dislikedUsers.push(userEmail);
    console.log(`${userEmail} has disliked the post`);

    removeLikedUser(forumPost, userEmail);

    const result = await forumPost.save();

    res.send(result);
});

// Undislike post
app.post('/undislike-post', async(req, res) => {
    const { postId, userEmail } = req.body;
    console.log(req.body);

    const forumPost = await ForumPost.findOne({_id: postId});

    if(!forumPost){
        res.redirect(`${appUrl}/forum`);
        console.log('Post does not exist');
        return;
    }

    if(!forumPost.dislikedUsers.includes(userEmail)){
        console.log('User has not disliked post yet');
        res.send();
        return;
    }

    removeDislikedUser(forumPost, userEmail);
    console.log(`${userEmail} has undisliked the post`);

    const result = await forumPost.save();

    res.send(result);
});

// ----------------------------------------------------
// ------------------- GET REQUESTS -------------------
// ----------------------------------------------------

// Get all forum posts
app.get('/get-all-forum-posts', (req, res)=>{
    // ForumPost.find({})
    //     .then(result => {
    //         res.send(result);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.redirect(`${appUrl}/home`);
    //     });
    ForumPost.find({})
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
});

// Get specific forum post
app.get('/get-forum-post/:postId', (req, res)=>{
    const { postId } = req.params;

    ForumPost.findOne({_id: postId})
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
});

// Get image from s3
app.get('/get-image/:key', (req, res) => {
    const { key } = req.params;
    const readStream = getFileStream(key);
    readStream.pipe(res);
});