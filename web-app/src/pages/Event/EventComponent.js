import React, {useState, useEffect} from 'react'
import { Card, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { BsCalendar4Event } from 'react-icons/bs';

import styles from './EventComponent.module.css';

const EventComponent = props => {

    const {_id, title, description, startDatetime, endDatetime, imgKey} = props;

    const startDt = new Date(startDatetime);
    const endDt = new Date(endDatetime);

    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        console.log(imgKey, loaded);
    }, [loaded, imgKey]);

    return (
        <Card className={styles.wrapper}>
        {   
            imgKey ?
            <Image
                className={styles.img}
                src={`http://localhost:5000/s3/image/?key=${imgKey}`}
                onLoad={() => setLoaded(true)}
                
                height={160}/>
            :
            <div className={styles.no_img}>
                <BsCalendar4Event className={styles.icon}/>
            </div>
        }
            <div className={styles.panes}>
                <div className={styles.left_pane}>
                    <Card.Title>{title}</Card.Title>
                    <div className={styles.desc}>
                        {parse(description)}
                    </div>
                </div>
                <div className={styles.right_pane}>
                    <span>Start: {startDt.getDate()}/{startDt.getMonth()+1}/{startDt.getFullYear()}</span>
                    <span>End: {endDt.getDate()}/{endDt.getMonth()+1}/{endDt.getFullYear()}</span>
                </div>
            </div>
            <Link to={`/event/${_id}`} style={{textDecoration: 'none', color: 'black', width: '100%'}}>
                <Button
                    variant='secondary'
                    className={styles.button}>
                    See More
                </Button>
            </Link>
        </Card>
    );
}

export default EventComponent;