const User = require('../models/user/User');
const TodoItem = require('../models/todolist/TodoItem');

// CRUD operations

const operations = app => {

    // Create - add todoitem
    const createTodoItem = async (res, userId, body) => {
        const user = await User.findOne({_id: userId});
        const newTodoItem = new TodoItem({
            body,
            checked: false,
        });
        user.todolist.push(newTodoItem);

        user.save()
            .then(result => {
                console.log('Added new todo item');
                res.send();
            })
            .catch(err => console.log(err));
    }

    app.post('/add-todo-item', async (req, res) => {
        const { userId, body } = req.body;
        await createTodoItem(res, userId, body);
    });

    // Read - get todolist
    const readTodoItem = async (res, userId) => {
        User.findOne({_id: userId})
        .then(user => {
            if(!user){
                res.send({});
                return;
            }
            res.send(user.todolist);
        })
        .catch(err => console.log(err));
    }

    app.get('/get-todo-list/:userId', async (req, res) => {
        const { userId } = req.params;
        await readTodoItem(res, userId);
    });

    // Update - update todoitem
    const updateTodoItem = async (res, userId, itemId, checked) => {
        const user = await User.findOne({_id: userId});
        const [todoitem] = user.todolist.filter(item => item._id == itemId);
        todoitem.checked = checked;
        user.save()
            .then(result => {
                console.log('Updated todo item');
                res.send();
            })
            .catch(err => console.log(err));
    }

    app.post('/update-todo-item', async (req, res) => {
        const { userId, itemId, checked } = req.body;
        await updateTodoItem(res, userId, itemId, checked);
    });

    // Delete - delete todoitem
    const deleteTodoItem = async (res, userId, itemId) => {
        const user = await User.findOne({_id: userId});
        const itemIndex = user.todolist.map(item => item._id.toString()).indexOf(itemId);
        user.todolist.splice(itemIndex, 1);
        user.save()
            .then(result => {
                console.log('Deleted todo item');
                res.send();
            })
            .catch(err => console.log(err));
    }

    app.post('/delete-todo-item', async (req, res) => {
        const { userId, itemId } = req.body;
        await deleteTodoItem(res, userId, itemId);
    });
}

module.exports = operations;
