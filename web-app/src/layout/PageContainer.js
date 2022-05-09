import React, {useState, useEffect} from 'react';
import { useScreenType } from './useScreenType';

import styles from './PageContainer.module.css';

const PageContainer = props => {

    const screenType = useScreenType();

    useEffect(() => {
        
    }, []);

    return (
        <div className={screenType == 'show-sidebar' ? styles.container_sidebar : styles.container_navbar}>
            {props.children}
        </div>
    );
}

export default PageContainer;