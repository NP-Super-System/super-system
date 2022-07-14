import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Image } from 'react-bootstrap';
import { BsSearch, BsPlus } from 'react-icons/bs';
import toast from 'react-hot-toast';
import parse from 'html-react-parser';

import styles from './Event.module.css';

import PageContainer from '../../layout/PageContainer';
import EventComponent from './EventComponent';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
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
            <PageHeader
                searchBarElement={
                    <SearchBar text={searchFilter} handleChange={text => setSearchFilter(text)} />
                }
                screenType={screenType}>
                <Link to='/event/organised'>
                    <Button
                        className={`${styles.action_btn} ${styles.organised_link}`}
                        variant='primary'>
                        View Organised Events
                    </Button>
                </Link>
                <Link to='/event/create'>
                    <Button
                        className={`${styles.action_btn} ${styles.create_link}`}
                        variant='primary'>
                        <BsPlus className={styles.icon}/> Event
                    </Button>
                </Link>
            </PageHeader>
            <div className={styles.events}>
            {   
                events &&
                events.map( (evt, i) =>
                    <EventComponent key={`${i}`} {...evt}/>
                )
            }
            </div>
        </PageContainer>
    );
}

export default Event;