import React, {useState, useEffect, useContext} from 'react';
import { Col, Row, Card, Image } from 'react-bootstrap';

import styles from './Profile.module.css';

import PageContainer from '../../layout/PageContainer';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import GlobalContext from '../../context/GlobalContext';

const Profile = props=>{

    const { user } = useContext(GlobalContext);

    return (
        <PageContainer>
            <Row className={styles.header}>
                <Image
                    src={user.picture}
                    className={styles.header_user_picture}
                    />
                <span className={styles.header_user_name}>{user.name}</span>
            </Row>
            <Row>
                <Col className={styles.user_info}>
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                </Col>
            </Row>
            <Row>
                <LogoutButton />
            </Row>
        </PageContainer>
    );
}

export default Profile;