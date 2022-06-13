import React, {useState, useEffect, useContext} from 'react';
import { Card, Form, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import styles from './EventCreate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';

const EventCreate = props => {

    const { user } = useContext(GlobalContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [startDt, setStartDt] = useState(''); // convert using new Date(startDt);
    const [endDt, setEndDt] = useState('');

    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState('');
    const onImageChange = e=>{
        if(!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setSelectedImage(file); 
    }

    useEffect(()=>{
        if (!selectedImage) return;

        const objectUrl = URL.createObjectURL(selectedImage);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedImage]);

    const handleSubmit = e => {
        e.preventDefault();
        if(!user) return;
        
        const formData = new FormData();
        formData.append('userId', user.id);
        formData.append('title', title);
        formData.append('description', desc);
        formData.append('startDatetime', startDt);
        formData.append('endDatetime', endDt);
        formData.append('file', selectedImage);

        const options = {
            method: 'POST',
            body: formData,
        }

        fetch('http://localhost:5000/event/create', options)
            .then(res => {
                toast.success('Successfully posted event!');
                navigate('/event');
            })
            .catch(err => {
                toast.error('Error posting event');
                console.log(err);
            })
    }

    return (
        <PageContainer>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Title'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required/>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Description</Form.Label>
                    <RichTextEditor name='description' onChange={text => setDesc(text)}/>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Start Date And Time</Form.Label>
                    <Form.Control 
                        type='datetime-local'
                        onChange={e => setStartDt(e.target.value)}/>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>End Date And Time</Form.Label>
                    <Form.Control 
                        type='datetime-local'
                        onChange={e => setEndDt(e.target.value)}/>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control 
                        type='file'
                        accept='image/png, image/jpeg'
                        size='sm'
                        onChange={onImageChange}/>
                    {selectedImage && <Image src={preview} className={styles.preview}/>}
                </Form.Group>

                <Button 
                    variant='primary'
                    type='submit'>
                    <span>Submit</span>
                </Button>
            </form>
        </PageContainer>
    );
}

export default EventCreate;