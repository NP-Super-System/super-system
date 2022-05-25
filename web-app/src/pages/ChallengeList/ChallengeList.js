import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { BsStarFill, BsStar } from 'react-icons/bs';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useScreenType } from '../../modules/useScreenType';
import { IoAddSharp } from 'react-icons/io5';

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ChallengeList.module.css';

import PageContainer from '../../layout/PageContainer';
import { ChallengeListData } from './ChallengeListData';

const ChallengeList = props => {

    const screenType = useScreenType();

    const rating = rate => {
        const items = []

        for (var i = 0; i < rate; i++) {
            items.push(<BsStarFill key={`${i}`} />)
        }
        
        for (var j = i; j < 5-rate + i; j++) {
            items.push(<BsStar key={`${j}`} />)
        }

        return items;
    }

    useEffect(() => {

    }, []);

    return (
        <PageContainer>
			<header className={`${styles.header} ${screenType != 'show-sidebar' && styles.header_add_top}`}>
                <input type='text' placeholder='Search filters' className={styles.filter}/>
                <Link to='/challenges/create'>
                    <Button 
                        variant='primary'
                        className={styles.create_button}>
                        <IoAddSharp className={styles.create_icon}/>
                    </Button>
                </Link>
            </header>       
            <div className={styles.wrapper}>
                {
                    ChallengeListData.map( (item, i) => 
                        (
                            <Link key={`${i}`} to={`/challenges/${item.to}`} className={styles.challenge}>
                                <Row>
                                    <Col className={styles.challenge_details}>
                                        <h5>{item.challenge}</h5>
                                        <span>By: {item.by}</span>
                                        <span>Question Type: {item.type}</span>
                                        <span>Rating: {rating(item.rating)}</span>
                                    </Col>
                                    <Col>
                                        <div className={styles.challenge_points}>
                                            <h1>{item.points}</h1>
                                            <span>points</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Link>
                        )
                    )
                }
            </div>
        </PageContainer>
    );
}

export default ChallengeList;