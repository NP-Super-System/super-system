import React, {useState, useEffect, useContext} from 'react';

import styles from './Calendar.module.css';

import PageContainer from '../../layout/PageContainer';
import CalendarHeader from './CalendarHeader';
import CalendarComponent from './CalendarComponent';
import GlobalContext from '../../context/GlobalContext';

const Calendar = props=>{
    
    useEffect(()=>{
        return ()=>{

        }
    }, []);

    return (
        <PageContainer>
            <CalendarHeader />
            <CalendarComponent />
        </PageContainer>
    );
}

export default Calendar;