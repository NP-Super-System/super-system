const Challenge = require('../models/challenge/Challenge');

// CRUD operations

const operations = app => {
    // Create challenge

    const createChallenge = (res, userId, title, questions) => {
        
    }

    app.post('/add-challenge', async (req, res) => {
        const { userId, title, questions } = req.body;
        await createChallenge(res, userId, title, questions);
    });
    // Read challenges

    // Update challenge

    // Delete challenge

    return {};
}

module.exports = operations;