import React from 'react';
import { Row } from 'react-bootstrap';
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
                <h2>{this.props.title}</h2>
                <p>{this.props.body}</p>
            </Row>
        )
    }
}

export default ForumPost;