const fs = require('fs');
const multer = require('multer');
const uploadLocal = multer({dest: __dirname + '/../uploads/'});
const { uploadFile, getFileStream, deleteFile } = require('../s3');

const Challenge = require('../models/challenge/Challenge');
const Question = require('../models/challenge/Question');
const Option = require('../models/challenge/Option');
const Submission = require('../models/challenge/Submission');
const User = require('../models/user/User');

const Course = require('../models/course/Course');
const Section = require('../models/course/Section');
const { CourseToUser, getCourseToUser} = require('../models/course/CourseToUser');

const appUrl = 'http://localhost:3000';

// CRUD operations


const operations = app => {

    // Upload Images
    const uploadImages = async req => {
        let imgKeyList = [];
        console.log(req.files);
        for (var img of req.files){
            let imgKey = '';

            try{
                const uploadFileRes = await uploadFile(img, 'image');
                console.log(uploadFileRes);
                imgKey = uploadFileRes.key || '';
        
                //Remove file from server
                fs.unlinkSync(__dirname + `/../uploads/${imgKey}`);
            }
            catch(err){
                console.log('Image does not exist or upload to s3 failed');
            }
            finally{
                imgKey = imgKey || '';
            }
    
            imgKeyList.push(imgKey);
        }
        console.log(imgKeyList);
        return imgKeyList;
    }
    // Upload Single Image
    const uploadImage = async req => {
        let imgKey = '';

        let img = req.file;
        try{
            const uploadImgRes = await uploadFile(img, 'image');
            console.log(uploadImgRes);
            imgKey = uploadImgRes.key || '';
        }
        catch(err){
            console.log(err);
        }

        return imgKey;
    }

    // Create challenge
    const createChallenge = async (res, userId, updated=false, title, tags, pointCount, rating, numberOfRatings, content, imgKeyObj) => {
        let questions = [];

        for (var qindex in content){
            const { text, type, points, options } = content[qindex];

            let optionList = [];
            for (var i in options){
                const option = options[i];
                const { text, isCorrect } = option;
                const newOption = new Option({ text, isCorrect });
                optionList.push(newOption);
            }
            const newQuestion = new Question({
                text,
                type,
                points,
                imgKey: imgKeyObj[qindex.toString()] || '',
                options: optionList,
                submissions: [],
            });
            console.log('ImgKey: ', qindex, imgKeyObj[qindex.toString()]);
            questions.push(newQuestion);
        }

        const user = await User.findOne({_id: userId});
        const challengeData = {
            user,
            updated,
            title,
            tags,
            pointCount,
            rating,
            questions,
            numberOfRatings,
        }

        const newChallenge = new Challenge(challengeData);

        newChallenge.save()
            .then(result => {
                console.log('Created new challenge. Redirect');
                res.send({msg: 'Successfully published new challenge'});
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                res.send({err});
            });
        // res.send('debug');
    }

    app.post('/challenge/create', uploadLocal.any('imgList'), async (req, res) => {
        const { userId, updated, title, tags, points, rating, numberOfRatings, content, imgIndexList } = req.body;
        // console.log(req.body);
        const imgKeyList = await uploadImages(req);
        let imgKeyObj = {}
        for (var index in imgKeyList){
            imgKeyObj[imgIndexList[index]] = imgKeyList[index];
        }
        console.log(imgKeyObj);
        await createChallenge(res, userId, updated, title, tags, points, rating, numberOfRatings, JSON.parse(content), imgKeyObj);
    });

    // Read challenges

    app.get('/challenge/read', async (req, res) => {
        const { tags } = req.query;
        const tagList = tags?.split(',');

        try{
            const challenges = 
                await Challenge
                    .find({})
                    .populate('user');
            if(!tags){
                res.send(challenges);
                return;
            }

            const filteredChallenges = challenges.filter(chal => {
                const matchedTags = chal.tags.filter(chalTag => {
                    return tagList.some(tag => {
                        return chalTag.toLowerCase().startsWith(tag.toLowerCase());
                    });
                });
                return matchedTags.length >= tagList.length;
            });
            res.send(filteredChallenges);
        }
        catch(err){
            console.log(err);
            res.send({err});
        }
    })

    const readSingleChallenge = async (res, itemId) => {
        console.log("read single challenge")
        Challenge.findOne({_id: itemId})
            .populate({
                path: 'questions.submissions.user'
            })
            .exec((err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                res.send(result);
            });
    }

    app.get('/challenge/read/:challengeId', async (req, res) => {
        const { challengeId } = req.params;
        await readSingleChallenge(res, challengeId);
    })

    app.get('/challenge/read')

    // Update challenge
    const updateChallengeRating = async (res, rating, itemId) => {
        const challenge = await Challenge.findOne({_id: itemId});
        challenge.updateOne({rating: challenge.rating + rating, numberOfRatings: challenge.numberOfRatings + 1})
            .then(result => {
                console.log('Updated ratings');
                res.send();
            })
            .catch(err => console.log(err));
    }

    app.post('/challenge/rating/:challengeId', async (req, res) => {
        const { rating } = req.body;
        const itemId = req.params.challengeId;
        await updateChallengeRating(res, rating, itemId);
    });

    app.post('/challenge/completed/:userId', async (req, res) => {
        const { userId } = req.params;

        const { challengeId } = req.body;
        console.log(userId, challengeId);        

        const challenge = await Challenge.findOne({_id: challengeId});
        challenge.usersCompleted.push(userId);

        await challenge.save();

        // Set section as completed, check if challenge related to course
        const courseToUser = await getCourseToUser(userId);
        const userCourseCodes = courseToUser.courses.map(course => course.code);
        const courseCode = challenge.tags.find(tag => userCourseCodes.includes(tag)) || '';
        console.log('CourseCode:', courseCode);
        if(courseCode){
            const tagsWithoutCode = challenge.tags.filter(tag => tag != courseCode);
            const course = await Course.findOne({code: courseCode});
            const section = course.sections.find(section => section.tags.some(tag => tagsWithoutCode.includes(tag)));
            console.log('Section: ', courseCode, section.title, section._id);

            const { completedSections } = courseToUser.courses.find(c => c.code === courseCode);
            !completedSections.includes(section._id) && completedSections.push(section._id);

            await courseToUser.save();
        }
    });

    app.post('/challenge/post', uploadLocal.single('img'), async (req, res) => {
        const { challengeId, questionIndex, text, userId } = req.body;

        try{
            const imgKey = await uploadImage(req);
            const challenge = await Challenge.findOne({_id: challengeId});
            const submissions = challenge.questions[questionIndex].submissions;
            const user = await User.findOne({_id: userId});
            submissions.push(new Submission({
                imgKey,
                text,
                user,
                likedUsers: [],
                pastLikedUsers: [],
            }));

            const result = await challenge.save();
            console.log(result);
            res.send({msg: 'Posted submission'});
        }
        catch(err){
            console.log(err);
            res.send({err});
        }
    });

    // Delete challenge
    const deleteSubmissionImages = async (itemId) => {
        try{
            const challenge = await Challenge.findOne({_id: itemId});
            for (var question of challenge.questions){
                for (var submission of question.submissions){
                    const { imgKey } = submission;
                    imgKey && await deleteFile(imgKey, 'image');
                    console.log(`Deleted challenge question submission img: ${imgKey}`);
                }
            }
        }
        catch(err){
            console.log(err);
        }
    }
    const deleteImages = async (itemId) => {
        try{
            const challenge = await Challenge.findOne({_id: itemId});
            for(var question of challenge.questions){
                const { imgKey } = question;
                imgKey && await deleteFile(imgKey, 'image');
                console.log(`Deleted challenge img: ${imgKey}`);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    const deleteChallenge = async (res, userId, itemId) => {
        Challenge
        .deleteOne({_id: itemId})
        .then(result => {
            console.log('Successfully deleted challenge!');
            res.send();
        })
        .catch(err => console.log(err));
    }

    app.post('/challenge/delete', async (req, res) => {
        const { userId, itemId } = req.body;
        await deleteSubmissionImages(itemId);
        await deleteImages(itemId);
        await deleteChallenge(res, userId, itemId);
    })
}

module.exports = operations;