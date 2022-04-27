import React, {useState, useEffect, useContext} from 'react';
import dayjs from 'dayjs';

import styles from './CalendarComponent.module.css';

import { getMonth } from './util';
import GlobalContext from '../../context/GlobalContext';
import Day from './Day';

const CalendarComponent = props=>{
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const { monthIndex } = useContext(GlobalContext);

    useEffect(() => {
        // console.table(currentMonth);

        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);

    return (
        <div className={styles.months}>
            {
                currentMonth.map( (row, i)=>{
                    return <React.Fragment key={i}>
                        {
                            row.map( (day, j)=>{
                                return <Day key={j} day={day} monthIndex={monthIndex}/>
                            } )
                        }
                    </React.Fragment>
                } )
            }
        </div>
    );
}

export default CalendarComponent;