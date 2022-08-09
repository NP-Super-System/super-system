import React, {useState, useEffect} from 'react';
import {Card, Image, Button} from 'react-bootstrap';

import styles from './RedeemedComponent.module.css';

const RedeemedComponent = props => {
    
    const { name, description, cost, quantity } = props;

    useEffect(() => {
        
    }, []);

    return (
        <Card className={styles.reward}>
            <Card.Title className={styles.title}>{name}</Card.Title>
            <span className={styles.description}>{description}</span>
            <div className={styles.cost}>
                <Image 
                    src={'/media/coin.png'}
                    className={styles.img}/>
                <span className={styles.text}>{cost}</span>
            </div>
        </Card>
    )
}

export default RedeemedComponent;