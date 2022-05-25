import React, {useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

import styles from './AnnouncementUpdate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

import Swal from 'sweetalert2'


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

    const backBtn = () => {
        if ((announcement.title !== title) || (announcement.body !== body)) {
            Swal.fire({
                title: 'There are unsaved changes',
                text: "Are you sure you want to discard the changes?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, discard changes!'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location = "http://localhost:3000/home";
                }
            })            
        }
        else {
            window.location = "http://localhost:3000/home";
        }
    }

    return (
        <PageContainer>
            <form action={`http://localhost:5000/announcement/update/${announcementNum}`} method='POST' className={styles.form}>
                <Button 
                    variant='outline-primary' 
                    className={styles.backBtn}
                    onClick={() => backBtn()}>
                    <BsFillArrowLeftCircleFill />
                </Button>
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