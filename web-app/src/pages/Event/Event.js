import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Image } from 'react-bootstrap';
import toast from 'react-hot-toast';
import parse from 'html-react-parser';

import styles from './Event.module.css';

import PageContainer from '../../layout/PageContainer';
import EventComponent from './EventComponent';
import { useScreenType } from '../../hooks/useScreenType';

const Event = props=>{

    const screenType = useScreenType();

    const [events, setEvents] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/event/read')
            .then(res => {
                res.json()
                    .then(data => {
                        setEvents(data);
                        console.log(data);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <PageContainer>
            <header className={`${styles.header} ${screenType !== 'show-sidebar' && styles.add_top}`}>
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
            <div className={styles.events}>
            {
                events.map( (event, i) =>
                    <EventComponent key={`${i}`} {...event}/>
                )
            }
            </div>
        </PageContainer>
    );
}

export default Event;