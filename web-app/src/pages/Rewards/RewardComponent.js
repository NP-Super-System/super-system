import React, { useState, useEffect, useContext } from 'react';
import { Card, Image } from 'react-bootstrap';
import toast from 'react-hot-toast';

import styles from './RewardComponent.module.css';

import RewardModal from './RewardModal';
import GlobalContext from '../../context/GlobalContext';

const RewardComponent = props => {
    const {user} = useContext(GlobalContext);

    const { _id, name, description, cost } = props;
    const [quantity, setQuantity] = useState(0);


    const [showModal, setShowModal] = useState(false);

    const getReward = () => {
        fetch(`http://localhost:5000/reward/read/?id=${props._id}`)
            .then(res => {
                res.json()
                    .then(data => {
                        setQuantity(data.quantity);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getReward();
    }, [showModal])

    const handleRedeem = e => {
        if(!user) return;
        console.log('redeem reward');
        
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id,
                userId: user.id,
                quantity: quantity - 1,
            }),
        }
        fetch('http://localhost:5000/reward/update/', options)
            .then(res => {
                res.json()
                    .then(data => {
                        console.log(data, data.msg);
                        if(data.msg != ''){
                            toast(data.msg);
                            return;
                        } 
                        toast.success(`Redeemed ${data.name}`);
                        setQuantity(data.quantity);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));   
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