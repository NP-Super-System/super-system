const User = require('../models/user/User');

const operations = app => {
    // Create - add user
    app.post('/add-user', (req, res) => {
        const user = new User(req.body);
        user.save()
            .then(result => {
                console.log(`Created new user: ${req.body.userName}`);
                res.send({_id: result._id});
            })
            .catch(err => console.log(err));
    });

    // Read - read user
    // Get user
    const getUser = async userEmail => {
        const user = await User.findOne({userEmail});
        return user;
    }
    const getUserById = async userId => {
        const user = await User.findOne({_id: userId});
        return user;
    }

    app.get('/get-user/:userEmail', async (req, res) => {
        const { userEmail } = req.params;
        try{
            const user = await getUser(userEmail);
            user ? res.send(user) : res.send({_id: null});
        }
        catch(err){console.log(err);}
    });
    app.get('/get-user-id/:userEmail', async (req, res) => {
        try{
            const { userEmail } = req.params;
            const user = await getUser(userEmail);
            user ? res.send({_id: user._id}) : res.send({_id: null});
        }
        catch(err){console.log(err);}
    });
    app.get('/user/read/', async (req, res) => {
        const { userEmail, userId } = req.query;
        try{
            const user = 
                userEmail 
                ? await getUser(userEmail) :
                userId
                ? await getUserById(userId) : null;
            user ? res.send(user) : res.send({});
        }
        catch(err){console.log(err);}
    })

    // Update - update user

    // Delete - delete user
}

module.exports = operations;