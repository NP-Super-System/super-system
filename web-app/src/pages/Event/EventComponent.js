import React, {useState, useEffect} from 'react'
import { Card, Image, Button } from 'react-bootstrap';
import parse from 'html-react-parser';

import styles from './EventComponent.module.css';

const EventComponent = props => {

    const {title, description, startDatetime, endDatetime, imgKey} = props;

    const startDt = new Date(startDatetime);
    const endDt = new Date(endDatetime);

    useEffect(()=>{

    }, []);

    return (
        <Card className={styles.wrapper}>
            <Image
                className={styles.img}
                src={`http://localhost:5000/s3/image/?key=${imgKey}`}/>
            <div className={styles.panes}>
                <div className={styles.left_pane}>
                    <span>Start Datetime: {startDt.getDate()}/{startDt.getMonth()+1}/{startDt.getFullYear()}</span>
                    <span>End Datetime: {endDt.getDate()}/{endDt.getMonth()+1}/{endDt.getFullYear()}</span>
                </div>
                <div className={styles.right_pane}>
                    <Card.Title>{title}</Card.Title>
                    <div className={styles.desc}>
                        {parse(description)}
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default EventComponent;