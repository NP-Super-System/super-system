import React, {useState, useEffect} from 'react';
import { Card } from 'react-bootstrap';

import styles from './CourseSection.module.css';

const CourseSection = props => {

    const { title, files} = props;

    useEffect( () => {
        
    }, []);

    return (
        <Card className={styles.wrapper}>
            <Card.Title className={styles.title}>{title}</Card.Title>
            {
                files.map( (item, i) =>
                    <Card key={`${i}`}>
                        <span>{item.name}</span>
                        <span>{item.key}</span>
                    </Card>
                )
            }
        </Card>
    )
}

export default CourseSection;