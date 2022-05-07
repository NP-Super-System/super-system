import React from 'react';
import { Row, Card } from 'react-bootstrap';
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
            <Row>
                <Card className={styles.wrapper}>
                    <h5 className={styles.title}>{this.props.title}</h5>
                    <div className={styles.body}>{this.props.body}</div>
                    {this.props.imgKey && <img src={`http://localhost:5000/get-image/${this.props.imgKey}`} />}
                </Card>
            </Row>
        )
    }
}

export default ForumPost;