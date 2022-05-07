import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import styles from './ForumPost.module.css';

class ForumPost extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
    render(){
        return (
            <Card className={styles.wrapper}>
                <div className={styles.text_content}>
                    <h5 className={styles.title}>{this.props.title}</h5>
                    <div className={styles.body}>{this.props.body}</div>
                </div>
                {this.props.imgKey && <Image src={`http://localhost:5000/get-image/${this.props.imgKey}`} className={styles.image}/>}
            </Card>
        )
    }
}

export default ForumPost;