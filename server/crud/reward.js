const Reward = require('../models/reward/Reward');

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
    // Update
    app.post('/reward/update', async (req, res) => {
        const { _id } = req.body;
        console.log(_id);
        const reward = await Reward.findOne({_id});
        for (let property in req.body){
            if(!property) continue;
            reward[property] = req.body[property];
        }
        console.log(reward.quantity);
        const result = await reward.save();
        res.send(result);
    });
    // Delete
    app.post('/reward/delete', async (req, res) => {

    });
}

module.exports = operations;