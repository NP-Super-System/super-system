import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import styles from './Deadline.module.css';

import PageContainer from '../../layout/PageContainer';

const Deadline = props=>{

    const {deadlineId} = useParams();

    useEffect(()=>{
        
        return ()=>{

        }
    });

    return (
        <PageContainer>
            Deadline: {deadlineId || 'No dateline id provided'}
        </PageContainer>
    );
}

export default Deadline;