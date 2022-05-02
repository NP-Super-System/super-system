import React from 'react';
import { Form, Button } from 'react-bootstrap';

import styles from './ForumCreate.module.css';

const ForumCreate = props=>{

    return (
        <div className='container'>
            <form action='http://localhost:5000/add-forum-post' method='POST' className={styles.form}>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control name='title' type='input' placeholder='Title' />
                </Form.Group>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Content</Form.Label>
                    <Form.Control name='body' as='textarea' rows={3} placeholder='Content' />
                </Form.Group>
                <Button variant='primary' type='submit'>Post</Button>
            </form>
        </div>
    );
}

export default ForumCreate;