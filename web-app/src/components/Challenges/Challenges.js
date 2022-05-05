import React from 'react';

import styles from './Challenges.module.css';
import Card from "react-bootstrap/Card";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { ChallengesData } from './ChallengesData';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { Row, Col } from 'react-bootstrap';


class Challenges extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        function rating(rate) {
            const items = []

            for (var i = 0; i < rate; i++) {
                items.push(<BsStarFill />)
            }
            if (rate < 5 ) {
                var i = 5 - rate
                for (var j = 0; j < i; j++) {
                    items.push(<BsStar />)
                }
            }
            return items
        }

        return (
            <Card className={styles.wrapper}>     
                <Card.Title>Challenges</Card.Title>       
                {
                    ChallengesData.map((item, index) => 
                        // <p key={`${index}`}>
                        //     <b>{item.title}</b> 
                        //     <br /> 
                        //     {item.desc}
                        // </p>
                        <Link key={`${index}`} to={`/challenges/${item.to}`} className={styles.announcement}>
                            <Row>
                                <Col>
                                    <p>
                                        {item.challenge}
                                        <br />
                                        By: {item.by}
                                        <br />
                                        Rating: {rating(item.rating)}
                                    </p>
                                </Col>
                                <Col>
                                    <h2 className={styles.right}>
                                        {item.points} 
                                        <br />
                                        points
                                    </h2>
                                </Col>
                            </Row>

                        </Link>
                    )
                }        
            </Card>
        )
    }
}

export default Challenges;