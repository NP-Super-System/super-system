const User = require('../models/user/User');

const addPointsToUser = async (userId, pointCount) => {
    const user = await User.findOne({ _id: userId });
    user.coinCount += pointCount;

    const result = await user.save();
    return result;
}

module.exports = { addPointsToUser };