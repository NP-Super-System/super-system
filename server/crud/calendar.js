const User = require('../models/user/User');
const CalendarEvent = require('../models/calendarEvent/CalendarEvent');

const operations = app => {
    // Create
    app.post('/calendar/create', async (req, res) => {
        try{
            const {userId, text, colour, date} = req.body;
            const user = await User.findOne({_id: userId});

            if(!user) throw "Could not find user";

            user.calendarEvents.push(new CalendarEvent({
                text,
                colour,
                date,
            }));

            const result = await user.save();
            res.send(result);
        }
        catch(err){
            console.log(err);
            res.status(404).send(err);
        }
    });
    // Read
    app.get('/calendar/read', async (req, res) => {
        try{
            const {userId} = req.query;
            const user = await User.findOne({_id: userId});
            if(!user) throw "Could not find user";
            res.send(user.calendarEvents);
        }
        catch(err){
            res.status(404).send(err);
        }
    });
    // Update

    // Delete
    app.post('/calendar/delete', async (req, res) => {
        try{
            const {userId, eventIdList} = req.body;
            const user = await User.findOne({_id: userId});
            if(!user) throw "Could not find user";
            const result = await User.updateOne({$pull: {calendarEvents: {_id: eventIdList}}});
            res.send(result);
        }
        catch(err){
            console.log(err);
            res.status(404).send(err);
        }
    })
}

module.exports = operations;