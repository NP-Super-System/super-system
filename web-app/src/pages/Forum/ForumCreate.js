import React, {useState, useEffect} from 'react';
import { Form, Button, Image } from 'react-bootstrap';

import styles from './ForumCreate.module.css';

const ForumCreate = props=>{

    const [selectedImage, setSelectedImage] = useState(undefined);
    const [preview, setPreview] = useState(undefined);

    const onImageChange = e=>{
        if(!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        console.log('change image');
        setSelectedImage(file); 
    }

    useEffect(()=>{
        if (!selectedImage) return;

        const objectUrl = URL.createObjectURL(selectedImage);
        console.log(objectUrl);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedImage]);

    return (
        <div className='container'>
            <form action='http://localhost:5000/add-forum-post' method='POST' className={styles.form}>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control name='title' type='input' placeholder='Title' required/>
                </Form.Group>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Image</Form.Label>
                    <Form.Control name='image' type='file' accept='image/png, image/jpeg' onChange={onImageChange}/>
                    {selectedImage && <Image src={preview} className={styles.preview}/>}
                </Form.Group>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Text</Form.Label>
                    <Form.Control name='body' as='textarea' rows={3} placeholder='Text'/>
                </Form.Group>
                <Button variant='primary' type='submit'>Post</Button>
            </form>
        </div>
    );
}

export default ForumCreate;