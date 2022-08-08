const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, ()=>{
    console.log(`Server listening to port ${port}`);
});

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true,}));
app.use(cors());

// Connect to MongoDB super-system database
require('./mongodb');

// -------------------
// -- API endpoints --
// -------------------

// User
require('./crud/user')(app);
// TodoItem
require('./crud/todoitem')(app);
// Announcement
require('./crud/announcement')(app);
// Forum Post
require('./crud/forumPost')(app);
// Forum Post Comment / Reply
require('./crud/comment')(app);
// s3Image - get image from s3
require('./crud/s3Bucket')(app);
// Course
require('./crud/course')(app);
// Challenge
require('./crud/challenge')(app);
// Events
require('./crud/event')(app);
// Roles
require('./crud/role')(app);
// Calendar
require('./crud/calendar')(app);
// Reward
require('./crud/reward')(app);

// -------------------
// -- PRESET DATA --
// -------------------

// require('./preset-data/courses');
// require('./preset-data/challenges');
// require('./preset-data/roles');
// require('./preset-data/rewards');
