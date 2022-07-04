import React, {useState, useEffect, useContext} from 'react';
import dayjs from 'dayjs';

import styles from './CalendarComponent.module.css';

import { getMonth } from './util';
import GlobalContext from '../../context/GlobalContext';
import Day from './Day';

const CalendarComponent = props=>{
    const {calendarEvents, setShowAddEventModal, setModalDate, setShowEventModal, setSelectedEvent} = props;

    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const { user, monthIndex } = useContext(GlobalContext);

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);

    useEffect(()=>{
        console.log(calendarEvents);
    }, [calendarEvents]);

    return (
        <>
            <div className={styles.days}>
            {
                ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map( (day, i) =>
                    <div key={`${i}`} className={styles.day_name}>
                        <span>{day}</span>
                    </div>
                )
            }
            </div>
            <div className={styles.months}>
            {
                currentMonth.map( (row, i)=>
                    <React.Fragment key={`${i}`}>
                        {
                            row.map( (day, j)=>{
                                const isToday = day.format('DD/MM/YYYY') == dayjs().format('DD/MM/YYYY');
                                const events = calendarEvents.filter(evt => dayjs(evt.date).format('DD/MM/YYYY') == day.format('DD/MM/YYYY'));
                                return <Day 
                                    key={`${j}`} 
                                    day={day} 
                                    monthIndex={monthIndex} 
                                    isToday={isToday} 
                                    dayEvents={events}
                                    setShowAddEventModal={setShowAddEventModal}
                                    setModalDate={setModalDate}

                                    setShowEventModal={setShowEventModal}
                                    setSelectedEvent={setSelectedEvent}
                                />
                            } )
                        }
                    </React.Fragment>
                )
            }
            </div>
        </>
    );
}

export default CalendarComponent;