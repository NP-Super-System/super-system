import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import styles from './LogoutButton.module.css';

const LogoutButton = props=>{
    const { logout } = useAuth0();

    return (
        <button onClick={() => logout()}>
            Sign Out
        </button>
    );
}

export default LogoutButton;