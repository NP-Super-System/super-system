const multer = require('multer');
const uploadLocal = multer({dest: __dirname + '/../uploads/'});
const { uploadFile, getFileStream, deleteFile } = require('../s3');

const User = require('../models/user/User');
const Event = require("../models/event/Event");

// CRUD operations

const operations = app => {
    // Create
    const getUser = async id => {
        return await User.findOne({_id: id});
    }

    const uploadImage = async req => {
        let imgKey = '';
        try{
            const uploadFileRes = await uploadFile(req.file, 'image');
            console.log(uploadFileRes);
            imgKey = uploadFileRes.key || '';
    
            //Remove file from server
            fs.unlinkSync(__dirname + `/../uploads/${imgKey}`);
        }
        catch(err){
            console.log('Image does not exist or upload to s3 failed');
        }
        finally{
            imgKey = imgKey || '';
        }

        return imgKey;
    }

    app.post('/event/create', uploadLocal.single('file'), async (req, res) => {
        const {userId, title, description, startDatetime, endDatetime} = req.body;

        const user = await getUser(userId);

        const imgKey = req.file ? await uploadImage(req) : '';

        const eventDetails = {
            title,
            description,
            
            startDatetime,
            endDatetime,

            user,
            imgKey,
        }
        const newEvent = new Event(eventDetails);
        try{
            const result = await newEvent.save();
            res.send(result);
        }
        catch(err){
            res.staus(404).send(err);
        }
    });

    // Read
    const getEvents = async id => {
        return await Event.find(id ? {_id: id} : {});
    }

    app.get('/event/read', async (req, res) => {
        const { id } = req.query;
        if(id){
            try{
                const [myEvent] = await getEvents(id);
                res.status(200).send(myEvent);
            }
            catch(err){
                console.log(err);
                res.status(404).send(err);
            }
            return;
        }
        try{
            const events = await getEvents();
            res.status(200).send(events);
        }
        catch(err){
            console.log(err);
            res.status(404).send(err);
        }
    });
    // Update
    app.post('/event/update', async (req, res) => {
        const { id } = req.body;
        const [myEvent] = await getEvents(id);
    });

    // Delete
    app.get('/event/delete', async (req, res) => {
        const { id } = req.query;
        try{
            const result = await Event.deleteOne({_id: id});
            res.status(200).send(result);
        }
        catch(err){
            console.log(err);
            res.status(404).send(err);
        }
    });
}

module.exports = operations;