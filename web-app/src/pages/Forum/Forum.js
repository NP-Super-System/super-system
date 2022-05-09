import React, {useState, useEffect} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { useScreenType } from '../../layout/useScreenType';

import styles from './Forum.module.css';

import PageContainer from '../../layout/PageContainer';
import ForumPost from '../../components/ForumPost/ForumPost';
import { Card } from 'react-bootstrap';

const Forum = props=>{

    const screenType = useScreenType();
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        // Get all forum posts from server
        fetch('http://localhost:5000/get-all-forum-posts')
            .then(
                res => res.json()
                    .then(data => {
                        // Set posts
                        setPosts(data);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }, []);

    return (
        <PageContainer>
            <header className={`${styles.header} ${screenType != 'show-sidebar' && styles.header_add_top}`}>
                <input type='text' placeholder='Search filters' className={styles.filter}/>
                <Link to='/forum/create'>
                    <Button variant='primary'>Create Post</Button>
                </Link>
            </header>
            <div className={styles.wrapper}>
                <Col className={styles.post_list}>
                    {
                        posts.map( (post, i) => {
                            return <ForumPost key={`${i}`} title={post.title} body={post.body} imgKey={post.imgKey}/>
                        } )
                    }
                </Col>
                {
                    screenType == 'phone' ||

                    <Col className={styles.friends_list}>
                        <Card>
                            <Card.Title>Friends List</Card.Title>
                        </Card>
                    </Col>
                }
            </div>
        </PageContainer>
    );
}

export default Forum;