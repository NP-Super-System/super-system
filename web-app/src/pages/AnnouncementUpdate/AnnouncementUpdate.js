import React, {useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';

import styles from './AnnouncementUpdate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

const AnnouncementUpdate = props => {

    const { user } = useContext(GlobalContext);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(()=>{
        
    }, []);

    return (
        <PageContainer>
            <form action='http://localhost:5000/update-announcement' method='POST' className={styles.form}>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control name='title' type='input' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} required/>
                </Form.Group>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Text</Form.Label>
                    <Form.Control name='body' as='textarea' rows={3} placeholder='Text' value={body} onChange={e => setBody(e.target.value)}/>
                </Form.Group>
                <input type='hidden' name='userId' value={user.id} />
                <Button 
                    variant='primary' 
                    type='submit'>
                    Update
                </Button>
            </form>

        </PageContainer>
    );
}

export default AnnouncementUpdate;