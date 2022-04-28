import React, {useState, useEffect} from 'react';

import styles from './Day.module.css';

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
}

const Day = props=>{
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={`${styles.daytext} ${props.day.format('M')-1 == props.monthIndex.mod(12) ? styles.black_daytext : styles.gray_daytext} ${props.isToday && styles.today_daytext}`}>
                    {props.day.format('D')}
                </div>
            </header>
            <div className={styles.content}>
                
            </div>
        </div>
    );
}

export default Day;