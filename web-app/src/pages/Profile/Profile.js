import React, {useState, useEffect, useContext} from 'react';
import { Card, Image } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import styles from './Profile.module.css';

import PageContainer from '../../layout/PageContainer';
import LogoutButton from './LogoutButton';
import GlobalContext from '../../context/GlobalContext';

const Profile = props=>{

    const { user: userCtx } = useContext(GlobalContext);
    const { userId } = useParams();
    
    const [user, setUser] = useState(null);

    useEffect(()=>{
        fetch(`http://localhost:5000/user/read/?userId=${userCtx.id}`)
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
            user &&
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <Image
                        src={user.userPicture}
                        className={styles.user_picture}
                        />
                    <span className={styles.user_name}>
                        Welcome back, {user.userName}
                    </span>
                </header>
                <div className={`${styles.card} ${styles.user_level}`}>
                    <div className={styles.level}>
                        <CircularProgressbar 
                            value={user.level.progress} 
                            maxValue={100} 
                            text={user.level.count}
                            styles={buildStyles({
                                textSize: '2em',
                            })}/>
                    </div>
                    <div className={styles.coins}>
                        <Image src='./media/coin.png' className={styles.icon}/>
                        <span className={styles.count}>{user.coinCount}</span>
                    </div>
                </div>
                <Card className={`${styles.card} ${styles.user_info}`}>
                    <Card.Title>Personal Details</Card.Title>
                    <div className={styles.info}>
                        <span className={styles.label}>Name:</span>
                        <span className={styles.value}>{user.userName}</span>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>Email:</span> 
                        <span className={styles.value}>{user.userEmail}</span>
                    </div>
                </Card>
                <Card className={`${styles.card} ${styles.game}`}>
                    <Link to='/game' style={{textDecoration: 'none', color: 'black'}}>
                        <Card.Title>Play with my Pet</Card.Title>
                        <Image src='media/game/harry.png' className={styles.pet}></Image>
                    </Link>
                </Card>
                <Card className={`${styles.card} ${styles.settings}`}>
                    <Card.Title>
                        <span>Settings</span>
                    </Card.Title>
                    <LogoutButton />
                </Card>
            </div>
        }
        </PageContainer>
    );
}

export default Profile;