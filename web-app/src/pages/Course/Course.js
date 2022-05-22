import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import styles from './Course.module.css';

import PageContainer from '../../layout/PageContainer';

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

                <>
                    {JSON.stringify(courseData)}
                </>
            }
        </PageContainer>
    );
}

export default Course;