const fs = require('fs');
const multer = require('multer');
const uploadLocal = multer({dest: __dirname + '/../uploads/'});
const { uploadFile, getFileStream, deleteFile } = require('../s3');

const Challenge = require('../models/challenge/Challenge');
const Question = require('../models/challenge/Question');
const Option = require('../models/challenge/Option');
const User = require('../models/user/User');

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

    // Create challenge
    const createChallenge = async (res, userId, title, points, rating, numberOfRatings, content, imgKeyObj) => {
        const questionList = [];
        for (var i = 0; i < content.length; i++) {
            const optionsList = [];
            for (var j = 0; j < content[i].options.length; j++) {
                const newOption = new Option({
                    text: content[i].options[j].text,
                    isCorrect: content[i].options[j].isCorrect,
                });
                optionsList.push(newOption);
            }
            const newQuestion = new Question({
                text: content[i].text,
                isMultipleAns: content[i].isMultipleAns,
                isImageUpload: content[i].isImageUpload,
                points: content[i].points,
                options: optionsList,
                imgKey: imgKeyObj[i.toString()] || '',
            })
            questionList.push(newQuestion);
        }

        const user = await User.findOne({_id: userId});
        const challengeData = {
            user, 
            title,
            pointCount: points,
            rating,
            questions: questionList,
            numberOfRatings,
        }

        const newChallenge = new Challenge(challengeData);

        newChallenge.save()
            .then(result => {
                console.log('Created new challenge. Redirect');
                res.send(result);
            })
            .catch(err => console.log(`Error: ${err}`));
        res.send('debug');
    }

    app.post('/challenge/create', uploadLocal.any('imgList'), async (req, res) => {
        const { userId, title, points, rating, numberOfRatings, content, imgIndexList } = req.body;
        // console.log(req.body);
        const imgKeyList = await uploadImages(req);
        let imgKeyObj = {}
        for (var index in imgKeyList){
            imgKeyObj[imgIndexList[index]] = imgKeyList[index];
        }
        console.log(imgKeyObj);
        await createChallenge(res, userId, title, points, rating, numberOfRatings, JSON.parse(content), imgKeyObj);
    });

    // Read challenges
    const readChallenges = async (res) => {
        Challenge
            .find({})            
            .populate('user')
            .exec((err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                // console.log(result);
                res.send(result);
            });
    }

    app.get('/challenge/read', async (req, res) => {
        await readChallenges(res);
    })

    const readSingleChallenge = async (res, itemId) => {
        console.log("read single challenge")
        Challenge.findOne({_id: itemId})
            .then( (result) => {
                res.send(result);
            } )
            .catch(err => console.log(err))
    }

    app.get('/challenge/read/:challengeId', async (req, res) => {
        const { challengeId } = req.params;
        await readSingleChallenge(res, challengeId);
    })

    // Update challenge
    const updateChallengeRating = async (res, rating, ratings, itemId) => {
        Challenge
        .findOne({_id: itemId})
        .updateOne({rating: rating, numberOfRatings: ratings})
            .then(result => {
                console.log('Updated ratings');
                res.send();
            })
            .catch(err => console.log(err));
    }

    app.post('/challenge/rating/:challengeId', async (req, res) => {
        const { newRating, ratings } = req.body;
        const itemId = req.params.challengeId;
        await updateChallengeRating(res, newRating, ratings, itemId);
    });

    // Delete challenge
    const deleteImagesFromS3 = async (itemId) => {
        try{
            const forumPost = await Challenge.findOne({_id: itemId});
            for(var question of forumPost.questions){
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
        await deleteImagesFromS3(itemId);
        await deleteChallenge(res, userId, itemId);
    })
}

module.exports = operations;