const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for rewards

const rewardSchema = new Schema({

    name: String,
    description: String,
    cost: Number,
    quantity: Number,

}, { timestamps: true });

// Create model for rewards

const Reward = mongoose.model('reward', rewardSchema);

module.exports = Reward;