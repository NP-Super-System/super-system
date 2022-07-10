import React, {useState, useEffect, useContext} from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileIcon, defaultStyles } from 'react-file-icon';

import styles from './ForumCreate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';

const ForumCreate = props=>{

    const { user } = useContext(GlobalContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [currTag, setCurrTag] = useState('');
    const [tags, setTags] = useState([]);

    const handleDeleteTag = tagToDelete => {
        setTags(tags.filter(tag => tag !== tagToDelete));
    }

    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const onImageChange = e=>{
        if(!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        
        setSelectedImage(file);
    }
    const [imgInputKey, setImgInputKey] = useState('0');
    const clearImage = e => {
        setSelectedImage(null);
        setImgInputKey(Math.random().toString(36));
    }
    useEffect(()=>{
        if (!selectedImage) return;

        const objectUrl = URL.createObjectURL(selectedImage);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedImage]);

    const [fileList, setFileList] = useState([]);
    const handleFileChange = e => {
        if(!e.target.files || e.target.files.length === 0) return;

        const newFileList = Object.values(e.target.files);
        setFileList(newFileList);
        console.log(newFileList);
    }
    const [fileInputKey, setFileInputKey] = useState('0');
    const clearFileList = e => {
        setFileList([]);
        setFileInputKey(Math.random().toString(36));
    }


    const handleSubmit = async e => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('userId', user.id);
        formData.append('title', title);
        formData.append('body', body);
        formData.append('tags', tags);
        for (var file of fileList){
            formData.append('files[]', file);
        }
        formData.append('img', selectedImage);

        for (var pair of formData){
            console.log(pair);
        }

        const url = 'http://localhost:5000/forum/create';
        const options = {
            method: 'POST',
            body: formData,
        }

        fetch(url, options)
            .then(result => {
                console.log('Added new forum post');
                toast.success('Successfully created post!');
                navigate('/forum');
            })
            .catch(err => {
                toast.error('Error creating post');
                console.log(err);
            });
    }

    return (
        <PageContainer>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        name='title' 
                        type='input' 
                        placeholder='Title' 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        required/>
                </Form.Group>

                <Form.Group className={`mb-3`}>
                    <Form.Label>Text</Form.Label>
                    <RichTextEditor name='body' onChange={text => setBody(text)}/>
                </Form.Group>

                <Form.Group className={`mb-3`}>
                    <Form.Label>Files</Form.Label>
                    <div className={styles.files}>
                    {
                        fileList.map((file, i) => {
                            const { name } = file;
                            let line = name.split('.');
                            const fileExt = line[line.length-1];

                            return <div key={`${i}`} className={styles.file}>
                                <div className={styles.fileicon}>
                                    <FileIcon 
                                        extension={fileExt}
                                        {...defaultStyles[fileExt]}/>
                                </div>
                                <span className={styles.filename}>{name}</span>
                            </div>
                        })
                    }
                    </div>
                    <div className={styles.file_input}>
                        <Form.Control
                            key={fileInputKey}
                            type='file'
                            size='sm'
                            onChange={handleFileChange}
                            multiple/>
                    {
                        fileList.length > 0 &&
                        <Button
                            variant='danger'
                            onClick={clearFileList}>
                            Cancel
                        </Button>
                    }
                    </div>
                </Form.Group>

                <Form.Group className={`mb-3`}>
                    <Form.Label>Image</Form.Label>
                    <div className={styles.img_input}>
                        <Form.Control
                            key={imgInputKey}
                            name='img' 
                            type='file' 
                            accept='image/png, image/jpeg' 
                            size='sm' 
                            onChange={onImageChange}/>
                    {
                        selectedImage &&
                        <Button
                            variant='danger'
                            onClick={clearImage}>
                            Cancel
                        </Button>
                    }
                    </div>
                    {selectedImage && <Image src={preview} className={styles.preview}/>}
                </Form.Group>

                <Form.Group className={'mb-3'}>
                    <Form.Label>Tags</Form.Label>
                    <div className={styles.tags}>
                    {
                        tags.map( (tag, i) =>
                            <React.Fragment key={`${i}`}>
                                <div className={styles.tag}>
                                    <span className={styles.name}>{tag}</span>
                                    <div 
                                        className={styles.icon}
                                        onClick={e => handleDeleteTag(tag)}>
                                        <BsX />
                                    </div>
                                </div>
                                <input 
                                    type='hidden'
                                    name={`tags[]`}
                                    value={tag}
                                    />
                            </React.Fragment>
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

                <input type='hidden' name='userId' value={user.id} />

                <Button 
                    variant='primary' 
                    type='submit'>
                    Post
                </Button>
            </form>
        </PageContainer>
    );
}

export default ForumCreate;