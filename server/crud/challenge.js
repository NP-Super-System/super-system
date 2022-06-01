const { checkPrime } = require('crypto');
const Challenge = require('../models/challenge/Challenge');
const Question = require('../models/challenge/Question');
const Option = require('../models/challenge/Option');
const User = require('../models/user/User');

// CRUD operations

const operations = app => {

    // Create challenge
    const createChallenge = async (res, userId, title, points, content) => {
        const questionsList = [];
        for (var i = 0; i < content.length; i++) {
            const optionsList = [];
            for (var j = 0; j < content[i].options.length; j++) {
                const newOption = new Option({
                    text: content[i].options[j].option,
                    isCorrect: content[i].options[j].isCorrect,
                });
                optionsList.push(newOption);
            }
            const newQuestion = new Question({
                text: content[i].question,
                isMultipleAns: content[i].isMultipleAns,
                options: optionsList,
            })
            questionsList.push(newQuestion);
        }
        const newChallenge = new Challenge({
            user: userId, 
            title,
            pointCount: points,
            rating: 3,
            questions: questionsList,
        });

        newChallenge.save()
            .then(result => {
                console.log('Created new challenge');
                res.redirect('http://localhost:3000/challenges');
            })
            .catch(err => console.log(err));
    }

    app.post('/challenge/create', async (req, res) => {
        const { userId, title, points, content } = req.body;
        await createChallenge(res, userId, title, points, content);
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
                // if(err){
                //     console.log(err);
                //     res.redirect('http://localhost:3000/challenges');
                //     return;
                // }
                res.send(result);
            } )
            .catch(err => console.log(err))
    }

    app.get('/challenge/read/:challengeId', async (req, res) => {
        const itemId = req.params.challengeId;
        await readSingleChallenge(res, itemId);
    })

    // Update challenge

    // Delete challenge

}

module.exports = operations;