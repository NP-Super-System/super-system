import React, {useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

import styles from './ChallengeCreate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

const ChallengeCreate = props => {

    const { user } = useContext(GlobalContext);

    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState('');

    useEffect(()=>{

    }, []);

    return (
        <PageContainer>
            <form action='http://localhost:5000/challenge/create' method='POST' className={styles.form}>
                <Link to='/challenges'>
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
                <Form.Control name='body' as='textarea' rows={3} placeholder='Text' value={questions} onChange={e => setQuestions(e.target.value)}/>
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

export default ChallengeCreate;