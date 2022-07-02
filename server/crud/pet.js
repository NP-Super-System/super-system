const User = require('../models/user/User');

const operations = app => {
    app.post('/pet/update', async (req, res) => {
        const { userId, level, food, happiness, cleanliness } = req.body;
        console.log(userId, req.body);
        const user = await User.findOne({_id: userId});
        console.log(user);
        user.pet = { level, food, cleanliness, happiness,}
        console.log(user, user.pet);
  
        const result = await user.save();
        res.status(200).send(result);
    });
}

module.exports = operations;