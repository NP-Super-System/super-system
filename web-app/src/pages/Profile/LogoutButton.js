import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap'

import styles from './LogoutButton.module.css';

const LogoutButton = props=>{
    const { logout } = useAuth0();

    return (
        <Button
            className={styles.button}
            variant='primary'
            onClick={() => logout()}
            >
            Sign Out
        </Button>
    );
}

export default LogoutButton;