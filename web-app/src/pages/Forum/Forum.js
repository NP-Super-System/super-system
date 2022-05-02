import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import styles from './Forum.module.css';

import ForumPost from '../../components/ForumPost/ForumPost';

const Forum = props=>{

    const [posts, setPosts] = useState([])

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
        <div className='container'>
            <header className={styles.header}>
                <input type='text' placeholder='Search filters' className={styles.filter}/>
                <Link to='/forum/create'>
                    <Button variant='primary'>Create Post</Button>
                </Link>
            </header>
            <div className={styles.post_list}>
                {
                    posts.map( (post, i) => {
                        return <ForumPost key={`${i}`} title={post.title} body={post.body} />
                    } )
                }
            </div>
        </div>
    );
}

export default Forum;