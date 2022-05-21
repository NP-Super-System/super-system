const Announcement = require('../models/announcement/Announcement');
const User = require('../models/user/User');

// CRUD operations

const operations = app => {

    // Create - add announcement
    const createAnnouncement = async (res, userId, title, body) => {
        const user = await User.findOne({_id: userId});
        const newAnnouncement = new Announcement({
            user,
            title,
            body,
        });
        
        newAnnouncement.save()
            .then(result => {
                console.log('Added announcement');
                res.redirect('http://localhost:3000/home');
            })
            .catch(err => console.log(err));
    }

    app.post('/create-announcement', async (req, res) => {
        const { userId, title, body } = req.body;
        await createAnnouncement(res, userId, title, body);
    });


    // Read - get announcements
    const readAnnouncements = async (res) => {
        Announcement
        .find({})
        .populate('user')
        .exec((err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            res.send(result);
        })
    }

    app.get('/get-announcements', async (req, res) => {
        await readAnnouncements(res);
    });

    // Update - update todoitem
    const updateAnnouncement = async (res, userId, title, body, itemId) => {;
        Announcement.updateOne({user: userId, title: title, body: body})
            .then(result => {
                console.log('Updated todo item');
                res.send();
            })
            .catch(err => console.log(err));
        res.redirect('http://localhost:3000/home');

    }

    app.post('/update-announcement', async (req, res) => {
        const { userId, title, body, itemId } = req.body;
        await updateAnnouncement(res, userId, title, body, itemId);
    });

    // Delete - delete announcement
    const deleteAnnouncement = async (res, userId, itemId) => {
        Announcement
        .deleteOne({_id: itemId})
        .then(result => {
            console.log('Successfully deleted announcement!');
            res.send();
        })
        .catch(err => console.log(err));
    }

    app.post('/delete-announcement', async (req, res) => {
        const { userId, itemId } = req.body;
        await deleteAnnouncement(res, userId, itemId);
    })
}

module.exports = operations;