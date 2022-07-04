import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { Button, Image } from 'react-bootstrap';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import toast from 'react-hot-toast';

import styles from './CalendarHeader.module.css';

import GlobalContext from '../../context/GlobalContext';
import AddEventModal from './AddEventModal';

const CalendarHeader = props=>{
    const { userId, modalDate, setModalDate, getCalendarEventData, showAddEventModal, setShowAddEventModal} = props;
    const { monthIndex, setMonthIndex } = useContext(GlobalContext);

    function handlePrevMonth() {
        setMonthIndex(monthIndex - 1);
    }
    function handleNextMonth() {
        setMonthIndex(monthIndex + 1);
    }
    function handleReset() {
        setMonthIndex(dayjs().month());
    }

    // const deleteSelectedEvents = (e, selectedEvents) => {
    //     e.preventDefault();
    //     const url = 'http://localhost:5000/calendar/delete';
    //     const options = {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         method: 'POST',
    //         body: JSON.stringify({userId, eventIdList: selectedEvents}),
    //     }
    //     fetch(url, options)
    //         .then(res => {
    //             toast.success('Deleted events');
    //             setSelectedEvents([]);
    //             getCalendarEventData();
    //         })
    //         .catch(err => {
    //             toast.error(err);
    //             console.log(err);
    //         });

    //     return false;
    // }

    // useEffect(()=>{
    //     console.log(selectedEvents);
    // }, [selectedEvents]);

    return (
        <header className={styles.header}>
            <div className={styles.date_actions}>
                <button className={`${styles.button} ${styles.today_button}`} onClick={handleReset}>
                    Today
                </button>
                <button className={styles.button} onClick={handlePrevMonth}>
                    <BsArrowLeft />
                </button>
                <button className={styles.button} onClick={handleNextMonth}>
                    <BsArrowRight />
                </button>
                <span className={styles.date}>
                    {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
                </span>
            </div>
            <div className={styles.actions}>
                <Button
                    variant='primary'
                    onClick={e => setShowAddEventModal(true)}>
                    Add Event
                </Button>
            </div>
            <AddEventModal 
                show={showAddEventModal} 
                setShow={setShowAddEventModal} 
                modalDate={modalDate} 
                setModalDate={setModalDate} 
                getCalendarEventData={getCalendarEventData}/>
        </header>
    );
}

export default CalendarHeader;