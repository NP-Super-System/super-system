import React from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsChatLeft, BsArrow90DegRight, BsLayers } from 'react-icons/bs';
import { getPostAge } from '../../modules/getPostAge';

import styles from './Post.module.css';

import LikePostWrapper from '../LikePostWrapper/LikePostWrapper';
import DislikePostWrapper from '../DislikePostWrapper/DislikePostWrapper';

class Post extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isLiked: this.props.likedUsers.includes(this.props.user.email),
            isDisliked: this.props.dislikedUsers.includes(this.props.user.email),
        }

        this.thumbsUpImgSrc = 'https://img.icons8.com/material-rounded/24/777777/thumb-up.png';
        this.likeCount = this.props.likedUsers.length - (this.state.isLiked ? 1 : 0);
        this.commentCount = this.props.comments.length;

        this.updateIsLiked = this.updateIsLiked.bind(this);
        this.updateIsDisliked = this.updateIsDisliked.bind(this);
    }
    componentDidMount(){
        console.log(this.props.imgKey);
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

                <div className={styles.user_content}>
                    <Image
                        src={this.props.userPicture}
                        className={styles.user_picture}
                        referrerPolicy="no-referrer"/>
                    <span className={styles.user_name}>{this.props.userName}</span>
                    <span className={styles.post_age}>{getPostAge(this.props.createdAt)}</span>
                </div>

                <div className={styles.text_content}>
                    <h5 className={styles.title}>{this.props.title}</h5>
                    <div className={styles.body}>{this.props.body}</div>
                </div>

                {this.props.imgKey && <Image src={`http://localhost:5000/get-image/${this.props.imgKey}`} className={styles.image}/>}
                
                <div className={styles.actions}>
                    <LikePostWrapper
                        liked={this.state.isLiked}
                        postId={this.props.postId}
                        userEmail={this.props.user.email}
                        updateIsLiked={this.updateIsLiked}>
                        <Button
                            variant='primary'
                            type='submit'
                            className={
                                `${styles.action_button} ${styles.like_button} ${this.state.isLiked && styles.like_button_liked}
                            `}
                            >
                            <img 
                                src={this.thumbsUpImgSrc}
                                className={styles.action_icon}/>
                            <span>{(this.likeCount + (this.state.isLiked ? 1 : 0)) || 'Like'}</span>
                        </Button>
                    </LikePostWrapper>
                    <DislikePostWrapper
                        disliked={this.state.isDisliked}
                        postId={this.props.postId}
                        userEmail={this.props.user.email}
                        updateIsDisliked={this.updateIsDisliked}>
                        <Button 
                            variant='primary'
                            type='submit'
                            className={
                                `${styles.action_button} ${styles.dislike_button} ${this.state.isDisliked && styles.dislike_button_disliked}`
                            }>
                            <img 
                                src={this.thumbsUpImgSrc}
                                className={styles.dislike_icon}/>
                        </Button>
                    </DislikePostWrapper>
                    <Link to={`/forum/post/${this.props.postId}`} className={styles.action_link}>
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

export default Post;