import React, {useState, useEffect, useRef} from 'react';
import { Image } from 'react-bootstrap';

import styles from './Login.module.css';

import LoginButton from './LoginButton';
import { useScreenType } from '../../hooks/useScreenType';

const Login = props => {
    const screenType = useScreenType();

    return (
        <div className={screenType === 'phone' ? styles.container_phone : styles.container}>
            <div className={styles.left_pane}>
                <h1 className={styles.title}>Super-Learn</h1>
                <div className={styles.description}>
                    A Gamified Learning Management System
                </div>
            {
                screenType !== 'phone' ?

                <Image
                    className={styles.img} 
                    src={'./media/login/courses.png'}/>

                :

                <div className={styles.content}>
                    <p className={styles.slogan}>Making Poly Learning Fun</p>
                    <LoginButton />
                </div>
            }
            </div>
        {
            screenType !== 'phone' &&
            <div className={styles.right_pane}>
                <div className={styles.content}>
                    <p className={styles.slogan}>Making Poly Learning Fun</p>
                    <LoginButton />
                </div>
            </div>
        }
        </div>
    );
}

export default Login;