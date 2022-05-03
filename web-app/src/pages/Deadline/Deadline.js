import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import styles from './Deadline.module.css';

const Deadline = props=>{

    const {deadlineId} = useParams();

    useEffect(()=>{
        
        return ()=>{

        }
    });

    return (
        <div>
            Deadline: {deadlineId || 'No dateline id provided'}
        </div>
    );
}

export default Deadline;