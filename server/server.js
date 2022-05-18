const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const methodOverride = require('method-override');

// Load environment variables
require('dotenv').config();

// Import MongoDB Schemas
const mongoose = require('mongoose');

// User
const User = require('./models/user/User');

// TodoList
const TodoItem = require('./models/todolist/TodoItem');

// Forum
const PostReply = require('./models/forum/PostReply');
const PostComment = require('./models/forum/PostComment');
const ForumPost  = require('./models/forum/ForumPost');

//Import AWS S3 upload function
const { uploadFile, getFileStream } = require('./s3');

//Import Middleware for image upload
const multer = require('multer');

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

const uploadLocal = multer({dest: 'uploads/'});

// Get user
app.get('/get-user/:userEmail', (req, res) => {
    const { userEmail } = req.params;

    User.findOne({userEmail: userEmail})
        .then(user => {
            if(!user){
                res.send({_id: null});
                return;
            }
            res.send(user);
        })
        .catch(err => console.log(err));
});

// Get user
app.get('/get-user-id/:userEmail', (req, res) => {
    const { userEmail } = req.params;

    User.findOne({userEmail: userEmail})
        .then(user => {
            if(!user){
                res.send({_id: null});
                return;
            }
            res.send({_id: user._id});
        })
        .catch(err => console.log(err));
});

// Add user
app.post('/add-user', (req, res) => {
    
    const user = new User(req.body);

    user.save()
        .then(result => {
            console.log(`Created new user: ${req.body.userName}`);
            res.send({_id: result._id});
        })
        .catch(err => console.log(err));
    
});

// TodoItem CRUD
const { createTodoItem, readTodoItem, updateTodoItem, deleteTodoItem } = require('./crud/todoitem')(app);

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
        return;s
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

// like / dislike functions

const addLikedUser = (res, element, userEmail) => {
    if(element.likedUsers.includes(userEmail)) {
        console.log(`User already liked ${element.constructor.name}`);
        return;
    }
    element.likedUsers.push(userEmail);
}

const addDislikedUser = (res, element, userEmail) => {
    if(element.dislikedUsers.includes(userEmail)) {
        console.log(`User already disliked ${element.constructor.name}`);
        return
    }
    element.dislikedUsers.push(userEmail);
}

const removeLikedUser = (res, element, userEmail) => {
    if(!element.likedUsers.includes(userEmail)) {
        console.log(`User has not liked ${element.constructor.name}`);
        return;
    }

    let index = element.likedUsers.indexOf(userEmail);
    element.likedUsers.splice(index, 1);
}

const removeDislikedUser = (res, element, userEmail) => {
    if(!element.dislikedUsers.includes(userEmail)) {
        console.log(`User has not disliked ${element.constructor.name}`);
        return;
    }

    let index = element.dislikedUsers.indexOf(userEmail);
    element.dislikedUsers.splice(index, 1);
}

//-----------
//---POSTS---
//-----------

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

    addLikedUser(res, forumPost, userEmail);
    removeDislikedUser(res, forumPost, userEmail);

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

    removeLikedUser(res, forumPost, userEmail);

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

    addDislikedUser(res, forumPost, userEmail);
    removeLikedUser(res, forumPost, userEmail);

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

    removeDislikedUser(res, forumPost, userEmail);

    const result = await forumPost.save();
    res.send(result);
});

//------------------------
//---COMMENTS / REPLIES---
//------------------------

// Like comment / reply
app.post('/like-comment', async(req, res) => {
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

// Unlike comment / reply
app.post('/unlike-comment', async(req, res) => {
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

// Dislike comment / reply
app.post('/dislike-comment', async(req, res) => {
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

// Undislike comment / reply
app.post('/undislike-comment', async(req, res) => {
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

// ----------------------------------------------------
// ------------------- GET REQUESTS -------------------
// ----------------------------------------------------

// Get all forum posts
app.get('/get-all-forum-posts', (req, res)=>{
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
    try{
        const readStream = getFileStream(key);
        readStream.pipe(res);
    }
    catch(err){console.log(err)}
});