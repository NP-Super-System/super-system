import React, {useState, useEffect, useRef} from 'react';
import dayjs from 'dayjs';

import styles from './Day.module.css';

import Event from './Event';

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
}

const Day = props => {
    const {day, dayEvents, setShowAddEventModal, setModalDate, setShowEventModal, setSelectedEvent} = props;
    const isWithinMonth = props.day.format('M')-1 == props.monthIndex.mod(12);

    const handleClick = e => {
        setModalDate(day.toDate());
        setShowAddEventModal(true);
    }

    return (
        <div 
            className={`${styles.wrapper} ${isWithinMonth ? styles.within_month : styles.not_within_month}`}
            onClick={isWithinMonth ? handleClick : null}>
            <header className={styles.header}>
                <div className={`${styles.daytext} ${isWithinMonth ? styles.black_daytext : styles.gray_daytext} ${props.isToday && styles.today_daytext}`}>
                    {props.day.format('DD')}
                </div>
            </header>
            <div className={styles.content}>
            {
                dayEvents.map( (evt, i) => 
                    <Event 
                        key={`${i}`} 
                        {...evt}
                        setShowEventModal={setShowEventModal}
                        setSelectedEvent={setSelectedEvent}
                        />
                )
            }
            </div>
        </div>
    );
}

export default Day;