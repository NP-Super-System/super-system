import React from 'react';

import styles from './Announcements.module.css';
import Card from "react-bootstrap/Card";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { AnnouncementsData } from './AnnouncementsData';


class MyCourses extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card className={styles.wrapper}>     
                <Card.Title>Announcements</Card.Title>       
                {
                    AnnouncementsData.map((item, index) => 
                        // <p key={`${index}`}>
                        //     <b>{item.title}</b> 
                        //     <br /> 
                        //     {item.desc}
                        // </p>
                        <Link key={`${index}`} to={`/home/announcement/${item.to}`} className={styles.announcement}>
                            <h5 className={styles.announcement_title}>{item.title}</h5>
                            <span className={styles.announcement_datetime}>{item.datetime}</span>
                            <span className={styles.announcement_desc}>{item.desc}</span>
                        </Link>
                    )
                }        
            </Card>
        )
    }
}

export default MyCourses;