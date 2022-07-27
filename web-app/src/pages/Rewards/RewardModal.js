import React, { useState, useEffect, useContext } from 'react';
import { Button, Image, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';

import styles from './RewardModal.module.css';

import GlobalContext from '../../context/GlobalContext';

const RewardModal = props => {
    
    const { show, setShow, handleRedeem, name, description, cost, quantity} = props;
    const { user } = useContext(GlobalContext);

    useEffect(()=>{
        console.log(show);

    }, [show]);

    return (
        <Modal show={show} enforceFocus={false} centered>
            <div className={styles.modal}>
                <Modal.Header className={styles.name}>{name}</Modal.Header>
                <Modal.Body className={styles.body}>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.cost}>
                        <Image className={styles.img} src='/media/coin.png'/>
                        <span className={styles.text}>{cost}</span>
                    </div>
                    <span className={styles.quantity}>Stocks left: {quantity}</span>
                    <Button
                        variant='primary'
                        onClick={e => {
                            e.stopPropagation();
                            handleRedeem(e);
                        }}>
                        Redeem
                    </Button>
                </Modal.Body>
                <Button
                    variant='secondary'
                    onClick={e => {
                        e.stopPropagation();
                        setShow(false);
                    }}
                    className={styles.close_btn}>
                    Close
                </Button>
            </div>
        </Modal>
    )
}

export default RewardModal;