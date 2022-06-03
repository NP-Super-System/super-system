import React, {useState, useEffect, useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import { Image } from 'react-bootstrap';

import styles from './Sidebar.module.css';

import { NavData } from '../NavData';
import GlobalContext from '../../context/GlobalContext';

const Sidebar = props=>{

    const { user } = useContext(GlobalContext);

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
                Super-System
            </div>
            <Link to='/profile' className={`${styles.profile} ${activeIndex === 0 && styles.active}`}>
                <div className={styles.icon}>
                    <Image 
                        src={user.picture || `media/default-profile-pic.jpeg`}
                        alt='Profile Picture' 
                        style={{
                            width: 46,
                            height: 46,
                            borderRadius: 23,
                        }}
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className={styles.name}>
                    <span>{user.name || 'Loading name...'}</span>
                </div>
            </Link>
            <div className={styles.menu}>
                {
                    NavData.map( (item, i)=>{
                        return item.show ? 
                        
                        <Link key={`${i}`} to={item.to} className={`${styles.item} ${activeIndex === i && styles.active}`}>
                            <div className={styles.icon}>
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