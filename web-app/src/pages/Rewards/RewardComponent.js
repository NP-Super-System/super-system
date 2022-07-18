import React, { useState, useEffect } from 'react';
import { Card, Image } from 'react-bootstrap';

import styles from './RewardComponent.module.css';

import RewardModal from './RewardModal';

const RewardComponent = props => {
    const { name, description, cost, quantity } = props;

    const [showModal, setShowModal] = useState(false);

    const handleRedeem = e => {
        console.log('redeem reward');
    }

    return (
        <Card 
            className={styles.reward}
            onClick={e => setShowModal(true)}>
            <Card.Title className={styles.title}>{name}</Card.Title>
            <div className={styles.description}>{description}</div>
            <div className={styles.cost}>
                <Image className={styles.img} src='/media/coin.png'/>
                <span className={styles.text}>{cost}</span>
            </div>
            <div className={styles.quantity}>Stock left: {quantity}</div>
            <RewardModal 
                show={showModal} 
                setShow={setShowModal} 
                handleRedeem={handleRedeem} 
                {...props}/>
        </Card>
    )
}

export default RewardComponent;