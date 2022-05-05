import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import styles from './Announcement.module.css';

const Announcement = props=>{

    const {announcementNum} = useParams();

    useEffect(()=>{
        
        return ()=>{

        }
    });

    return (
        <div  className='container'>
            Announcement: {announcementNum || 'No announcement number provided'}
        </div>
    );
}

export default Announcement;