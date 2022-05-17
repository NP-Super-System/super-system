import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { Button } from 'react-bootstrap';

import styles from './LoginButton.module.css';

const LoginButton = props=>{
    const { loginWithRedirect } = useAuth0();

    return (
        <Button
            className={styles.button}
            onClick={() => loginWithRedirect()}>
            Sign In
        </Button>
    );
}

export default LoginButton;