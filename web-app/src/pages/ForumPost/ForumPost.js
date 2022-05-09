import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Image, Col, Row, Form, Button } from 'react-bootstrap';
import { IoIosSend } from 'react-icons/io';
import { getPostAge } from '../../modules/getPostAge';

import styles from './ForumPost.module.css';

import PageContainer from '../../layout/PageContainer';

const ForumPost = props => {

    const { postId } = useParams();

    const [postData, setPostData] = useState({});

    useEffect(()=>{
        // Get specific forum post from server
        fetch(`http://localhost:5000/get-forum-post/${postId}`)
            .then(
                res => res.json()
                    .then(data => {
                        setPostData(data);
                        console.log(data);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }, []);

    const imageSrc = `http://localhost:5000/get-image/${postData.imgKey || ''}`;

    return (
        <PageContainer>
            {
                postData ? 

                <div className={styles.wrapper}>
                    <div className={styles.op_content}>
                        <Image
                            src={postData.userPicture}
                            className={styles.op_picture}
                            referrerpolicy="no-referrer"
                            />
                        <span className={styles.op_name}>{postData.userName}</span>
                        <span className={styles.post_age}>{getPostAge(postData.createdAt)}</span>
                    </div>
                    <Card.Title className={styles.title}>{postData.title}</Card.Title>
                    <div className={styles.body}>{postData.body}</div>
                    <Image 
                        src={imageSrc} 
                        className={styles.image}
                        onClick={() => { window.open(imageSrc, 'post-image') }}
                    />
                    <form action='http://localhost:5000/add-comment' method='POST' className={styles.comment_form}>
                        <Form.Group>
                            <Form.Control 
                                name='commentText'
                                as='textarea'
                                rows={2}
                                placeholder='Comment' 
                                className={styles.comment_form_text}/>
                        </Form.Group>
                        <input type='hidden' name='postId' value={postId} />
                        <input type='hidden' name='userName' value={props.user.name} />
                        <input type='hidden' name='userPicture' value={props.user.picture} />
                        <Button 
                            variant='primary' 
                            type='submit'
                            className={styles.comment_form_submit}>
                            <IoIosSend style={{marginRight: '0.5em'}}/>
                            Comment
                        </Button>
                    </form>
                    <div className={styles.comments}>
                        {
                            postData.comments ?

                            <>
                                {
                                    postData.comments.length > 0 ?

                                    postData.comments.map( (item, i) => 
                                        <Card key={`${i}`} className={styles.comment}>
                                            <div className={styles.comment_user_content}>
                                                <Image 
                                                    src={item.userPicture}
                                                    className={styles.comment_user_picture}
                                                    referrerpolicy="no-referrer"/>
                                                <span className={styles.comment_user_name}>{item.userName}</span>
                                                <span className={styles.comment_age}>{getPostAge(item.createdAt)}</span>
                                            </div>
                                            <span>{item.text}</span>
                                        </Card>
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

export default ForumPost;