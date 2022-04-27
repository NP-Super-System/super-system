import React, {useState, useEffect, useContext} from 'react';
import dayjs from 'dayjs';

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
            <h1>Calendar Header</h1>
            <button onClick={handleReset}>
                Today
            </button>
            <button onClick={handlePrevMonth}>
                Prev Month
            </button>
            <button onClick={handleNextMonth}>
                Next Month
            </button>
            <h2>
                {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
            </h2>
        </header>
    );
}

export default CalendarHeader;