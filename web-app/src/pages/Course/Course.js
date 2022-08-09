import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, Card } from 'react-bootstrap';
import parse from 'html-react-parser';

import styles from './Course.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import Section from './Section';
import { getPostAge } from '../../hooks/getPostAge';

const Course = props => {

    const { user } = useContext(GlobalContext);

    const { courseCode } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [completedSections, setCompletedSections] = useState(null);
    const [announcements, setAnnouncements] = useState([]);

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

    const fetchUserCourseData = async () => {
        if(!user) return;
        fetch(`http://localhost:5000/course/user/read?userId=${user._id}`)
            .then(res => res.json()
                .then(data => {
                    console.log(data);
                    setCompletedSections(data.courses.find(c => c.code === courseCode).completedSections);
                })
                .catch(err => console.log(err)))
            .catch(err => console.log(err));
    }

    const fetchCourseAnnouncements = async () => {
        fetch(`http://localhost:5000/announcement/read`)
            .then(res => res.json()
                .then(data => {
                    setAnnouncements(data.filter(ann => ann.tags.includes(courseCode)));
                })
                .catch(err => console.log(err)))
            .catch(err => console.log(err));
    }
    useEffect(() => {
        console.log(announcements);
    }, [announcements]);

    useEffect(() => {
        fetchCourseData();
        fetchCourseAnnouncements();
    }, []);
    useEffect(() => {
        fetchUserCourseData();
    }, [user]);



    return (
        <PageContainer>
        {
            courseData &&

            <Row>
                <Col>
                    <Card className={styles.sections}>
                        <Card.Title className={styles.title}>{courseData.name}</Card.Title>
                        {
                            courseData.sections.map((item, i) => {
                                return <>
                                    <Section 
                                        key={`${i}`} 
                                        {...item} 
                                        courseId={courseData._id} 
                                        courseCode={courseCode} 
                                        completed={completedSections?.includes(item._id)}/>
                                </>
                            })
                        }
                    </Card>
                </Col>
                <Col>
                    <Card className={styles.announcements}>
                        <Card.Title className={styles.title}>Announcements</Card.Title>
                        {
                            announcements.map((item, i) => {
                                const {title, body, tags, updatedAt} = item;
                                return <Card key={`${i}`} className={styles.announcement}>
                                    <Card.Title>{title}</Card.Title>
                                    <Card.Body>{parse(body)}</Card.Body>
                                    <span className={styles.age}>{getPostAge(updatedAt)}</span>
                                </Card>
                            })
                        }
                    </Card>
                </Col>
            </Row>
        }
        </PageContainer>
    );
}

export default Course;