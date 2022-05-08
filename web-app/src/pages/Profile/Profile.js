import React from 'react';

import styles from './Profile.module.css';

import PageContainer from '../../layout/PageContainer';
import LogoutButton from '../../components/LogoutButton/LogoutButton';

const Profile = props=>{

    return (
        <PageContainer>
            Profile
            <LogoutButton />
        </PageContainer>
    );
}

export default Profile;