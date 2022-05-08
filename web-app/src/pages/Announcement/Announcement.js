import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import styles from './Announcement.module.css';

import PageContainer from '../../layout/PageContainer';

const Announcement = props=>{

    const {announcementNum} = useParams();

    useEffect(()=>{
        
        return ()=>{

        }
    });

    return (
        <PageContainer>
            Announcement: {announcementNum || 'No announcement number provided'}
        </PageContainer>
    );
}

export default Announcement;