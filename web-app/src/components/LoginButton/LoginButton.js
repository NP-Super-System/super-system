import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import styles from './LoginButton.module.css';

const LoginButton = props=>{
    const { loginWithRedirect } = useAuth0();

    return (
        <button onClick={() => loginWithRedirect()}>
            Sign In
        </button>
    );
}

export default LoginButton;