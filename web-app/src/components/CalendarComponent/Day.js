import React, {useState, useEffect} from 'react';

import styles from './Day.module.css';

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
}

const Day = props=>{
    return (
        <div className={styles.wrapper}>
            <header className={props.day.format('M')-1 != props.monthIndex.mod(12) ? styles.gray_header : props.isToday ? styles.today_header : styles.black_header}>
                {props.day.format('DD')}
            </header>
            <div className={styles.content}>
                
            </div>
        </div>
    );
}

export default Day;