import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import { Button, Col } from 'react-bootstrap';
import { useScreenType } from '../../modules/useScreenType';
import { IoAddSharp } from 'react-icons/io5';

import styles from './Forum.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import Post from '../../components/Post/Post';
import { Card } from 'react-bootstrap';

const Forum = props=>{

    const { user } = useContext(GlobalContext);
    const screenType = useScreenType();

    const [posts, setPosts] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');

    const handleSearch = e => {
        e.preventDefault();

        if(!searchFilter){
            setVisiblePosts(posts);
            return;
        }

        const filteredPosts = posts.filter(post => {
            const matchedTags = post.tags.filter(tag => {
                return tag.toLowerCase().startsWith(searchFilter.toLowerCase());
            });
            return matchedTags.length > 0;
        })
        console.log(filteredPosts);
        setVisiblePosts(filteredPosts);
    }

    useEffect(()=>{
        // Get all forum posts from server
        fetch('http://localhost:5000/get-all-forum-posts')
            .then(
                res => res.json()
                    .then(data => {
                        // Set posts
                        setPosts(data);
                        setVisiblePosts(data);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }, []);

    return (
        <PageContainer>
            <header className={`${styles.header} ${screenType !== 'show-sidebar' && styles.header_add_top}`}>
                <form className={styles.filter} onSubmit={handleSearch}>
                    <input 
                        type='text' 
                        value={searchFilter}
                        onChange={e => setSearchFilter(e.target.value)}
                        placeholder='Search filters' 
                        className={styles.input}/>
                    <Button
                        variant='primary'
                        type='submit'
                        className={styles.button}
                        >
                        <span>Search</span>
                    </Button>
                </form>
                <Link to='/forum/create'>
                    <Button 
                        variant='primary'
                        className={styles.create_button}>
                        <IoAddSharp className={styles.icon}/>
                    </Button>
                </Link>
            </header>
            <div className={styles.wrapper}>
                <Col className={screenType === 'phone' || styles.post_list}>
                {
                    visiblePosts.map( (post, i) => 
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