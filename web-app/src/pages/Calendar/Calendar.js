import React, {useState, useEffect, useContext} from 'react';

import styles from './Calendar.module.css';

import CalendarHeader from '../../components/CalendarHeader/CalendarHeader';
import CalendarComponent from '../../components/CalendarComponent/CalendarComponent';
import GlobalContext from '../../context/GlobalContext';

const Calendar = props=>{
    
    useEffect(()=>{
        return ()=>{

        }
    });

    return (
        <div className='container'>
            <CalendarHeader />
            <CalendarComponent />
        </div>
    );
}

export default Calendar;