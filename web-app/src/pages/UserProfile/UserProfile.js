import React, {useState, useEffect, useContext} from 'react';
import { Card, Image } from 'react-bootstrap';
import { Link, useParams, Navigate } from 'react-router-dom';

import styles from './UserProfile.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

const UserProfile = props => {

    const { user: userCtx } = useContext(GlobalContext);
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(()=>{

        console.log(userId, userCtx.id, userId === userCtx.id)
        if(userId === userCtx.id){
            setIsOwnProfile(true);
            return;
        }

        fetch(`http://localhost:5000/user/read/?userId=${userId}`)
            .then(res => {
                res.json()
                    .then(data => {
                        console.log(data);
                        setUser(data);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <PageContainer>
        {

            isOwnProfile ?

            <Navigate to={`/profile`} replace/>

            :

            user ?

            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <Image
                        src={user.userPicture}
                        className={styles.user_picture}
                        />
                    <span className={styles.user_name}>
                        {user.userName}
                    </span>
                </header>
                <Card className={`${styles.card} ${styles.user_info}`}>
                    <Card.Title>
                        <span>Personal Details</span>
                    </Card.Title>
                    <div className={styles.info}>
                        <span className={styles.label}>Name:</span>
                        <span className={styles.value}>{user.userName}</span>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>Email:</span> 
                        <span className={styles.value}>{user.userEmail}</span>
                    </div>
                </Card>
            </div>

            :

            <span>Loading profile...</span>
        }
        </PageContainer>
    );

}

export default UserProfile;