import React, { useState, useEffect, useContext } from 'react';
import { Button, Image } from 'react-bootstrap';
import toast from 'react-hot-toast';

import styles from './EventRegistered.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import EventComponent from './EventComponent';

const EventRegistered = props => {

    const { user } = useContext(GlobalContext);

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const url = `http://localhost:5000/event/read/registered/?userId=${user.id}`;

        fetch(url)
            .then(res => {
                res.json()
                    .then(data => {
                        console.log(data.registeredEvents);
                        setEvents(data.registeredEvents);
                    })
                    .catch(err => {
                        console.log(err);
                        toast.error(err);
                    })
            })
            .catch(err => {
                console.log(err);
                toast.error(err);
            });
    }, []);

    return (
        <PageContainer>
            <div className={styles.wrapper}>
                
                <span className={styles.title}>Registered Events</span>
                <div className={styles.events}>
                {
                    events ?
                    events.map( (evt, i) => {
                        return <EventComponent key={`${i}`} {...evt}/>
                    })
                    :
                    null
                }
                </div>
            </div>
        </PageContainer>
    )
}

export default EventRegistered;