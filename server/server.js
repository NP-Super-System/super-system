const express = require('express');
const cors = require('cors');

// Import MongoDB Schemas
const mongoose = require('mongoose');
const ForumPost = require('./models/ForumPost');

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, ()=>{
    console.log(`Server listening to port ${port}`);
});
app.use(express.urlencoded({extended: true}));
// app.use(express.json());
app.use(cors());

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

// Add forum post
app.post('/add-forum-post', (req, res)=>{
    const forumPost = new ForumPost(req.body);

    forumPost.save()
        .then(result => res.redirect(`${appUrl}/forum`)) //redirect to forum page after submitting post
        .catch(err => console.log(err));
});

// Get all forum posts
app.get('/get-all-forum-posts', (req, res)=>{
    ForumPost.find()
        .then(result => {
            console.log(result)
            res.send(result)
        })
        .catch(err => console.log(err));
    
});