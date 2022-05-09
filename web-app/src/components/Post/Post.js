import React from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsChatLeft, BsArrow90DegRight, BsLayers } from 'react-icons/bs';
import { getPostAge } from '../../modules/getPostAge';

import styles from './Post.module.css';

class Post extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
    componentDidMount(){
        console.log(this.props.imgKey);
    }
    render(){
        return (
            <Card className={styles.wrapper}>

                <div className={styles.user_content}>
                    <Image 
                        src={this.props.userPicture} 
                        className={styles.user_picture}
                        referrerpolicy="no-referrer"/>
                    <span className={styles.user_name}>{this.props.userName}</span>
                    <span className={styles.post_age}>{getPostAge(this.props.createdAt)}</span>
                </div>

                <div className={styles.text_content}>
                    <h5 className={styles.title}>{this.props.title}</h5>
                    <div className={styles.body}>{this.props.body}</div>
                </div>

                {this.props.imgKey && <Image src={`http://localhost:5000/get-image/${this.props.imgKey}`} className={styles.image}/>}
                
                <div className={styles.actions}>
                    <Link to={`/forum/post/${this.props.postId}`}>
                        <Button variant='primary' className={styles.action_button}>
                            <BsChatLeft className={styles.action_icon}/>
                            Comments
                        </Button>
                    </Link>
                    <Button variant='primary' className={styles.action_button}>
                        <BsArrow90DegRight className={styles.action_icon}/>
                        Share
                    </Button>
                    <Button variant='primary' className={styles.action_button}>
                        <BsLayers className={styles.action_icon}/>
                        Save
                    </Button>
                </div>

            </Card>
        )
    }
}

export default Post;