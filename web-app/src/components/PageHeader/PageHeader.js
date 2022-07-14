import React, { useState, useEffect } from 'react';

import styles from './PageHeader.module.css';

const PageHeader = props => {

    const { screenType, searchBarElement, children } = props;

    useEffect(() => {
        
    }, []);

    return (
        <header className={`${styles.header} ${screenType !== 'show-sidebar' && styles.add_top}`}>
            <div className={styles.searchbar}> {searchBarElement} </div>
            <div className={styles.actions}> {children} </div>
        </header>
    )
}

export default PageHeader;