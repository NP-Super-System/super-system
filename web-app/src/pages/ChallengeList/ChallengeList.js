import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { BsStarFill, BsStar } from 'react-icons/bs';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import { useScreenType } from '../../hooks/useScreenType';
import { BsFillTrash2Fill, BsPencilFill, BsFillFileEarmarkFontFill, BsPlus } from 'react-icons/bs';
import Swal from 'sweetalert2'

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ChallengeList.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';

const ChallengeList = props => {

    const screenType = useScreenType();
    const { user } = useContext(GlobalContext);

    const [searchFilter, setSearchFilter] = useState('');
    const handleSearch = e => {
        e.preventDefault();
    }

    const [userRoles, setUserRoles] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [usersCompleted, setUsersCompleted] = useState([]);

    const getRating = (rate, ratings) => {
        if (rate === 0) {
            return 0;
        }
        else {
            return Math.floor(rate / ratings);
        }
    }

    const rating = (rate, ratings) => {
        var rating = getRating(rate, ratings);
        if (ratings === 0 || rate === 0) {
            rating = 0;
        }

        const items = [];

        for (var i = 0; i < rating; i++) {
            items.push(<BsStarFill key={`${i}`} color='#a89532'/>);
        }

        for (var j = i; j < 5 - rating + i; j++) {
            items.push(<BsStar key={`${j}`} color='#a89532'/>);
        }

        return items;
    }

    useEffect(() => {
        getUser();
        getChallenges();
    }, []);

    const getChallenges = () => {
        // Get all challenges from server
        fetch('http://localhost:5000/challenge/read')
            .then(
                res => res.json()
                    .then(data => {
                        // Set challenges
                        setChallenges(data);
                        setUsersCompleted(data.usersCompleted);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    const deleteBtn = (userId, itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your challenge has been deleted.',
                    'success'
                )
                deleteChallenge(userId, itemId);

            }
        })
    }

    const deleteChallenge = (userId, itemId) => {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ userId, itemId }),
        }

        console.log(`Deleting challenge...`);

        const deleteItemUrl = 'http://localhost:5000/challenge/delete';

        fetch(deleteItemUrl, options)
            .then(res => {
                console.log('Delete challenge');
                getChallenges();
            })
            .catch(err => console.log(err));
    }

    const getUser = async userEmail => {
        const getUserUrl = `http://localhost:5000/get-user/${user.email}`;

        const res = await fetch(getUserUrl);
        const userData = await res.json();
        setUserRoles(userData.userRoles);
    }

    const isOwner = (index) => {
        if (user.id === challenges[index].user._id || userRoles.includes('Admin')) {
            return true;
        }
        return false;
    }

    const isCompleted = (index) => {
        console.log(challenges[index].usersCompleted)
        if (challenges[index].usersCompleted.includes(user.id)) {
            return true;
        }
        return false;
    }

    return (
        <PageContainer>
            <PageHeader
                searchBarElement={
                    <SearchBar text={searchFilter} handleChange={text => setSearchFilter(text)} handleSearch={handleSearch}/>
                }
                screenType={screenType}>
                <Link to='/challenges/create'>
                    <Button
                        variant='primary'
                        className={`${styles.action_btn} ${styles.create_link}`}>
                        <BsPlus className={styles.icon} /> Challenge
                    </Button>
                </Link>
            </PageHeader>
            <div className={styles.wrapper}>
                {
                    challenges.sort((a, b) => getRating(a.rating, a.numberOfRatings) > getRating(b.rating, b.numberOfRatings) ? -1 : 1).map((item, i) =>
                    (
                        <div key={`${i}`} className={styles.challenge}>
                            <div className={styles.challenge_info}>
                                <Row>
                                    <Col className={styles.challenge_details}>
                                        <h5>{item.title}</h5>
                                    {
                                        item.updated &&
                                        <span style={{fontStyle: 'italic'}}>Updated</span>
                                    }
                                        <div className={styles.poster}>
                                            <span className={styles.by_text}>Published By:</span>
                                        {
                                            item.user ?
                                            <>
                                                <Image 
                                                    src={item.user.userPicture}
                                                    className={styles.user_img}/>
                                                <span className={styles.user_name}>{item.user.userName}</span>
                                            </>

                                            :
                                            <span>[deleted]</span>
                                        }
                                        </div>
                                        <span 
                                            style={{
                                                display: 'flex', 
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                            }}>
                                            <span style={{
                                                display: 'flex', 
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                marginRight: '0.5em',
                                            }}>{rating(item.rating, item.numberOfRatings)}</span>
                                            <span style={{
                                                display: 'flex', 
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                            }}>({item.numberOfRatings})</span>
                                        </span>
                                    </Col>
                                    <Col>
                                        <div className={styles.challenge_points}>
                                            <h1>{item.pointCount}</h1>
                                            <span>points</span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.buttons}>
                                <Link to={`/challenges/${item._id}`} className={styles.attempt_link}>
                                    <Button
                                        variant='success'
                                        className={styles.button}>
                                        Attempt
                                    </Button>
                                </Link>
                                {
                                    isCompleted(i) ?
                                        <Link to={`/challenges/answers/${item._id}`} className={styles.answer_link}>
                                            <Button
                                                variant='primary'
                                                className={styles.button}>
                                                <BsFillFileEarmarkFontFill
                                                    className={styles.icon} /> View Answers
                                            </Button>
                                        </Link>
                                        :
                                        <span></span>
                                }
                                {
                                    isOwner(i) ?
                                        <>
                                            <Link to={`/challenges/update/${item._id}`} className={styles.edit_link}>
                                                <Button
                                                    variant='primary'
                                                    className={styles.button}>
                                                    <BsPencilFill
                                                        className={styles.icon} /> Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant='danger'
                                                onClick={e => deleteBtn(item.user.userId, item._id)}
                                                className={styles.delete_btn}>
                                                <BsFillTrash2Fill
                                                    className={styles.icon} /> Delete
                                            </Button>
                                        </>
                                        :
                                        <span></span>
                                }
                            </div>
                        </div>
                    )
                    )
                }
            </div>
        </PageContainer>
    );
}

export default ChallengeList;