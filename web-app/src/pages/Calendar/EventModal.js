import React, { useState, useEffect, useContext} from 'react';
import { Button, Modal } from 'react-bootstrap';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import styles from './EventModal.module.css';

import GlobalContext from '../../context/GlobalContext';

const EventModal = props => {

    const { show, setShow, getCalendarEventData, evtId, text, date } = props;
    const { user } = useContext(GlobalContext);

    useEffect(()=>{

    }, []);

    const deleteEvent = e => {
        const url = 'http://localhost:5000/calendar/delete';
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({userId: user.id, eventIdList: [evtId]}),
        }
        fetch(url, options)
            .then(res => {
                toast.success('Deleted event');
                setShow(false);
                getCalendarEventData();
            })
            .catch(err => {
                toast.error(err);
                console.log(err);
            });
    }

    return (
        <Modal show={show} centered>
            <div className={styles.modal}>
                <Modal.Header>{text}</Modal.Header>
                <Modal.Body>Date: {dayjs(new Date(date)).format('ddd, MMM D, YYYY')}</Modal.Body>
                <Modal.Body>Time: {dayjs(new Date(date)).format('h:mm A')}</Modal.Body>
                <Button
                    variant='danger'
                    onClick={e => deleteEvent(e)}>
                    Delete
                </Button>
                <Button
                    variant='secondary'
                    onClick={e => setShow(false)}>
                    Close
                </Button>
            </div>
        </Modal>
    )
}

export default EventModal;