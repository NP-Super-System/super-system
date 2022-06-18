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

    app.post('/announcement/create', async (req, res) => {
        const { userId, title, body } = req.body;
        console.log(req.body);
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
                // console.log(result);
                res.send(result);
            });
    }

    app.get('/announcement/read', async (req, res) => {
        await readAnnouncements(res);
    });

    const readSingleAnnouncement = async (res, itemId) => {
        Announcement
        .findOne({_id: itemId})
        .exec( (err, result) => {
            if(err){
                console.log(err);
                res.redirect('http://localhost:3000/home');
                return;
            }
            res.send(result);
        } );
    }

    app.get('/announcement/read/:announcementNum', async (req, res) => {
        const itemId = req.params.announcementNum;
        await readSingleAnnouncement(res, itemId);
    })

    // Update - update announcement
    const updateAnnouncement = async (res, userId, title, body, itemId) => {
        const user = await User.findOne({_id: userId});
        Announcement
        .findOne({_id: itemId})
        .updateOne({userUpdate: user.userName, title: title, body: body})
            .then(result => {
                console.log('Updated announcement');
                res.send();
            })
            .catch(err => console.log(err));
        res.redirect('http://localhost:3000/home');
    }

    app.post('/announcement/update/:announcementNum', async (req, res) => {
        const { userId, title, body } = req.body;
        const itemId = req.params.announcementNum;
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

    app.post('/announcement/delete', async (req, res) => {
        const { userId, itemId } = req.body;
        await deleteAnnouncement(res, userId, itemId);
    })
}

module.exports = operations;