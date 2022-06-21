import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, } from 'react-bootstrap';

import styles from './Section.module.css';

const Section = props => {

    const { courseCode, _id: sectionId, title } = props;
    return (
        <Link 
            to={`/home/course/${courseCode}/${sectionId}`}
            style={{
                textDecoration: 'none',
                color: 'black',
            }}>
            <Card className={styles.wrapper}>
                <Card.Title className={styles.title}>{title}</Card.Title>
            </Card>
        </Link>
    )
}

export default Section;