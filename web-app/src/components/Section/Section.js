import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { FileIcon, defaultStyles } from 'react-file-icon';

import styles from './Section.module.css';

const Section = props => {

    const { courseId, courseCode, _id: sectionId, title } = props;
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