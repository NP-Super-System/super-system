import React, { useState, useEffect, useContext } from 'react';
import { getPostAge } from '../../modules/getPostAge';
import { Card, Image, Button, Form } from 'react-bootstrap';
import { BsReply } from 'react-icons/bs';

import styles from './PostComment.module.css';

import GlobalContext from '../../context/GlobalContext';
import PostReply from '../PostReply/PostReply';
import LikeCommentWrapper from '../LikeCommentWrapper/LikeCommentWrapper';
import DislikeCommentWrapper from '../DislikeCommentWrapper/DislikeCommentWrapper';

const PostComment = props => {
    
    const { user } = useContext(GlobalContext);
    const { postId, _id: commentId, user: commentUser, text, likedUsers, dislikedUsers, replies, createdAt } = props;

    const [openReply, setOpenReply] = useState(false);

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
        console.log(props);
    }, []);

    return (
        <Card className={styles.comment}>
            <div className={styles.comment_user_content}>
                <Image 
                    src={commentUser.userPicture}
                    className={styles.comment_user_picture}
                    referrerPolicy="no-referrer"/>
                <span className={styles.comment_user_name}>{commentUser.userName}</span>
                <span className={styles.comment_age}>{getPostAge(createdAt)}</span>
            </div>
            <span className={styles.comment_text}>{text}</span>
            <div className={styles.comment_actions}>
                <LikeCommentWrapper
                    liked={isLiked}
                    commentId={commentId}
                    userEmail={user.email}
                    updateIsLiked={updateIsLiked}
                    type='comment'>
                    <Button
                        variant='primary'
                        type='submit'
                        className={styles.comment_action_button}>
                        <img 
                            src={isLiked ? thumbsUpLikedImgSrc : thumbsUpImgSrc}
                            className={styles.comment_action_icon}/>
                        <span className={styles.like_count}>{(likeCount + (isLiked ? 1 : 0)) || 'Like'}</span>
                    </Button>
                </LikeCommentWrapper>
                <DislikeCommentWrapper
                    disliked={isDisliked}
                    commentId={commentId}
                    userEmail={user.email}
                    updateIsDisliked={updateIsDisliked}
                    type='comment'>
                    <Button
                        variant='primary'
                        type='submit'
                        className={styles.comment_action_button}>
                        <img 
                            src={isDisliked ? thumbsUpDislikedImgSrc : thumbsUpImgSrc}
                            className={styles.dislike_icon}/>
                    </Button>
                </DislikeCommentWrapper>
                <Button
                    variant='primary'
                    className={styles.comment_action_button}
                    onClick={e => {
                        setOpenReply(!openReply);
                    }}>

                    <BsReply className={styles.comment_action_icon}/>
                    <span>Reply</span>

                </Button>
            </div>
            {
                openReply ?

                <form action='http://localhost:5000/add-reply' method='POST' className={styles.reply_form}>

                    <input type='hidden' name='postId' value={postId} />
                    <input type='hidden' name='commentId' value={commentId} />
                    <input type='hidden' name='userId' value={user.id} />

                    <Form.Group className={styles.reply_form_text}>
                        <Form.Control 
                            name='replyText' 
                            as='textarea' 
                            placeholder='Reply' 
                            rows={2}
                            autoFocus
                            required/>
                    </Form.Group>

                    <Button
                        variant='primary'
                        type='submit'
                        className={styles.reply_form_submit}
                        >
                        <BsReply className={styles.reply_form_submit_icon}/>
                        <span>Reply</span>
                    </Button>

                </form>

                :

                null
            }
            <div className={styles.replies}>
                {
                    replies.map( (item, i) => 
                        <PostReply 
                            key={`${i}`}
                            postId={postId}
                            {...item}/>
                    )
                }
            </div>
        </Card>
    );
}

export default PostComment;