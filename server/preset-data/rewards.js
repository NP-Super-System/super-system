const Rewards = require('../models/reward/Reward');

// TO BE ONLY RUN ONCE

// init course data

const rewardList = [
    {
        name: '$5 Starbucks Gift Card',
        description: '$5 gift card to spend at any starbucks outlet of your choice!',
        cost: 1000,
        quantity: 10,
    },
    {
        name: '$5 Koi Gift Card',
        description: '$5 gift card to spend at any koi outlet of your choice!',
        cost: 1000,
        quantity: 2,
    },
    {
        name: '1500 Robux',
        description: 'Receive 1500 robux for Roblox!',
        cost: 10,
        quantity: 1000,
    },

];

// add rewards

async function addRewards(){
    for (var rewardData of rewardList){
        console.log(rewardData);
        const reward = new Rewards(rewardData);
        try{
            const result = await reward.save();
            console.log(`Added Reward: ${result}`)
        }
        catch(err){
            console.log(err);
        }
        finally{
            continue;
        }
    }
}

addRewards();