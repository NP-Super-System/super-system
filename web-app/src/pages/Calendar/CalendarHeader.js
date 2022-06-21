import React, {useState, useEffect, useContext} from 'react';
import dayjs from 'dayjs';
import {BsArrowLeft, BsArrowRight} from 'react-icons/bs';

import styles from './CalendarHeader.module.css';

import GlobalContext from '../../context/GlobalContext';

const CalendarHeader = props=>{

    const { monthIndex, setMonthIndex } = useContext(GlobalContext);

    function handlePrevMonth() {
        setMonthIndex(monthIndex - 1);
        // console.log(monthIndex);
    }
    function handleNextMonth() {
        setMonthIndex(monthIndex + 1);
        // console.log(monthIndex);
    }
    function handleReset() {
        setMonthIndex(dayjs().month());
    }

    useEffect(() => {
        
    }, []);

    return (
        <header className={styles.header}>
            <button className={styles.button} onClick={handleReset}>
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
        </header>
    );
}

export default CalendarHeader;