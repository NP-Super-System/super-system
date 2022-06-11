const Roles = require('../models/role/Role');
const User = require('../models/user/User');

// CRUD operations

const operations = app => {
    // Read - get roles
    const readRoles = async (res) => {
        Roles
            .find({})
            .exec((err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                res.send(result);
            });
    }

    app.get('/roles/read', async (req, res) => {
        await readRoles(res);
    });

}

module.exports = operations;
