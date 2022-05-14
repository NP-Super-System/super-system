import React, {useState, useEffect} from 'react';
import { Card } from 'react-bootstrap';

import styles from './Login.module.css';

import LoginButton from '../../components/LoginButton/LoginButton';

const Login = props=>{

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <Card.Title className={styles.title}>Super-System</Card.Title>
                <LoginButton />
            </Card>
        </div>
    );
}

export default Login;