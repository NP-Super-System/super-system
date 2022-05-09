import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button, Col } from 'react-bootstrap';
import { useScreenType } from '../../modules/useScreenType';

import styles from './Forum.module.css';

import PageContainer from '../../layout/PageContainer';
import Post from '../../components/Post/Post';
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
            <header className={`${styles.header} ${screenType !== 'show-sidebar' && styles.header_add_top}`}>
                <input type='text' placeholder='Search filters' className={styles.filter}/>
                <Link to='/forum/create'>
                    <Button variant='primary'>Create Post</Button>
                </Link>
            </header>
            <div className={styles.wrapper}>
                <Col className={screenType === 'phone' || styles.post_list}>
                    {
                        posts.map( (post, i) => 
                            <Post key={`${i}`}
                                postId={post._id.toString()}
                                {...post}
                            />
                        )
                    }
                </Col>
                {
                    screenType === 'phone' ||

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