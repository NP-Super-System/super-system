import React from 'react';

import styles from './Challenges.module.css';
import Card from "react-bootstrap/Card";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { ChallengesData } from './ChallengesData';


class Challenges extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
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
                            <p>
                                {item.challenge}
                                <br />
                                By: {item.by}
                            </p>
                        </Link>
                    )
                }        
            </Card>
        )
    }
}

export default Challenges;