import React, { useState, useEffect } from 'react';
import { Card, ProgressBar } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

import styles from './Courses.module.css';

const Courses = props => {

    const [courses, setCourses] = useState([]);

    useEffect( () =>{
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
            .catch(err => console.log(err))
    }, []);

    const variant = progress => {
        if (progress > 66) {
            return ''
        }
        if (progress > 33) {
            return 'warning'
        }
        return 'danger'
    }

    return (
        <Card className={styles.bigCard}>     
            <Card.Title>My Courses</Card.Title>
            <div className={styles.wrapper}>
            {
                courses.map( (course, i)=>
                    <Link key={`${i}`} to={`/home/course/${course.code}`} className={styles.course_link}>
                        <img className={styles.course_img} src={`http://localhost:5000/s3/image/?key=${course.imgKey}`} alt="Course"/>
                        <div className={styles.course_content}>
                            <Card.Title>{course.name}</Card.Title>
                            <Card.Text>{course.code}</Card.Text>
                            <ProgressBar variant={variant(75)} now={75} label={`${75}%`} />
                        </div>
                    </Link>
                )
            }
            </div>   
        </Card>
    )
}

export default Courses;