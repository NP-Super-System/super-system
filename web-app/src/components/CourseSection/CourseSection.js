import React, {useState, useEffect} from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { FileIcon, defaultStyles } from 'react-file-icon';

import styles from './CourseSection.module.css';

const CourseSection = props => {

    const { courseId, courseCode, _id: sectionId, title, files } = props;
    const [filesToBeAdded, setFilesToBeAdded] = useState([]);

    useEffect( () => {
        
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
        <Card className={styles.wrapper}>
            <header className={styles.header}>
                <Card.Title className={styles.title}>{title}</Card.Title>
                <form 
                    action='http://localhost:5000/course/update/section'
                    method='POST'
                    encType='multipart/form-data'
                    className={styles.add_file_form}>
                    <input 
                        type='hidden' 
                        name='courseId' 
                        value={courseId}
                        />
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
            </header>
            <div className={styles.files}>
            {
                files.map( (item, i) =>
                    <Button
                        key={`${i}`} 
                        className={styles.file}
                        variant='primary'
                        onClick={() => saveFile(item.name, item.key)}
                        >
                        <div className={styles.icon}>
                            <FileIcon 
                                extension={item.name.split('.')[1]}
                                {...defaultStyles[item.name.split('.')[1]]}
                                />
                        </div>
                        {item.name}
                    </Button>
                )
            }
            </div>
        </Card>
    )
}

export default CourseSection;