import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Form, ProgressBar } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { BsFillTrash2Fill, BsFillStarFill } from 'react-icons/bs';
import parse from 'html-react-parser';

import styles from './CourseSection.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import TextModal from './TextModal';

const CourseSection = props => {

    const { user } = useContext(GlobalContext);

    const { courseCode, sectionId } = useParams();

    const [courseData, setCourseData] = useState(null);
    const [sectionData, setSectionData] = useState(null);
    const [completed, setCompleted] = useState({});

    const [sectionChallenges, setSectionChallenges] = useState([]);
    const [completedChallenges, setCompletedChallenges] = useState([]);

    const [filesToBeAdded, setFilesToBeAdded] = useState([]);
    const [showTextModal, setShowTextModal] = useState(false);


    const fetchSectionData = async () => {
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
    const fetchCourseData = async () => {
        fetch(`http://localhost:5000/course/read/${courseCode}`)
            .then(res => res.json()
                .then(data => {
                    console.log(data);
                    setCourseData(data);
                })
                .catch(err => console.log(err)))
            .catch(err => console.log(err));
    }
    const fetchCourseUserData = async () => {
        if (!user) return;
        fetch(`http://localhost:5000/course/user/read?userId=${user.id}`)
            .then(res => res.json()
                .then(data => {
                    console.log(data);
                    setCompleted(data.courses.find(c => c.code === courseCode).completedSections.includes(sectionId));
                })
                .catch(err => console.log(err)))
            .catch(err => console.log(err));
    }
    const fetchSectionChallenges = async () => {
        if(!sectionData || !user) return;
        const tags = sectionData.tags.join(',');
        fetch(`http://localhost:5000/challenge/read?tags=${tags}`)
            .then(res => res.json()
                .then(data => {
                    console.log('Section challenges', data);
                    setSectionChallenges(data);
                    setCompletedChallenges(data.filter(chal => chal.usersCompleted.includes(user.id)));
                })
                .catch(err => console.log(err)))
        .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchSectionData();
        fetchCourseData();
        fetchCourseUserData();
    }, []);

    useEffect(() => {
        fetchSectionChallenges();
    }, [sectionData]);

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
                                {
                                    user?.userRoles?.some(role => role === 'Admin' || role === 'Lecturer') &&
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
                                }
                            </div>
                            <div className={styles.file_list}>
                                {
                                    sectionData.files.map((file, i) => {
                                        const fileExt = file.name.split('.')[1];

                                        return <div key={`${i}`} className={styles.file}>
                                            <Button
                                                variant='primary'
                                                className={styles.download}
                                                onClick={() => saveFile(file.name, file.key)}>
                                                <div className={styles.icon}>
                                                    <FileIcon
                                                        extension={fileExt}
                                                        {...defaultStyles[fileExt]} />
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
                                                {
                                                    user?.userRoles?.some(role => role === 'Admin' || role === 'Lecturer') &&
                                                    <Button
                                                        variant='danger'
                                                        type='submit'>
                                                        <BsFillTrash2Fill />
                                                    </Button>
                                                }
                                            </form>
                                        </div>
                                    })
                                }
                            </div>
                        </Card>
                        <div className={styles.text_section}>
                            <div className={styles.header}>
                                {
                                    user?.userRoles?.some(role => role === 'Admin' || role === 'Lecturer') &&
                                    <>
                                        <Button
                                            onClick={e => setShowTextModal(true)}>
                                            <span>Add Text</span>
                                        </Button>
                                        <TextModal showModal={showTextModal} setShowModal={setShowTextModal} fetchData={fetchSectionData} />
                                    </>
                                }
                            </div>
                            <div className={styles.text_list}>
                                {
                                    sectionData.textList.map((item, i) =>
                                        <div key={`${i}`} className={styles.text}>
                                            {parse(item.text)}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div className={styles.complete_status}>
                        {
                            completed ?
                            <>
                                <BsFillStarFill className={styles.icon}/>
                                <span className={styles.text}>
                                    You have completed this section! Hooray!
                                </span>
                            </>

                            : sectionData.hasChallenge ?
                            <span className={styles.text}>You have not completed this section</span>

                            :
                            null
                        }
                    </div>
                    <Card className={styles.challenge_section}>
                        {
                            sectionData.hasChallenge ?

                                <Link
                                    style={{
                                        textDecoration: 'none',
                                        color: 'black',
                                    }}
                                    to={`/challenges?s=${sectionData?.tags.join(' ')}`}>
                                    Search for <b>{sectionData?.tags.join(' ')}</b> challenges
                                </Link>

                                :

                                <span>
                                    This section does not have challenges
                                </span>
                        }
                    </Card>
                    {
                        sectionData.hasChallenge ?

                        <div className={styles.completed_challenges}>
                            <h6>Completed Challenges</h6>
                            <span className={styles.progress}>
                                {completedChallenges.length}/{sectionChallenges.length}
                            </span>
                            <ProgressBar
                                bsPrefix={`progress ${styles.progress_bar}`}
                                animated
                                striped
                                variant='info'
                                now={Math.floor((completedChallenges.length / sectionChallenges.length) * 100)}/>
                            <div className={styles.challenges}>
                                
                            </div>
                        </div>

                        :

                        null
                    }
                </>
            }
        </PageContainer>
    );
}

export default CourseSection;