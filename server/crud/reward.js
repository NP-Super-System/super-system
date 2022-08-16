const User = require('../models/user/User');
const Reward = require('../models/reward/Reward');
const { RewardToUser, getRewardToUser } = require('../models/reward/RewardToUser');

const operations = app => {
    // Create
    app.post('/reward/create', async (req, res) => {
        const { name, description, cost, quantity } = req.body;
        try{
            const newReward = new Reward({name, description, cost, quantity});
            const result = await newReward.save();
            res.send({msg: 'Successfully created new reward!'});
        }
        catch(err){
            console.log(err);
            res.send({err});
        }
    });
    // Read
    app.get('/reward/read', async(req, res) => {
        const { id } = req.query;
        try{
            if(id){
                const reward = await Reward.findOne({ _id: id });
                res.send(reward);
                return;
            }

            const rewards = await Reward.find({});
            res.send(rewards);
        }
        catch(err){
            console.log(err);
            res.send(err);
        }
    });
    app.get('/reward/read/redeemed', async(req, res) => {
        const { userId } = req.query;
        try{
            const rewardToUser = await getRewardToUser(userId);
            res.send(rewardToUser);
        }
        catch(err){
            console.log(err);
            res.send({err});
        }
    });
    // Update
    app.post('/reward/update', async (req, res) => {
        const { _id, userId } = req.body;

        // Add redeemed reward to reward-to-user
        try{
            const user = await User.findOne({_id: userId});
            const reward = await Reward.findOne({_id});
            const rewardToUser = await getRewardToUser(userId);
            
            // check if redeemed
            if(rewardToUser.redeemedRewards.map(reward => reward._id.toString()).includes(_id)){
                console.log(`User ${userId} already redeemed reward ${_id}`);
                res.send({msg: 'You have already redeemed this reward'});
                return;
            };
            // check if enough coins
            if(rewardToUser.user.coinCount < reward.cost){
                console.log(`User coins: ${rewardToUser.user.coinCount} | Cost: ${reward.cost}`)
                res.send({msg: 'Not enough coins to redeem reward'});
                return;
            }
            console.log(rewardToUser.user.coinCount, reward.cost, rewardToUser.user.coinCount < reward.cost);
            
            user.coinCount -= reward.cost;
            rewardToUser.redeemedRewards.push(reward);

            const result = await rewardToUser.save();
            const resultUser = await user.save();

            console.log(`Added redeemed reward ${_id} for user ${userId}`);
        }
        catch(err){
            console.log(err);
        }

        // decrease reward quantity
        try{
            const reward = await Reward.findOne({_id});
            reward.quantity -= 1;
            const result = await reward.save();

            console.log(`Reward ID: ${_id} | Quantity: ${result.quantity}`);
            res.send(result);
        }
        catch(err){
            console.log(err);
        }
    });
    // Delete
    app.post('/reward/delete', async (req, res) => {

    });
}

module.exports = operations;