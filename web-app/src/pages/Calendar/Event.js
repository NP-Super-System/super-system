import React, {useState, useEffect} from 'react';

import styles from './Event.module.css';

const Event = props => {
    const {_id: evtId, text, date, setShowEventModal, setSelectedEvent} = props;

    const handleClick = e => {
        e.stopPropagation();

        setSelectedEvent({evtId, text, date});
        setShowEventModal(true);
    }

    return (
        <div 
            className={styles.wrapper}
            onClick={handleClick}>
            <span className={styles.text}>{text}</span>
        </div>
    )
}

export default Event;