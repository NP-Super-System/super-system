import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Image, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import parse from 'html-react-parser';

import styles from './EventExpand.module.css';

import PageContainer from '../../layout/PageContainer';

const EventExpand = props => {

    const { eventId } = useParams();

    const [eventData, setEventData] = useState(null);

    useEffect(()=>{
        fetch(`http://localhost:5000/event/read?id=${eventId}`)
            .then(res => res.json()
                .then(data => {
                    data = {
                        ...data,
                        startDatetime: new Date(data.startDatetime),
                        endDatetime: new Date(data.endDatetime),
                    }
                    setEventData(data);
                    console.log(data);
                })
                .catch(err => console.log(err))
            )
            .catch(err => {
                toast.error('Error retrieving event data');
                console.log(err);
            });
    }, []);


    return (
        <PageContainer>
            <div className={styles.wrapper}>
                <div className={styles.parallax}>
                {
                    eventData?.imgKey && 
                    <Image 
                        className={styles.image}
                        src={`http://localhost:5000/s3/image/?key=${eventData.imgKey}`}/>
                }
                {
                    eventData?.title &&
                    <h1 className={styles.title}>{eventData.title}</h1>
                }
                </div>
                <div className={styles.content}>
                    <section className={styles.left_pane}>
                        <span>{eventData?.startDatetime && eventData.startDatetime.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
                        <span>to</span>
                        <span>{eventData?.endDatetime && eventData.endDatetime.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
                        <Button
                            type='submit'
                            variant='primary'
                            className={styles.register_btn}
                            >
                            Register
                        </Button>
                    </section>
                    <section className={styles.description}>{eventData?.description && parse(eventData.description)}</section>
                </div>
            </div>
        </PageContainer>
    )
}

export default EventExpand;