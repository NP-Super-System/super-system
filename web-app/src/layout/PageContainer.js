import React, {useState, useEffect} from 'react';
import { useScreenType } from './useScreenType';

import styles from './PageContainer.module.css';

const PageContainer = props => {

    const screenType = useScreenType();

    useEffect(() => {
        
    }, []);

    return (
        <div className={
            `container ${screenType == 'show-sidebar' ? styles.container : styles.container_no_sidebar}`
        }>
            {props.children}
        </div>
    );
}

export default PageContainer;