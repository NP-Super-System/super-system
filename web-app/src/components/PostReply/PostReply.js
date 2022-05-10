import React, { useState, useEffect } from 'react';
import { getPostAge } from '../../modules/getPostAge';
import { Card, Image, Button, Form } from 'react-bootstrap';
import { BsReply } from 'react-icons/bs';

import styles from './PostReply.module.css';

const PostReply = props => {
    const { postId, _id: replyId, userName, userPicture, text, replies, createdAt } = props;

    useEffect(() => {

    }, []);

    return (
        <Card className={styles.wrapper}>
            <div className={styles.user_content}>
                <Image 
                    src={userPicture}
                    className={styles.user_picture}
                    referrerPolicy="no-referrer"/>
                <span className={styles.user_name}>{userName}</span>
                <span className={styles.reply_age}>{getPostAge(createdAt)}</span>
            </div>
            <span className={styles.text}>{text}</span>
            <div className={styles.actions}>

            </div>
        </Card>
    );
}

export default PostReply;