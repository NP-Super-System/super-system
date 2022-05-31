const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for tags

const tagSchema = new Schema({

    name: {type: String, required: true}

}, { timestamps: true });

// Create model for tag collection

const Tag = mongoose.model('tags', tagSchema);

module.exports = Tag;