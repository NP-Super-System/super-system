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
            <div>
                <Card>     
                    <Card.Title>Announcements</Card.Title>       
                    {AnnouncementsData.map((item, index) => 
                        <p key={`${index}`}>
                            <b>{item.title}</b> 
                            <br /> 
                            {item.desc}
                        </p>
                        // <Link key={`${index}`} to={`/home/${item.code}`} className={styles.link}>
                            
                        // </Link>   
                    )}  
                             
                </Card>
            </div>
        )
    }
}

export default MyCourses;