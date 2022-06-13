import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './EventExpand.module.css';

import PageContainer from '../../layout/PageContainer';

const EventExpand = props => {

    const { eventId } = useParams();

    useEffect(()=>{

    }, []);

    return (
        <PageContainer>
            EventExpand: {eventId}
        </PageContainer>
    )
}

export default EventExpand;
