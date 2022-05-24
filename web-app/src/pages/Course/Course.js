import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, Card } from 'react-bootstrap';

import styles from './Course.module.css';

import PageContainer from '../../layout/PageContainer';
import CourseSection from '../../components/CourseSection/CourseSection';

const Course = props=>{

    const { courseCode } = useParams();
    const [courseData, setCourseData] = useState(null);

    useEffect(()=>{
        fetch(`http://localhost:5000/course/read/${courseCode}`)
            .then(res => res.json()
                .then(data => {
                    console.log(data);
                    setCourseData(data);
                })
                .catch(err => console.log(err)))
            .catch(err => console.log(err));
    }, []);

    return (
        <PageContainer>
        {
            courseData &&

            <Row>
                <Col>
                    <Card className={styles.sections}>
                        <Card.Title className={styles.title}>{courseData.name}</Card.Title>
                        {
                            courseData.sections.map( (item, i) => 
                                <CourseSection key={`${i}`} {...item} />
                            )
                        }
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Title>Announcements</Card.Title>
                        {
                            courseData.announcements.map( (item, i) => 
                                <Card key={`${i}`}>
                                    
                                </Card>
                            )
                        }
                    </Card>
                </Col>
            </Row>
        }
        </PageContainer>
    );
}

export default Course;