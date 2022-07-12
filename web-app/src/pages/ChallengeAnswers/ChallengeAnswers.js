import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

import styles from './ChallengeAnswers.module.css';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

import PageContainer from '../../layout/PageContainer';
import { BsCheckLg, BsXLg } from 'react-icons/bs';

const ChallengeAnswers = props => {

    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState([]);
    const [title, setTitle] = useState([]);
    const navigate = useNavigate();
    const goBack = () => navigate(-1);


    useEffect(() => {
        getChallenge();
    }, []);

    const getChallenge = () => {
        // Get all challenges from server
        fetch(`http://localhost:5000/challenge/read/${challengeId}`)
            .then(
                res => res.json()
                    .then(data => {
                        // Set challenges
                        console.log(data);
                        setTitle(data.title);
                        setChallenge(data.questions);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    return (
        <PageContainer>
            <form className={styles.form}>
                <Button
                    variant='outline-primary'
                    className={styles.backBtn}
                    onClick={() => goBack()}>
                    <BsFillArrowLeftCircleFill />
                </Button>
                <b>
                    {title} Answers
                </b>

                {
                    challenge.map((challenge, qindex) =>
                    (
                        <div key={`${qindex}`}>
                            Question {qindex + 1}
                            <Form.Control
                                value={challenge.text} disabled />
                            Options
                            {
                                challenge.options.map((option, oindex) =>
                                (
                                    <div className={styles.option}>
                                        {
                                            option.isCorrect ?
                                                <BsCheckLg className={styles.correct} />
                                                :
                                                <BsXLg className={styles.wrong} />
                                        }
                                        <Form.Control
                                            value={option.text} disabled />
                                    </div>
                                )
                                )
                            }
                        </div>
                    ))
                }
            </form>
        </PageContainer>
    );
}

export default ChallengeAnswers;