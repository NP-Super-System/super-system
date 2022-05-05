import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import styles from './Course.module.css';

const Course = props=>{

    const {courseCode} = useParams();

    useEffect(()=>{
        
        return ()=>{

        }
    });

    return (
        <div  className='container'>
            Course code: {courseCode || 'No course id provided'}
        </div>
    );
}

export default Course;