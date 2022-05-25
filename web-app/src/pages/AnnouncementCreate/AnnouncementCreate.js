import React, {useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

import styles from './AnnouncementCreate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

import Swal from 'sweetalert2'

const AnnouncementCreate = props => {

    const { user } = useContext(GlobalContext);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(()=>{
        
    }, []);

    const backBtn = () => {
        if ((title === '') && (body === '')) {
            window.location = "http://localhost:3000/home";     
        }      
        else {
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
    }

    return (
        <PageContainer>
            <form action='http://localhost:5000/announcement/create' method='POST' className={styles.form}>
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
                    Create
                </Button>
            </form>

        </PageContainer>
    );
}

export default AnnouncementCreate;