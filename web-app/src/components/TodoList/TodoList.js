import React, {useState, useEffect, useContext} from 'react';
import { Card, Form, Button, Checkbox } from 'react-bootstrap';
import { BsFillTrash2Fill } from 'react-icons/bs';

import styles from './TodoList.module.css';
import GlobalContext from '../../context/GlobalContext';

const TodoList = props => {

    const { user } = useContext(GlobalContext);

    const [items, setItems] = useState([]);

    const [text, setText] = useState('');

    const addTodoItem = (userId, body) => {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ userId, body }),
        }

        console.log(`Adding new todo item...`);

        const addItemUrl = 'http://localhost:5000/add-todo-item';

        fetch(addItemUrl, options)
            .then(res => {
                console.log('Added new todo item');
                getTodoItems(userId);
                setText('');
            })
            .catch(err => console.log(err));
    }

    const updateTodoItem = (userId, itemId, checked) => {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ userId, itemId, checked }),
        }

        console.log(`Updating todo item...`);

        const updateItemUrl = 'http://localhost:5000/update-todo-item';

        fetch(updateItemUrl, options)
            .then(res => {
                console.log('Updated todo item');
                getTodoItems(userId);
            })
            .catch(err => console.log(err));
    }

    const deleteTodoItem = (userId, itemId) => {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ userId, itemId }),
        }

        console.log(`Deleting todo item...`);

        const deleteItemUrl = 'http://localhost:5000/delete-todo-item';

        fetch(deleteItemUrl, options)
            .then(res => {
                console.log('Delete todo item');
                getTodoItems(userId);
            })
            .catch(err => console.log(err));
    }

    const getTodoItems = userId => {
        fetch(`http://localhost:5000/get-todo-list/${userId}`)
            .then(res => res.json()
                .then(data => {
                    console.log(data);
                    setItems(data);
                })
                .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }
    
    useEffect(() => {
        getTodoItems(user.id);
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        addTodoItem(user.id, text);
    }

    return (
        <Card className={styles.wrapper}>
            <Card.Title>To-Do list</Card.Title>
            <form
                onSubmit={onSubmit}
                className={styles.add_form}>
                <Form.Group className={styles.textarea}>
                    <Form.Control
                        name='text'
                        as='textarea'
                        rows={2}
                        placeholder='New to-do item'
                        value={text}
                        onChange={e => setText(e.target.value)}
                        />
                </Form.Group>
                <Button
                    variant='primary'
                    type='submit'
                    className={styles.submit_btn}
                    >
                    <span>Add</span>
                </Button>
            </form>
            {
                items.map( (item, i) => 
                    <div key={`${i}`} className={styles.todoitem}>
                        <Form.Check
                            type='checkbox'
                            checked={item.checked}
                            onChange={e => updateTodoItem(user.id, item._id, !item.checked)}
                        />
                        <span className={styles.body}>{item.body}</span>
                        <Button
                            variant='primary'
                            onClick={e => deleteTodoItem(user.id, item._id)}
                            className={styles.delete_btn}>
                            <BsFillTrash2Fill 
                                className={styles.icon}/>
                        </Button>
                    </div>
                )
            }
        </Card>
    );
}

export default TodoList;