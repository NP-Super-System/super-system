import React from 'react';

import styles from './Profile.module.css';

import LogoutButton from '../../components/LogoutButton/LogoutButton';

const Profile = props=>{

    return (
        <div className='container'>
            Profile
            <LogoutButton />
        </div>
    );
}

export default Profile;