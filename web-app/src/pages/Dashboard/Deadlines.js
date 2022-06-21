import React from 'react';

import styles from './Deadlines.module.css';
import Card from "react-bootstrap/Card";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { DeadlinesData } from './DeadlinesData';
import { Row, } from 'react-bootstrap';


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
                        <Link key={`${index}`} to={`/home/deadline/${item.to}`} className={styles.deadline}>
                            <Row>
                                <span className={styles.deadline_module}>{item.module}</span>
                            </Row>
                            <Row>
                                <span className={styles.deadline_datetime}>{item.datetime}</span>
                            </Row>
                            <Row>
                                <span className={styles.deadline_desc}>{item.desc}</span>
                            </Row>
                        </Link>  
                    )
                }  
            </Card>
        )
    }
}

export default Deadlines;