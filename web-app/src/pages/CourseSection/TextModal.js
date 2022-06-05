import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import toast from 'react-hot-toast';

import styles from './TextModal.module.css';

import GlobalContext from '../../context/GlobalContext';

const TextModal = props => {

    const { courseCode, sectionId } = useParams();
    const navigate = useNavigate();

    const { showModal, setShowModal, fetchData } = props;
    const [text, setText] = useState('');

    useEffect(() => {
        
    }, [showModal]);

    const handleSubmit = e => {
        e.preventDefault();

        const url = 'http://localhost:5000/course/update/section/text';

        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({courseCode, sectionId, text}),
        }

        fetch(url, options)
            .then(res => {
                toast.success('Successfully added text post!');
                console.log('Added text post');
                setShowModal(false);
                fetchData();
            })
            .catch(err => {
                toast.error('Error adding text post');
                console.log(err);
            })
    }

    return (
        <Modal
            show={showModal}
            enforceFocus={false}>
            <div className={styles.modal}>
                <Modal.Header>Add Embedded Text</Modal.Header>

                <form
                    onSubmit={handleSubmit}>
                    <RichTextEditor onChange={value => setText(value)}/>
                    <Button
                        variant='primary'
                        type='submit'>
                        <span>Post</span>
                    </Button>
                </form>

                <Button
                    variant='secondary'
                    onClick={e => setShowModal(false)}>
                    <span>Close</span>
                </Button>
            </div>
        </Modal>
    )
}

export default TextModal;