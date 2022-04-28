import React from 'react';

import styles from './Deadlines.module.css';
import Card from "react-bootstrap/Card";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { DeadlinesData } from './DeadlinesData';


class Deadlines extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card className={styles.wrapper}>     
                <Card.Title>Deadlines</Card.Title>       
                {
                    DeadlinesData.map((item, index) => 
                        // <p key={`${index}`}>
                        //     <b>{item.datetime} {item.title}</b> 
                        //     <br /> 
                        //     {item.desc} 
                        //     <br />
                        // </p>
                        <Link key={`${index}`} to={`/home/${item.to}`} className={styles.deadline}>
                            <h5 className={styles.deadline_title}>{item.title}</h5>
                            <span className={styles.deadline_datetime}>{item.datetime}</span>
                            <span className={styles.deadline_desc}>{item.desc}</span>
                        </Link>  
                    )
                }  
            </Card>
        )
    }
}

export default Deadlines;