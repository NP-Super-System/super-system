import React, { useState, useEffect, useContext } from 'react';
import { Button, Image } from 'react-bootstrap';
import toast from 'react-hot-toast';

import styles from './EventOrganiser.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import EventComponent from './EventComponent';

const EventOrganiser = props => {

    const { user } = useContext(GlobalContext);

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const url = `http://localhost:5000/event/read/organised/?userId=${user.id}`;

        fetch(url)
            .then(res => {
                res.json()
                    .then(data => {
                        console.log(data.events);
                        setEvents(data.events);
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
                
                <span className={styles.title}>Organised Events</span>
                <div className={styles.events}>
                {
                    events.map( (evt, i) => {
                        return <EventComponent key={`${i}`} {...evt}/>
                    })
                }
                </div>
            </div>
        </PageContainer>
    )
}

export default EventOrganiser;