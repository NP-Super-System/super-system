const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reward = require('./Reward');
const User = require('../user/User');

// Schema for reward-to-user

const rewardToUserSchema = new Schema({

    user: {type: Schema.Types.ObjectId, ref: User, required: true},
    redeemedRewards: [
        {type: Schema.Types.ObjectId, ref: Reward},
    ],

}, { timestamps: true });

// Create model for reward-to-user collection
const RewardToUser = mongoose.model('reward-to-user', rewardToUserSchema);

// get / init
const getRewardToUser = async userId => {
    const rewardToUser = 
        await RewardToUser
            .findOne({ user: userId })
            .populate({path: 'user'})
            .populate({path: 'redeemedRewards'});
    if(rewardToUser) return rewardToUser;
    // console.log(rewardToUser);
    const user = await User.findOne({_id: userId});
    if(!rewardToUser){
        const newRewardToUser = new RewardToUser({
            user,
            redeemedRewards: [],
        });
        const result = await newRewardToUser.save();
        console.log(result);
        return result;
    }
}

module.exports = {
    RewardToUser,
    getRewardToUser,
};