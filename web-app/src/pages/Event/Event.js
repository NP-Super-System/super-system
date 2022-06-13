import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Image } from 'react-bootstrap';
import toast from 'react-hot-toast';
import parse from 'html-react-parser';

import styles from './Event.module.css';

import PageContainer from '../../layout/PageContainer';
import EventComponent from './EventComponent';

const Event = props=>{

    const [events, setEvents] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/event/read')
            .then(res => {
                res.json()
                    .then(data => setEvents(data))
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <PageContainer>
            <header className={styles.header}>
                <div className={styles.filter}>
                    <input
                        className={styles.input} 
                        type='text'
                        placeholder='Search'
                        value={searchFilter}
                        onChange={e => setSearchFilter(e.target.value)}/>
                    <Button
                        variant='primary'
                        type='submit'
                        className={styles.button}
                        >
                        <span>Search</span>
                    </Button>
                </div>
                <Link to='/event/create'>
                    <Button
                        className={styles.create_link}
                        variant='primary'>
                        Create
                    </Button>
                </Link>
            </header>
            <div className={styles.wrapper}>
            {
                events.map( (event, i) =>
                    // <Card key={`${i}`} className={styles.event}>
                    //     <Image
                    //         className={styles.img}
                    //         src={`http://localhost:5000/s3/image/?key=${event.imgKey}`}/>
                    //     <Card.Title>{event.title}</Card.Title>
                    //     <div className={styles.desc}>
                    //         {parse(event.description)}
                    //     </div>
                    // </Card>
                    <EventComponent key={`${i}`} {...event}/>
                )
            }
            </div>
        </PageContainer>
    );
}

export default Event;