import React, { useState, useEffect, useContext} from 'react';
import { Card, ProgressBar } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

import styles from './Courses.module.css';

import GlobalContext from '../../context/GlobalContext';
import CourseSection from '../CourseSection/CourseSection';

const Courses = props => {

    const { user } = useContext(GlobalContext);

    const [courses, setCourses] = useState([]);
    const [courseProgress, setCourseProgress] = useState([]);

    const fetchCourseData = async () => {
        fetch('http://localhost:5000/course/read')
            .then(
                res => res.json()
                    .then(data => {
                        const filteredData = data.map(course => {
                            return {
                                id: course._id,
                                name: course.name,
                                code: course.code,
                                imgKey: course.imgKey,
                            }
                        });
                        console.log(filteredData);
                        setCourses(filteredData);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    const fetchCourseProgressData = async () => {
        fetch(`http://localhost:5000/course/progress/read?userId=${user.id}`)
            .then(
                res => res.json()
                    .then(data => {
                        console.log(data);
                        setCourseProgress(data);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    useEffect( () =>{
        fetchCourseData();
        fetchCourseProgressData();
    }, []);


    return (
        <Card className={styles.bigCard}>     
            <Card.Title>My Courses</Card.Title>
            <div className={styles.wrapper}>
            {  
                courses &&
                courses.map( (course, i)=>{
                    const progress = courseProgress.find(c => c.code === course.code)?.progress;
                    return <Link key={`${i}`} to={`/home/course/${course.code}`} className={styles.course_link}>
                        <img className={styles.course_img} src={`http://localhost:5000/s3/image/?key=${course.imgKey}`} alt="Course"/>
                        <div className={styles.course_content}>
                            <Card.Title>{course.name}</Card.Title>
                            <Card.Text>{course.code}</Card.Text>
                            <ProgressBar now={progress} style={{maxHeight: '10px'}}/>
                        </div>
                    </Link>
                })
            }
            </div>   
        </Card>
    )
}

export default Courses;