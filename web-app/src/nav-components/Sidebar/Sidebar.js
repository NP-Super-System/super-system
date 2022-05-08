import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import { Image } from 'react-bootstrap';

import styles from './Sidebar.module.css';

import { NavData } from '../NavData';

const Sidebar = props=>{

    const { user } = props;

    const [collapsed, setCollapsed] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [useDefaultProfilePic, setUseDefaultProfilePic] = useState(true);

    const location = useLocation();

    useEffect(()=>{
        const curPath = window.location.pathname.split('/')[1];
        const activeItem = NavData.findIndex(item => item.section === curPath);
        setActiveIndex(activeItem);
    }, [location]);

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                SUPER-SYSTEM :)
            </div>
            <Link to='/profile' className={`${styles.profile} ${activeIndex === 0 ? styles.profile_active : ''}`}>
                <div className={styles.profile_icon}>
                    <Image 
                        src={user.picture || `media/default-profile-pic.jpeg`}
                        alt='Profile Picture' 
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        }}
                    />
                </div>
                <div className={styles.profile_name}>
                    {user.given_name} {user.family_name}
                </div>
            </Link>
            <div className={styles.menu}>
                {
                    NavData.map( (item, i)=>{
                        return item.show ? 
                        
                        <Link key={`${i}`} to={item.to} className={activeIndex === i ? styles.menu_item_active : styles.menu_item}>
                            <div className={styles.menu_item_icon}>
                                {activeIndex === i ? item.iconActive : item.icon}
                            </div>
                            <div className={styles.menu_item_title}>
                                {item.title}
                            </div>
                        </Link>

                        :
                        
                        null
                    } )
                }
            </div>
        </div>
    );
}

export default Sidebar;