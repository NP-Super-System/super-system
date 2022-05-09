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
const ForumPost = require('./models/ForumPost');

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
    const {postId, userName, userPicture, commentText} = req.body;
    console.log(req.body);

    const forumPost = await ForumPost.findOne({_id: postId});
    if(forumPost){

        const comment = {
            userName,
            userPicture,
            text: commentText,
            likeCount: 0,
            dislikeCount: 0,
        }

        forumPost.comments.push(comment);
        await forumPost.save();
    }

    res.redirect(`${appUrl}/forum/post/${postId}`);
});

// Get all forum posts
app.get('/get-all-forum-posts', (req, res)=>{
    ForumPost.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.redirect(`${appUrl}/home`);
        });
});

// Get specific forum post
app.get('/get-forum-post/:postId', (req, res)=>{
    const { postId } = req.params;
    ForumPost.findOne({_id: postId})
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.redirect(`${appUrl}/forum`);
        });
});

// Get image from s3
app.get('/get-image/:key', (req, res) => {
    const { key } = req.params;
    const readStream = getFileStream(key);
    readStream.pipe(res);
});