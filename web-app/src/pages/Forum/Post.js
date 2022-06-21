import React from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsChatLeft, BsArrow90DegRight, BsLayers } from 'react-icons/bs';
import { getPostAge } from '../../hooks/getPostAge';
import parse from 'html-react-parser';

import styles from './Post.module.css';

import GlobalContext from '../../context/GlobalContext';
import LikePostWrapper from '../../components/LikePostWrapper/LikePostWrapper';
import DislikePostWrapper from '../../components/DislikePostWrapper/DislikePostWrapper';

class Post extends React.Component{
    constructor(props, context){
        super(props, context);

        this.user = this.context.user;

        this.state = {
            isLiked: this.props.likedUsers.includes(this.user.id),
            isDisliked: this.props.dislikedUsers.includes(this.user.id),
        }

        this.thumbsUpImgSrc = 'https://img.icons8.com/material-rounded/24/777777/thumb-up.png';
        this.thumbsUpLikedImgSrc = 'https://img.icons8.com/material-rounded/24/0b5ed7/thumb-up.png';
        this.thumbsUpDislikedImgSrc = 'https://img.icons8.com/material-rounded/24/cc3a3a/thumb-up.png';

        this.likeCount = this.props.likedUsers.length - (this.state.isLiked ? 1 : 0);
        this.commentCount = 
            this.props.comments.length
            + 
            this.props.comments
                .map(comment => comment.replies)
                .reduce(
                    (prevVal, replies) => prevVal + replies.length,
                    0
                );

        this.updateIsLiked = this.updateIsLiked.bind(this);
        this.updateIsDisliked = this.updateIsDisliked.bind(this);
    }
    componentDidMount(){
        
    }
    updateIsLiked(isLiked){
        this.setState({ isLiked, isDisliked: false });
    }
    updateIsDisliked(isDisliked){
        this.setState({ isDisliked, isLiked: false });
    }
    render(){
        return (
            <Card className={styles.wrapper}>

                <div className={styles.header}>
                    <Link 
                        to={`/profile/${this.props.user._id}`}
                        style={{
                            textDecoration: 'none',
                            color: 'black',
                        }}>
                        <div className={styles.user_content}>
                            <Image
                                src={this.props.user.userPicture}
                                className={styles.user_picture}
                                referrerPolicy="no-referrer"/>
                            <span className={styles.user_name}>{this.props.user.userName}</span>
                        </div>
                    </Link>
                    <span className={styles.post_age}>{getPostAge(this.props.createdAt)}</span>
                </div>

                <div className={styles.tags}>
                    {
                        this.props.tags.map( (tag, i) =>
                            <div key={`${i}`} className={styles.tag}>
                                <span>{tag}</span>
                            </div>
                        )
                    }
                </div>


                <div className={styles.text_content}>
                    <h5 className={styles.title}>{this.props.title}</h5>
                    <div className={styles.body}>{parse(this.props.body)}</div>
                </div>
                <Link 
                    to={`/forum/${this.props.postId}`} 
                    style={{textDecoration: 'none', color: 'black'}}>
                    {this.props.imgKey && <Image src={`http://localhost:5000/s3/image/?key=${this.props.imgKey}`} className={styles.image} loading='lazy'/>}
                </Link>

                <div className={styles.actions}>
                    <LikePostWrapper
                        liked={this.state.isLiked}
                        postId={this.props.postId}
                        userId={this.user.id}
                        updateIsLiked={this.updateIsLiked}>
                        <Button
                            variant='primary'
                            type='submit'
                            className={
                                `${styles.action_button} ${styles.like_button}`
                            }
                            >
                            <img 
                                src={this.state.isLiked ? this.thumbsUpLikedImgSrc : this.thumbsUpImgSrc}
                                className={styles.action_icon}/>
                            <span className={styles.like_count}>{(this.likeCount + (this.state.isLiked ? 1 : 0)) || 'Like'}</span>
                        </Button>
                    </LikePostWrapper>
                    <DislikePostWrapper
                        disliked={this.state.isDisliked}
                        postId={this.props.postId}
                        userId={this.user.id}
                        updateIsDisliked={this.updateIsDisliked}>
                        <Button 
                            variant='primary'
                            type='submit'
                            className={
                                `${styles.action_button} ${styles.dislike_button}`
                            }>
                            <img 
                                src={this.state.isDisliked ? this.thumbsUpDislikedImgSrc : this.thumbsUpImgSrc}
                                className={styles.dislike_icon}/>
                        </Button>
                    </DislikePostWrapper>
                    <Link to={`/forum/${this.props.postId}`} className={styles.action_link}>
                        <Button variant='primary' className={styles.action_button}>
                            <BsChatLeft className={styles.action_icon}/>
                            <span>Comments ({this.commentCount})</span>
                        </Button>
                    </Link>
                    <Button variant='primary' className={styles.action_button}>
                        <BsArrow90DegRight className={styles.action_icon}/>
                        <span>Share</span>
                    </Button>
                    <Button variant='primary' className={styles.action_button}>
                        <BsLayers className={styles.action_icon}/>
                        <span>Save</span>
                    </Button>
                </div>

            </Card>
        )
    }
}
Post.contextType = GlobalContext;

export default Post;