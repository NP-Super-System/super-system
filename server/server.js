const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const methodOverride = require('method-override');

// Import MongoDB Schemas
const mongoose = require('mongoose');
const ForumPost = require('./models/ForumPost');

//Import Middleware for image upload
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

// Load environment variables
require('dotenv').config();

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
    gfs.collection('forum-post-images');
});

// Storage engine
const storage = new GridFsStorage({
    url: dbUri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return reject(err);

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const uploadImage = multer({storage});

// Add forum post
app.post('/add-forum-post', uploadImage.single('file'), (req, res)=>{
    console.log(req.body);

    const {title, body} = req.body;
    const post = {title, body};
    const forumPost = new ForumPost(post);

    forumPost.save()
        .then(result => res.redirect(`${appUrl}/forum`)) //redirect to forum page after submitting post
        .catch(err => console.log(err));
});

// Get all forum posts
app.get('/get-all-forum-posts', (req, res)=>{
    ForumPost.find()
        .then(result => res.send(result))
        .catch(err => console.log(err));
});