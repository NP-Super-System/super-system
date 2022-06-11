const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../user/User');

// Schema for roles

const rolesSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: User, required: true, },
    roleName: { type: String, required: true, },

}, { timestamps: true });

const Roles = mongoose.model('roles', rolesSchema);

module.exports = Roles;