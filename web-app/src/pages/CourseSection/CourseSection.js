import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { BsFillTrash2Fill } from 'react-icons/bs';
import parse from 'html-react-parser';

import styles from './CourseSection.module.css';

import PageContainer from '../../layout/PageContainer';
import TextModal from './TextModal';

const CourseSection = props => {

    const { courseCode, sectionId } = useParams();
    const [sectionData, setSectionData] = useState(null);
    const [filesToBeAdded, setFilesToBeAdded] = useState([]);
    const [showTextModal, setShowTextModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
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
    }

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
                <header className={styles.section_header}>
                    <h2>{sectionData.title}</h2>
                </header>
                <div className={styles.top_row}>
                    <Card className={styles.file_section}>
                        <div className={styles.header}>
                            <h4>Files</h4>
                            <form 
                                action='http://localhost:5000/course/update/section/file'
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
                        </div>
                        <div className={styles.file_list}>
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
                                            <BsFillTrash2Fill />
                                        </Button>
                                    </form>
                                </div>
                            })
                        }
                        </div>
                    </Card>
                    <div className={styles.text_section}>
                        <div className={styles.header}>
                            <h4>Text</h4>
                            <Button
                                onClick={e => setShowTextModal(true)}>
                                <span>Add Text</span>
                            </Button>
                            <TextModal showModal={showTextModal} setShowModal={setShowTextModal} fetchData={fetchData}/>
                        </div>
                        <div className={styles.text_list}>
                        {
                            sectionData.textList.map( (item, i) =>
                                <div key={`${i}`} className={styles.text}>
                                    {parse(item.text)}
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>
                <Card className={styles.challenge_section}>
                {
                    sectionData.challengeId ?

                    <>
                        <div className={styles.header}>
                            <h3>Section Challenge</h3>
                        </div>
                        <div className={styles.challenge}>
                            <Button
                                variant='primary'>
                                <span>Attempt Challenge</span>
                            </Button>
                        </div>
                    </>

                    :

                    <span style={{
                        fontStyle: 'italic',
                    }}>
                        This section does not have relevant challenges
                    </span>
                }
                </Card>
            </>
        }
        </PageContainer>
    );
}

export default CourseSection;