const Challenge = require('../models/challenge/Challenge');
const User = require('../models/user/User');

// CRUD operations

const operations = app => {

    // Create challenge
    const createChallenge = async (res, userId, title, questions, options) => {
        // const user = await User.findOne({_id: userId});
        // const newOption = new Option({
        //     text,
        //     isCorrect,
        // })
        // const newChallenge = new Challenge({
        //     user, 
        //     title,
        //     questions,
        // });

        // newChallenge.save()
        //     .then(result => {
        //         console.log('Created new challenge');
        //         res.redirect('http://localhost:3000/challenges');
        //     })
        //     .catch(err => console.log(err));
    }

    app.post('/challenge/create', async (req, res) => {
        const { userId, title, questions, options } = req.body;
        console.log(req.body);
        await createChallenge(res, userId, title, questions, options);
    });

    // Read challenges

    // Update challenge

    // Delete challenge

    return {};
}

module.exports = operations;