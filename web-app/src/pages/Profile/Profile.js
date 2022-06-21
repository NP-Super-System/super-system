import React, {useState, useEffect, useContext} from 'react';
import { Card, Image } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import styles from './Profile.module.css';

import PageContainer from '../../layout/PageContainer';
import LogoutButton from './LogoutButton';
import GlobalContext from '../../context/GlobalContext';

const Profile = props=>{

    const { user } = useContext(GlobalContext);
    const { userId } = useParams();
    
    return (
        <PageContainer>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <Image
                        src={user.picture}
                        className={styles.user_picture}
                        />
                    <span className={styles.user_name}>
                        Welcome back, {user.name}
                    </span>
                </header>
                <Card className={`${styles.card} ${styles.user_info}`}>
                    <Card.Title>
                        <span>Personal Details</span>
                    </Card.Title>
                    <div className={styles.info}>
                        <span className={styles.label}>Name:</span>
                        <span className={styles.value}>{user.name}</span>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>Email:</span> 
                        <span className={styles.value}>{user.email}</span>
                    </div>
                </Card>
                <Card className={`${styles.card} ${styles.game}`}>
                    <Link to='/game' style={{textDecoration: 'none', color: 'black'}}>
                        <Card.Title>My Pet</Card.Title>
                    </Link>
                </Card>
                <Card className={`${styles.card} ${styles.settings}`}>
                    <Card.Title>
                        <span>Settings</span>
                    </Card.Title>
                    <LogoutButton />
                </Card>
            </div>
        </PageContainer>
    );
}

export default Profile;