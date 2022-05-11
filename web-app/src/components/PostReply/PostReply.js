import React, { useState, useEffect } from 'react';
import { getPostAge } from '../../modules/getPostAge';
import { Card, Image, Button, Form } from 'react-bootstrap';
import { BsReply } from 'react-icons/bs';

import styles from './PostReply.module.css';

import LikeCommentWrapper from '../LikeCommentWrapper/LikeCommentWrapper';
import DislikeCommentWrapper from '../DislikeCommentWrapper/DislikeCommentWrapper';

const PostReply = props => {
    const { user, postId, _id: replyId, userName, userPicture, text, likedUsers, dislikedUsers, replies, createdAt } = props;

    const [isLiked, setIsLiked] = useState(likedUsers.includes(user.email));
    const [isDisliked, setIsDisliked] = useState(dislikedUsers.includes(user.email));

    const updateIsLiked = liked => {
        setIsLiked(liked);
        setIsDisliked(false);
    }
    const updateIsDisliked = disliked => {
        setIsDisliked(disliked);
        setIsLiked(false);
    }

    const thumbsUpImgSrc = 'https://img.icons8.com/material-rounded/24/777777/thumb-up.png';
    const thumbsUpLikedImgSrc = 'https://img.icons8.com/material-rounded/24/0b5ed7/thumb-up.png';
    const thumbsUpDislikedImgSrc = 'https://img.icons8.com/material-rounded/24/cc3a3a/thumb-up.png';

    const [likeCount, setLikeCount] = useState(likedUsers.length - (isLiked ? 1 : 0));

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
                <LikeCommentWrapper
                    liked={isLiked}
                    commentId={replyId}
                    userEmail={user.email}
                    updateIsLiked={updateIsLiked}
                    type='reply'>
                    <Button
                        variant='primary'
                        type='submit'
                        className={styles.action_button}>
                        <img 
                            src={isLiked ? thumbsUpLikedImgSrc : thumbsUpImgSrc}
                            className={isLiked ? styles.action_icon : ''}/>
                        <span className={styles.like_count}>{(likeCount + (isLiked ? 1 : 0)) || ''}</span>
                    </Button>
                </LikeCommentWrapper>
                <DislikeCommentWrapper
                    disliked={isDisliked}
                    commentId={replyId}
                    userEmail={user.email}
                    updateIsDisliked={updateIsDisliked}
                    type='reply'>
                    <Button
                        variant='primary'
                        type='submit'
                        className={styles.action_button}>
                        <img 
                            src={isDisliked ? thumbsUpDislikedImgSrc : thumbsUpImgSrc}
                            className={styles.dislike_icon}/>
                    </Button>
                </DislikeCommentWrapper>
            </div>
        </Card>
    );
}

export default PostReply;