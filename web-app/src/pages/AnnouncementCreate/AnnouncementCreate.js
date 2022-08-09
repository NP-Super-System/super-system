import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsFillArrowLeftCircleFill, BsX } from 'react-icons/bs';

import styles from './AnnouncementCreate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';

import Swal from 'sweetalert2';

const AnnouncementCreate = props => {

    const { user } = useContext(GlobalContext);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const [currTag, setCurrTag] = useState('');
    const [tags, setTags] = useState([]);
    const handleDeleteTag = tagToDelete => {
        setTags(tags.filter(tag => tag !== tagToDelete));
    }

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    useEffect(() => {
        console.log(tags);
    }, [tags]);

    const backBtn = () => {
        if (!title && !body) {
            goBack();
            return
        }
        Swal.fire({
            title: 'There are unsaved changes',
            text: "Are you sure you want to discard the changes?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, discard changes!'
        })
            .then((result) => {
                result.isConfirmed && goBack();
            });
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
                    <Form.Control name='title' type='input' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} required />
                </Form.Group>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Text</Form.Label>
                    <RichTextEditor onChange={text => setBody(text)}/>
                    <input type='hidden' name='body' value={body} />
                </Form.Group>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Tags</Form.Label>
                    <div className={styles.tags}>
                    {
                        tags.map( (tag, i) =>
                            <div key={`${i}`} className={styles.tag}>
                                <span className={styles.name}>{tag}</span>
                                <div 
                                    className={styles.icon}
                                    onClick={e => handleDeleteTag(tag)}>
                                    <BsX />
                                </div>
                            </div>
                        )
                    }
                    </div>
                    <Form.Control 
                        className={styles.tag_input}
                        type='input' 
                        placeholder='Type a tag and press "Enter"'
                        value={currTag}
                        onKeyDown={
                            e => {
                                if(!['Enter', 'Tab', ','].includes(e.key)) return;

                                e.preventDefault();
                                const value = currTag.trim();

                                if(!value) return;

                                setTags([
                                    ...tags,
                                    value,
                                ]);
                                setCurrTag('');
                            }
                        }
                        onChange={e => setCurrTag(e.target.value)}/>
                </Form.Group>
                <input type='hidden' name='tags' value={tags} />
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