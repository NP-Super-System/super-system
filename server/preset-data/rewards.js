const Rewards = require('../models/reward/Reward');

// TO BE ONLY RUN ONCE

// init reward data

const rewardList = [
    {
        name: '$10 Starbucks Gift Card',
        description: '$10 gift card to spend at any Starbucks outlet of your choice!',
        cost: 200,
        quantity: 100,
    },
    {
        name: '$10 KOI Gift Card',
        description: '$10 gift card to spend at any KOI outlet of your choice!',
        cost: 200,
        quantity: 100,
    },
    {
        name: '$10 LiHO Gift Card',
        description: '$10 gift card to spend at any LiHO outlet of your choice!',
        cost: 200,
        quantity: 100,
    },
    {
        name: '$10 iTea Gift Card',
        description: '$10 gift card to spend at any iTea outlet of your choice!',
        cost: 200,
        quantity: 100,
    },
    {
        name: '$10 Subway Gift Card',
        description: '$10 gift card to spend at any Subway outlet of your choice!',
        cost: 200,
        quantity: 100,
    },
    {
        name: '$10 Gong Cha Gift Card',
        description: '$10 gift card to spend at any Gong Cha outlet of your choice!',
        cost: 200,
        quantity: 100,
    },
    {
        name: '$10 HeyTea Gift Card',
        description: '$10 gift card to spend at any HeyTea outlet of your choice!',
        cost: 200,
        quantity: 100,
    },
    {
        name: '$30 Ikea Gift Card',
        description: '$30 gift card to spend at any Ikea outlet of your choice!',
        cost: 300,
        quantity: 50,
    },
    {
        name: '$30 Grab Gift Card',
        description: '$30 gift card to use on Grab rides, food, mart, express and more!',
        cost: 300,
        quantity: 50,
    },
    {
        name: '$30 Challenger Gift Card',
        description: '$30 gift card to use on any Challenger outlet of your choice!',
        cost: 300,
        quantity: 50,
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