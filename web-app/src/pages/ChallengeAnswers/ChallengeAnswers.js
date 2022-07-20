import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Image } from 'react-bootstrap';

import styles from './ChallengeAnswers.module.css';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

import PageContainer from '../../layout/PageContainer';
import { BsCheckLg, BsXLg } from 'react-icons/bs';

const ChallengeAnswers = props => {

    const { challengeId } = useParams();
    const [questions, setQuestions] = useState([]);
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
                        setQuestions(data.questions);
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
                <span className={styles.test_title}>{title}</span>
                <span className={styles.answers_text}>Answers</span>
                {
                    questions.map((question, qindex) => {
                        const { imgKey, type, text, points, options } = question;
                        return (
                            <div key={`${qindex}`} className={styles.question}>
                                <div className={styles.header}>
                                    <span className={styles.title}>Question {qindex + 1}</span>
                                    <span className={styles.points}>Points: {points}</span>
                                </div>
                                <Form.Control className={styles.text} value={text} disabled />
                            {
                                type === 'image-upload' ?
                                <>
                                    <span>Submissions</span>
                                    <div className={styles.img_submissions}>
                                    {
                                        question.submissions.map((imgKey, i) => {
                                            return <Image
                                                key={`${i}`}
                                                src={`http://localhost:5000/s3/image/?key=${imgKey}`}
                                                className={styles.img}/>
                                        })
                                    }
                                    </div>
                                </>

                                :
                                <>
                                    <span>Options</span>
                                {
                                    options.map((option, oindex) =>{
                                        const { isCorrect, text } = option; 
                                        return (
                                            <div key={`${oindex}`} className={styles.option}>
                                                {
                                                    isCorrect ?
                                                    <BsCheckLg className={styles.correct} />
                                                        
                                                    :
                                                    <BsXLg className={styles.wrong} />
                                                }
                                                <Form.Control
                                                    value={text} disabled />
                                            </div>
                                        );
                                    })
                                }
                                </>
                            }
                            </div>
                        );
                    })
                }
            </form>
        </PageContainer>
    );
}

export default ChallengeAnswers;