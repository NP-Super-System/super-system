import React, {useState, useEffect, useContext} from 'react';
import toast from 'react-hot-toast';

import styles from './Calendar.module.css';

import PageContainer from '../../layout/PageContainer';
import CalendarHeader from './CalendarHeader';
import CalendarComponent from './CalendarComponent';
import GlobalContext from '../../context/GlobalContext';
import EventModal from './EventModal';

const Calendar = props=>{
    
    const {user} = useContext(GlobalContext);
    const [calendarEvents, setCalendarEvents] = useState([]);

    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [modalDate, setModalDate] = useState(new Date());

    const getCalendarEventData = () => {
        const url = `http://localhost:5000/calendar/read?userId=${user.id}`;
        fetch(url)
            .then(res => res.json()
                .then(data => {
                    setCalendarEvents(data);
                })
                .catch(err => {
                    console.log(err);
                }))
            .catch(err => {
                toast.error(err);
                console.log(err);
            });
    }
    useEffect(()=>{
        getCalendarEventData();
    }, []);

    return (
        <PageContainer>
            <CalendarHeader
                userId={user.id}
                showAddEventModal={showAddEventModal}
                setShowAddEventModal={setShowAddEventModal}

                modalDate={modalDate}
                setModalDate={setModalDate}

                getCalendarEventData={getCalendarEventData}
                />
            <CalendarComponent 
                calendarEvents={calendarEvents}
                setShowAddEventModal={setShowAddEventModal}
                setModalDate={setModalDate}

                setShowEventModal={setShowEventModal}
                setSelectedEvent={setSelectedEvent}
                />
            <EventModal 
                show={showEventModal} 
                setShow={setShowEventModal}
                getCalendarEventData={getCalendarEventData}
                {...selectedEvent}/>
        </PageContainer>
    );
}

export default Calendar;