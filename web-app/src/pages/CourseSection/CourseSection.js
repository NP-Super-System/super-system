import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Form, Col, Row } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { FileIcon, defaultStyles } from 'react-file-icon';

import styles from './CourseSection.module.css';

import PageContainer from '../../layout/PageContainer';

const CourseSection = props => {

    const { courseCode, sectionId } = useParams();
    const [sectionData, setSectionData] = useState(null);
    const [filesToBeAdded, setFilesToBeAdded] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/course/read/${courseCode}/${sectionId}`)
            .then(res => {
                res.json()
                    .then(data => {
                        console.log(data);
                        setSectionData(data);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }, []);

    const onFileChange = e => {
        setFilesToBeAdded(e.target.files);
    }

    const saveFile = (fileName, fileKey) => {
        saveAs(
            `http://localhost:5000/s3/file/${fileKey}`,
            fileName,
        );
    }

    return (
        <PageContainer>
        {
            sectionData &&

            <>
                <h1>{sectionData.title}</h1>
                <div className={styles.file_section}>
                    <h2>Files</h2>
                    <form 
                        action='http://localhost:5000/course/update/section'
                        method='POST'
                        encType='multipart/form-data'
                        className={styles.add_file_form}>
                        <input 
                            type='hidden' 
                            name='courseCode' 
                            value={courseCode}
                            />
                        <input 
                            type='hidden' 
                            name='sectionId' 
                            value={sectionId}
                            />
                        <Form.Group>
                            <Form.Control 
                                type='file'
                                name='file'
                                onChange={onFileChange}
                                required
                                />
                        </Form.Group>
                        <Button
                            variant='primary'
                            type='submit'
                            >
                            Add file
                        </Button>
                    </form>
                    <Card className={styles.file_list}>
                    {
                        sectionData.files.map( (file, i) => {
                            const fileExt = file.name.split('.')[1];

                            return <div key={`${i}`} className={styles.file}>
                                <Button
                                    variant='primary'
                                    className={styles.download}
                                    onClick={() => saveFile(file.name, file.key)}>
                                    <div className={styles.icon}>
                                        <FileIcon
                                            extension={fileExt}
                                            {...defaultStyles[fileExt]}/>
                                    </div>
                                    <span className={styles.name}>{file.name}</span>
                                </Button>
                                <form
                                    action='http://localhost:5000/course/delete/section/file'
                                    method='POST'>
                                    <input 
                                        type='hidden' 
                                        name='courseCode' 
                                        value={courseCode}
                                        />
                                    <input 
                                        type='hidden' 
                                        name='sectionId' 
                                        value={sectionId}
                                        />
                                    <input 
                                        type='hidden' 
                                        name='fileKey' 
                                        value={file.key}
                                        />
                                    <Button
                                        variant='danger'
                                        type='submit'>
                                        Delete
                                    </Button>
                                </form>
                            </div>
                        })
                    }
                    </Card>
                </div>
                <div className={styles.url_section}>
                    <h2>URLs</h2>
                    <Card>
                        URls
                    </Card>
                </div>
            </>
        }
        </PageContainer>
    );
}

export default CourseSection;