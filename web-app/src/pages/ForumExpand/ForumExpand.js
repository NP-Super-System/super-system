import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Image, Form, Button } from 'react-bootstrap';
import { BsShare, BsLayers, BsFillTrash2Fill } from 'react-icons/bs';
import { IoIosSend } from 'react-icons/io';
import { getPostAge } from '../../hooks/getPostAge';
import parse from 'html-react-parser';
import toast from 'react-hot-toast';

import styles from './ForumExpand.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import File from './File';
import LikePostWrapper from '../../components/LikePostWrapper/LikePostWrapper';
import DislikePostWrapper from '../../components/DislikePostWrapper/DislikePostWrapper';
import Comment from './Comment';

const ForumExpand = props => {

    const { user } = useContext(GlobalContext);
    const { postId } = useParams();

    const [postData, setPostData] = useState({});
    const [imageSrc, setImageSrc] = useState('');

    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

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

    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    const [showCommentSubmit, setShowCommentSubmit] = useState(false);

    useEffect(()=>{
        // Get specific forum post from server
        fetch(`http://localhost:5000/get-forum-post/${postId}`)
            .then(
                res => res.json()
                    .then(data => {
                        setPostData(data);
                        console.log(data);
                        setImageSrc(data.imgKey.length > 0 ? `http://localhost:5000/s3/image/?key=${data.imgKey}` : '');
                        const liked = data.likedUsers.includes(user.id);
                        setIsLiked(liked);
                        setIsDisliked(data.dislikedUsers.includes(user.id));
                        setLikeCount(
                            data.likedUsers.length - (liked ? 1 : 0),
                        );
                        setCommentCount(
                            data.comments.length
                            + 
                            data.comments
                                .map(comment => comment.replies)
                                .reduce(
                                    (prevVal, replies) => prevVal + replies.length,
                                    0
                                )
                        );
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }, []);

    return (
        <PageContainer>
            {
                postData ? 

                <div className={styles.wrapper}>
                    <div className={styles.op_content}>
                        <Image
                            src={postData?.user?.userPicture}
                            className={styles.op_picture}
                            referrerPolicy="no-referrer"
                            />
                        <span className={styles.op_name}>{postData?.user?.userName}</span>
                        <span className={styles.post_age}>{getPostAge(postData.createdAt)}</span>
                    </div>

                    <div className={styles.tags}>
                    {
                        postData?.tags &&
                        postData?.tags.map( (tag, i) =>
                            tag && <div key={`${i}`} className={styles.tag}>
                                <span>{tag}</span>
                            </div>
                        )
                    }
                    </div>

                    <Card.Title className={styles.title}>{postData?.title}</Card.Title>
                    <div className={styles.body}>{postData?.body && parse(postData.body)}</div>
                    {   
                        imageSrc &&
                        <Image 
                            src={imageSrc} 
                            className={styles.image}
                            onClick={() => { window.open(imageSrc, 'post-image') }}
                            />
                    }
                    <div className={styles.files}>
                    {
                        postData?.files &&
                        postData.files.map( (file, i) => {
                            const { name, key } = file;
                            const list = name.split('.');
                            const fileExt = list[list.length - 1];

                            return <File key={`${i}`} fileName={name} fileKey={key} fileExt={fileExt}/>
                        })
                    }
                    </div>

                    <div className={styles.actions}>
                        <LikePostWrapper
                            liked={isLiked}
                            postId={postId}
                            userId={user.id}
                            updateIsLiked={updateIsLiked}>
                            <Button
                                variant='primary'
                                type='submit'
                                className={styles.action_button}>
                                <img 
                                    src={isLiked ? thumbsUpLikedImgSrc : thumbsUpImgSrc}
                                    className={styles.action_icon}/>
                                <span className={styles.like_count}>{(likeCount + (isLiked ? 1 : 0)) || 'Like'}</span>
                            </Button>
                        </LikePostWrapper>
                        <DislikePostWrapper
                            liked={isLiked}
                            postId={postId}
                            userId={user.id}
                            updateIsDisliked={updateIsDisliked}>
                            <Button
                                variant='primary'
                                type='submit'
                                className={styles.action_button}>
                                <img 
                                    src={isDisliked ? thumbsUpDislikedImgSrc : thumbsUpImgSrc}
                                    className={styles.dislike_icon}/>
                            </Button>
                        </DislikePostWrapper>
                        <Button 
                            variant='primary' 
                            className={styles.action_button}
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.href}/${postId}`)
                                toast.success(`Copied post URL to clipboard`);
                            }}>
                            <BsShare className={styles.action_icon}/>
                            <span>Share</span>
                        </Button>
                        <Button variant='primary' className={styles.action_button}>
                            <BsLayers className={styles.action_icon}/>
                            <span>Save</span>
                        </Button> 
                        <form
                            action='http://localhost:5000/forum-post/delete/'
                            method='POST'>
                            <input type='hidden' name='postId' value={postId} />
                            <Button 
                                variant='primary' 
                                type='submit'
                                className={styles.action_button}>
                                <BsFillTrash2Fill className={styles.action_icon}/>
                                <span>Delete</span>
                            </Button>
                        </form>
                    </div>
                    <form action='http://localhost:5000/add-comment' method='POST' className={styles.comment_form}>
                        <Form.Group>
                            <Form.Control 
                                name='commentText'
                                as='textarea'
                                rows={2}
                                placeholder='Comment'
                                autoFocus
                                required
                                onChange={e => setShowCommentSubmit(e.target.value != '')}
                                className={styles.comment_form_text}/>
                        </Form.Group>
                        <input type='hidden' name='postId' value={postId} />
                        <input type='hidden' name='userId' value={user.id} />
                    {
                        showCommentSubmit &&

                        <Button 
                            variant='primary' 
                            type='submit'
                            className={styles.comment_form_submit}>
                            <IoIosSend style={{marginRight: '0.5em'}}/>
                            <span>Comment</span>
                        </Button>
                    }
                    </form>
                    <span className={styles.comment_count}>{commentCount} comments</span>
                    <div className={styles.comments}>
                    {
                        postData.comments ?

                        <>
                            {
                                postData.comments.length > 0 ?

                                postData.comments.map( (item, i) => 
                                    <Comment 
                                        key={`${i}`}
                                        postId={postId}
                                        {...item}/>
                                )

                                :

                                <div className={styles.no_comments}>Be the first person to comment on this post!</div>
                            }
                        </>

                        :

                        <div>Loading comments...</div>
                    }
                    </div>
                </div>

                :

                <h2>Loading post...</h2>
            }
        </PageContainer>
    );
}

export default ForumExpand;