import React, { useState, useEffect, useContext } from 'react';
import { Card, Image } from 'react-bootstrap';

import styles from './RewardComponent.module.css';

import RewardModal from './RewardModal';

import GlobalContext from '../../context/GlobalContext';

const RewardComponent = props => {
    const { _id, name, description, cost, quantity } = props;
    const [count, setCount] = useState(quantity);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

    }, [])

    const handleRedeem = e => {
        console.log('redeem reward');
        
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id,
                quantity: quantity - 1,
            }),
        }
        fetch('http://localhost:5000/reward/update/', options)
            .then(res => {
                res.json()
                    .then(data => {
                        console.log(data, data.quantity);
                        setCount(data.quantity);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));

        // fetch(`http://localhost:5000/reward/read/?id=${_id}`)
        //     .then(res => {
        //         res.json()
        //             .then(data => {
        //                 console.log(data, data.quantity);
        //                 setCount(data.quantity);
        //             })
        //             .catch(err => console.log(err));
        //     })
        //     .catch(err => console.log(err));
        
        console.log(quantity);
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
            <div className={styles.quantity}>Stock left: {count}</div>
            <RewardModal 
                show={showModal} 
                setShow={setShowModal} 
                handleRedeem={handleRedeem} 
                {...props}/>
        </Card>
    )
}

export default RewardComponent;