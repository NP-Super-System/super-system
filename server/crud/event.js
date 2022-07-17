const multer = require('multer');
const uploadLocal = multer({dest: __dirname + '/../uploads/'});
const { uploadFile, getFileStream, deleteFile, deleteLocalFile } = require('../s3');

const User = require('../models/user/User');
const Event = require("../models/event/Event");
const EventToUser = require('../models/event/EventToUser');

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
        }
        catch(err){
            console.log('Image does not exist or upload to s3 failed');
        }
        finally{
            imgKey = imgKey || '';
        }

        return imgKey;
    }

    const initEventToUser = async userId => {
        const eventToUser = await EventToUser.findOne({ user: userId });
        const user = await getUser(userId);
        if(!eventToUser){
            const newEventToUser = new EventToUser({
                user,
                registeredEvents: [],
                organisedEvents: [],
            });
            const result = await newEventToUser.save();
            console.log(result);
            return result;
        }

        return eventToUser;
    }

    app.post('/event/create', uploadLocal.single('file'), async (req, res) => {
        const {userId, title, description, startDatetime, endDatetime} = req.body;

        const user = await getUser(userId);

        const imgKey = req.file ? await uploadImage(req) : '';
        if(imgKey){
            deleteLocalFile(imgKey);
        }

        const eventDetails = {
            title,
            description,
            
            startDatetime,
            endDatetime,

            user,
            imgKey,

            registeredUsers: [],
        }
        const newEvent = new Event(eventDetails);

        try{
            const result = await newEvent.save();
            res.send(result);
        }
        catch(err){
            res.send({err});
        }

        
        try{
            const eventToUser = await initEventToUser(userId);
            console.log(eventToUser);
            eventToUser.organisedEvents.push(newEvent);
            const result = await eventToUser.save();
            console.log(`Saved organised event ${result._id} to user ${userId}`);
        }
        catch(err){
            console.log(err);
        }
    });

    // Read
    const getEvents = async id => {
        const result = await Event.find(id ? {_id: id} : {})
            .populate({ path: 'user', })
        return result;
    }
    const getEventsWithRegisteredUsers = async id => {
        const result = await Event.find(id ? {_id: id} : {});
        // console.log(result, result.length > 0);
        if(result.length > 0){
            const resultPopulated = 
                await Event.find(id ? {_id: id} : {})
                    .populate({ path: 'user', })
                    .populate({ path: 'registeredUsers', });
            return resultPopulated;
        }
        return result;
    }

    app.get('/event/read', async (req, res) => {
        const { id } = req.query;

        try{
            const result = await getEventsWithRegisteredUsers(id);

            if(!result){
                res.send([]);
                return;
            }
            if(id){
                res.send(result[0]);
                return;
            }
            res.send(result);
        }
        catch(err){
            console.log(err);
            res.send({err});
        }
    });
    app.get('/event/read/registered', async (req, res) => {
        const { userId } = req.query;

        try{
            const eventToUser = await initEventToUser(userId);
            if(!eventToUser){
                res.send([]);
                return;
            }
            const eventToUserPopulated = await EventToUser.findOne({userId})
                .populate({ path: 'registeredEvents', });
            res.send(eventToUserPopulated);
        }
        catch(err){
            console.log(err);
            res.send({err});
        }
    });
    app.get('/event/read/organised', async (req, res) => {
        const { userId } = req.query;

        try{
            const eventToUser = await initEventToUser(userId);
            if(!eventToUser){
                res.send([]);
                return;
            }
            const eventToUserPopulated = await EventToUser.findOne({userId})
                .populate({ path: 'organisedEvents', });
            res.send(eventToUserPopulated);
        }
        catch(err){
            console.log(err);
            res.send({err});
        }
    });
    // Update
    app.post('/event/update/register', async (req, res) => {
        const { id, userId } = req.body;

        console.log(req.body);
        const [evt] = await getEvents(id);
        if(!evt.registeredUsers){
            await Event.updateOne( {_id: id}, {registeredUsers: []});
        }

        if(evt.registeredUsers.includes(userId)){
            const result = await Event.updateOne( {_id: id}, {registeredUsers: evt.registeredUsers.filter(ui => ui != userId)});
            console.log(`Removed registered user ${userId} for event ${id}`);
            res.send({msg: 'Unregistered from event'});

            // Remove registered event from event-to-user
            try{
                const eventToUser = await initEventToUser(userId);
                console.log(eventToUser);
                eventToUser.registeredEvents = eventToUser.registeredEvents.filter(evtId => evtId != id);
                const result = await eventToUser.save();
                console.log(`Removed registered event ${result._id} from user ${userId}`);
            }
            catch(err){
                console.log(err);
            }
            return;
        }

        const user = await User.findOne({_id: userId});
        evt.registeredUsers.push(user);
        
        const result = await evt.save();
        console.log(`Added registered user ${userId} for event ${id}`);
        res.send({msg: 'Successfully registered for event'});

        // Add registered event to event-to-user
        try{
            const eventToUser = await initEventToUser(userId);
            console.log(eventToUser);
            eventToUser.registeredEvents.push(evt);
            const result = await eventToUser.save();
            console.log(`Saved registered event ${result._id} to user ${userId}`);
        }
        catch(err){
            console.log(err);
        }
    });

    // Delete
    app.get('/event/delete', async (req, res) => {
        const { id } = req.query;

        // Delete image
        try{
            const [event] = await getEvents(id);
            const { imgKey } = event;
            imgKey && await deleteFile(imgKey, 'image');
            console.log(`Deleted event img: ${imgKey}`);
        }
        catch(err){
            console.log(err);
        }

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