import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Image, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import parse from 'html-react-parser';
import { BsCalendar4Event } from 'react-icons/bs';
import dayjs from 'dayjs';

import styles from './EventExpand.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

const EventExpand = props => {

    const { eventId } = useParams();
    const { user } = useContext(GlobalContext);

    const [eventData, setEventData] = useState(null);

    const fetchEventData = () => {
        fetch(`http://localhost:5000/event/read?id=${eventId}`)
            .then(res => res.json()
                .then(data => {
                    data = {
                        ...data,
                        startDatetime: new Date(data.startDatetime),
                        endDatetime: new Date(data.endDatetime),
                    }
                    setEventData(data);
                    console.log(data);
                })
                .catch(err => console.log(err))
            )
            .catch(err => {
                toast.error('Error retrieving event data');
                console.log(err);
            });
    }

    useEffect(()=>{
        fetchEventData();
    }, []);

    useEffect(()=>{
        console.log(eventData?.registeredUsers);
        console.log(eventData?.registeredUsers.map(ru => ru._id).includes(user?.id))
    }, [eventData]);

    const handleRegister = e => {
        if(!user) return;
        const url = 'http://localhost:5000/event/update/register';

        console.log({ id: eventId, userId: user.id });
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ id: eventId, userId: user.id }),
        }

        fetch(url, options)
            .then(async res => {
                const data = JSON.parse(await res.text());
                toast.success(data.msg);
                console.log(data.msg);
                fetchEventData();
            })
            .catch(err => {
                toast.error('Error registering for event');
                console.log(err);
            });
    }

    return (
        <PageContainer>
            <div className={styles.wrapper}>
                <div className={styles.parallax}>
                {
                    eventData?.imgKey ? 
                    <Image 
                        className={styles.image}
                        src={`http://localhost:5000/s3/image/?key=${eventData.imgKey}`}/>
                    :
                    <BsCalendar4Event className={styles.icon}/>
                }
                {
                    eventData?.title &&
                    <h1 className={styles.title}>{eventData.title}</h1>
                }
                </div>
                <div className={styles.content}>
                    <section className={styles.left_pane}>
                    {   
                        eventData?.startDatetime &&
                        <>
                            <div className={styles.from}>
                                <span>From:</span>
                                <span className={styles.date}>{dayjs(eventData.startDatetime).format('MMM D, YYYY | dddd')}</span>
                                <span className={styles.time}>{dayjs(eventData.startDatetime).format('h:mm a')}</span>
                            </div>
                            <div className={styles.to}>
                                <span>To:</span>
                                <span className={styles.date}>{dayjs(eventData.endDatetime).format('MMM D, YYYY | dddd')}</span>
                                <span className={styles.time}>{dayjs(eventData.endDatetime).format('h:mm a')}</span>
                            </div>
                        </>
                    }
                    {
                        eventData?.registeredUsers.map(ru => ru._id).includes(user?.id) ? 

                        <Button
                            type='submit'
                            variant='secondary'
                            className={styles.unregister_btn}
                            onClick={handleRegister}>
                            Unregister
                        </Button>

                        :

                        <Button
                            type='submit'
                            variant='primary'
                            className={styles.register_btn}
                            onClick={handleRegister}>
                            Register
                        </Button>
                    }
                    {
                        eventData?.user &&
                        <div className={styles.host}>
                            <span style={{marginBottom: '0.5em'}}>Organised by:</span>
                            <div className={styles.profile}>
                                <Image
                                    src={eventData.user.userPicture}
                                    className={styles.image}/>
                                <span className={styles.name}>{eventData.user.userName}</span>
                            </div>
                        </div>
                    }
                    </section>
                    <section className={styles.right_pane}>
                        <div className={styles.description}>
                            {eventData?.description && parse(eventData.description)}
                        </div>
                        <hr></hr>
                        <div className={styles.registered_users}>
                        {
                            eventData?.registeredUsers?.length > 0 ?

                            <>
                                <ul className={styles.icon_container} style={{width: `${Math.min(eventData.registeredUsers.length, 3) * 20}px`}}>
                                {
                                    eventData.registeredUsers.slice(0, 3).map( (ruser, i) => {
                                        const { userName, userPicture } = ruser;
                                        
                                        return <li key={`${i}`} className={styles.icon_wrapper} style={{ left: `${i * 20}px`}}>
                                            <Image
                                                src={userPicture}
                                                className={styles.icon}/>
                                        </li>
                                    })
                                }
                                </ul>
                            {
                                eventData.registeredUsers.length > 1 ?

                                <span>{eventData.registeredUsers[0].userName} and {eventData.registeredUsers.length-1} others are attending</span>
                                :
                                <span>{eventData.registeredUsers.length} person is attending</span>
                            }
                            </>

                            :

                            <span className={styles.first_text}>Be the first to attend this event!</span>
                        }
                        </div>
                    </section>
                </div>
            </div>
        </PageContainer>
    )
}

export default EventExpand;