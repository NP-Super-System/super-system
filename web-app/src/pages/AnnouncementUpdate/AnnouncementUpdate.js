import React, {useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

import styles from './AnnouncementUpdate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

const AnnouncementUpdate = props => {

    const { user } = useContext(GlobalContext);
    const { announcementNum } = useParams();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [announcement, setAnnouncement] = useState(null);


    useEffect(()=>{
        getAnnouncement();
    }, []);

    const getAnnouncement = () => {
        // Get all announcements from server
        fetch(`http://localhost:5000/announcement/read/${announcementNum}`)
            .then(
                res => res.json()
                    .then(data => {
                        // Set announcement
                        console.log(data);
                        setAnnouncement(data);
                        setTitle(data.title);
                        setBody(data.body);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    return (
        <PageContainer>
            <form action={`http://localhost:5000/announcement/update/${announcementNum}`} method='POST' className={styles.form}>
                <Link to='/home'>          
                    <Button 
                        variant='outline-primary' 
                        className={styles.backBtn}
                        type='submit'>
                        <BsFillArrowLeftCircleFill />
                    </Button>
                </Link>
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