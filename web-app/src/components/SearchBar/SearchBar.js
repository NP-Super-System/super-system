import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

import styles from './SearchBar.module.css';

const SearchBar = props => {

    const { text, handleChange, handleSearch } = props;

    useEffect(() => {

    }, []);

    return (
        <form className={styles.wrapper} onSubmit={handleSearch}>
            <input
                className={styles.input} 
                type='text'
                placeholder='Search'
                value={text}
                onChange={e => handleChange(e.target.value)}/>
            <Button
                variant='none'
                type='submit'
                className={styles.button}>
                <BsSearch color='white' className={styles.icon}/>
            </Button>
        </form>
    )
}

export default SearchBar;