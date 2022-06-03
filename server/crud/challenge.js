const Challenge = require('../models/challenge/Challenge');
const Question = require('../models/challenge/Question');
const Option = require('../models/challenge/Option');
const User = require('../models/user/User');

const appUrl = 'http://localhost:3000';

// CRUD operations


const operations = app => {

    // Create challenge
    const createChallenge = async (res, userId, title, points, content) => {
        const questionList = [];
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
            questionList.push(newQuestion);
        }

        const user = await User.findOne({_id: userId});
        const challengeData = {
            user, 
            title,
            pointCount: points,
            rating: 3,
            questions: questionList,
        }

        const newChallenge = new Challenge(challengeData);

        newChallenge.save()
            .then(result => {
                console.log('Created new challenge. Redirect');
                // res.redirect(200, `${appUrl}/challenge`);
                res.send(result);
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
                res.send(result);
            } )
            .catch(err => console.log(err))
    }

    app.get('/challenge/read/:challengeId', async (req, res) => {
        const { challengeId } = req.params;
        await readSingleChallenge(res, challengeId);
    })

    // Update challenge

    // Delete challenge

}

module.exports = operations;