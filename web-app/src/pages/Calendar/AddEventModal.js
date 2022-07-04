import React, { useState, useEffect, useContext } from 'react';
import { Button, Image, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';

import styles from './AddEventModal.module.css';

import GlobalContext from '../../context/GlobalContext';

const AddEventModal = props => {
    const {show, setShow, getCalendarEventData, modalDate, setModalDate} = props;
    const { user } = useContext(GlobalContext);

    const [body, setBody] = useState('');

    useEffect(()=>{

    }, []);

    const handleSubmit = e => {
        e.preventDefault();

        const url = 'http://localhost:5000/calendar/create';
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({userId: user.id, text: body, date: modalDate}),
        }
        fetch(url, options)
            .then(res => {
                toast.success('Added calendar event');
                console.log('Added calendar event');
                setShow(false);
                setBody('');
                setModalDate(new Date());
                getCalendarEventData();
            })
            .catch(err => {
                toast.error(err);
                console.log(err);
            });

        return false;
    }

    return (
        <Modal
            show={show}>
            <div className={styles.modal}>
                <Modal.Header>Add Calendar Event</Modal.Header>
                <form
                    onSubmit={handleSubmit}
                    className={styles.form}>
                    <Form.Group>
                        <Form.Label>Event</Form.Label>
                        <Form.Control
                            as='textarea'
                            value={body}
                            placeholder='Calendar Event'
                            onChange={e => setBody(e.target.value)}
                            required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <DatePicker
                            todayButton="Today"
                            selected={modalDate}
                            onChange={date => setModalDate(date)}
                            showTimeInput
                            />
                    </Form.Group>
                    <Button
                        variant='primary'
                        type='submit'>
                        Add
                    </Button>
                </form>
                <Button
                    variant='secondary'
                    onClick={e => setShow(false)}>
                    Close
                </Button>
            </div>
        </Modal>
    )
}

export default AddEventModal;