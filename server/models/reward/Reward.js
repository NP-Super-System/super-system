const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for rewards

const rewardSchema = new Schema({

    name: { type: String, required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, required: true },

}, { timestamps: true });

// Create model for rewards

const Reward = mongoose.model('reward', rewardSchema);

module.exports = Reward;