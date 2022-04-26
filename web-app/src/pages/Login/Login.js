import React from 'react';

import styles from './Login.module.css';

import LoginButton from '../../components/LoginButton/LoginButton';

const Login = props=>{

    return (
        <div className='container'>
            Login
            <LoginButton />
        </div>
    );
}

export default Login;