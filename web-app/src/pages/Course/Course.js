import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import styles from './Course.module.css';

import PageContainer from '../../layout/PageContainer';

const Course = props=>{

    const {courseCode} = useParams();

    useEffect(()=>{
        
        return ()=>{

        }
    });

    return (
        <PageContainer>
            Course code: {courseCode || 'No course id provided'}
        </PageContainer>
    );
}

export default Course;