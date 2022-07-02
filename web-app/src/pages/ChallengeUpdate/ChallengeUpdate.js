import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { IoAddSharp } from 'react-icons/io5';
import { BsFillTrash2Fill, BsFillCheckSquareFill } from 'react-icons/bs';
import toast from 'react-hot-toast';

import styles from './ChallengeUpdate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import Swal from 'sweetalert2'


const ChallengeUpdate = props => {

    const { user } = useContext(GlobalContext);

    const { challengeId } = useParams();

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const [points, setPoints] = useState(0);
    const [rating, setRating] = useState(0);
    const [numberOfRatings, setNumberOfRatings] = useState(0);
    const [title, setTitle] = useState('');
    const [questionList, setQuestionList] = useState([]);

    useEffect(() => {
        getChallenge();
    }, []);

    const backBtn = () => {
        Swal.fire({
            title: 'There might be unsaved changes',
            text: "Are you sure you want to discard the changes?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, discard changes!'
        }).then((result) => {
            if (result.isConfirmed) {
                goBack();
            }
        })
    }

    const getChallenge = () => {
        // Get all challenges from server
        fetch(`http://localhost:5000/challenge/read/${challengeId}`)
            .then(
                res => res.json()
                    .then(data => {
                        // Set challenges
                        setRating(data.rating);
                        setNumberOfRatings(data.numberOfRatings);
                        setPoints(data.pointCount);
                        setTitle(data.title);
                        setQuestionList(data.questions);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    const handleQuestionAdd = e => {
        setQuestionList([...questionList, { question: '', points: null, isMultipleAns: false, isImageUpload: false, options: [{ option: '', isCorrect: false }] }])
    }

    const handleQuestionRemove = (index) => {
        const newQuestionList = [...questionList];
        newQuestionList.splice(index, 1);
        setQuestionList(newQuestionList);
    }

    const handleQuestionTypeChange = (e, index) => {
        let newQuestionList = [...questionList];
        newQuestionList[index].isMultipleAns = e.target.value === 'M'; // 'S' == false, 'M' == true
        newQuestionList[index].isImageUpload = e.target.value === 'I';
        setQuestionList(newQuestionList);
        console.log(questionList);
    }

    const handlePointsChange = (index, newPoints) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].points = Number(newPoints);
        setQuestionList(newQuestionList);
        console.log(questionList);
        setPoints(questionList.reduce((a, v) => a = a + v.points, 0));
    }

    const handleQuestionChange = (e, index) => {
        const { value } = e.target;
        const list = [...questionList];
        list[index].text = value;
        setQuestionList(list);
    }

    const updateOption = (qindex, oindex) => {
        const newQuestionList = [...questionList];
        const option = newQuestionList[qindex].options[oindex];

        if (newQuestionList[qindex].isMultipleAns) {
            option.isCorrect = !option.isCorrect;
        }
        else {
            for (var i = 0; i < newQuestionList[qindex].options.length; i++) {
                newQuestionList[qindex].options[i].isCorrect = false;
            }
            option.isCorrect = true;
        }

        console.log(newQuestionList[qindex].options);
        setQuestionList(newQuestionList);
    }

    const handleOptionChange = (e, qindex, oindex) => {
        const { name, value } = e.target;
        const newQuestionList = [...questionList];

        newQuestionList[qindex].options[oindex].text = value;
        setQuestionList(newQuestionList);
    }

    const handleOptionAdd = (index) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].options.push({ option: '', isCorrect: false })
        setQuestionList(newQuestionList);
    }

    const handleOptionRemove = (qindex, oindex) => {
        const newQuestionList = [...questionList];

        newQuestionList[qindex].options.splice(oindex, 1);
        setQuestionList(newQuestionList);
        console.log(newQuestionList[qindex].options);
    }

    const onSubmit = async e => {
        for (var i = 0; i < questionList.length; i++) {
            var hasAnswer = false;
            for (var j = 0; j < questionList[i].options.length; j++) {
                if (questionList[i].options[j].isCorrect || questionList[i].isImageUpload) {
                    hasAnswer = true;
                }
            }
            if (hasAnswer !== true) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please select an answer for each of the questions!',
                })
                return;
            }
        }
        e.preventDefault();        
        deleteChallenge(user.id, challengeId);
        createChallenge(user.id, title, points, questionList);
    }

    const createChallenge = (userId, title, points, content) => {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ userId, title, points, rating, numberOfRatings, content }),
        }

        console.log(`Updating challenge`);

        const createChallengeUrl = 'http://localhost:5000/challenge/create';

        fetch(createChallengeUrl, options)
            .then(res => {
                console.log('Updated challenge');
                toast.success('Successfully updated challenge!');
                navigate('/challenges');
            })
            .catch(err => {
                toast.error('Error updatnig challenge');
                console.log(err);
            });
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

        // console.log(`Deleting challenge...`);

        const deleteItemUrl = 'http://localhost:5000/challenge/delete';

        fetch(deleteItemUrl, options)
            .then(res => {
                // console.log('Delete challenge');
            })
            .catch(err => console.log(err));
    }

    return (
        <PageContainer>
            <form className={styles.form}>
                <Button
                    variant='outline-primary'
                    className={styles.backBtn}
                    onClick={() => backBtn()}>
                    <BsFillArrowLeftCircleFill />
                </Button>
                <div>
                    Total Points: {points}
                </div>
                <Form.Group className={`mb-3`}>
                    <Form.Control name='title' type='input' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
                </Form.Group>
                {
                    questionList.map((question, qindex) => (
                        <div key={`${qindex}`}>
                            <span>Question {qindex + 1}:</span>
                            {
                                questionList.length - 1 === qindex &&

                                <Button
                                    variant='primary'
                                    className={styles.create_button}
                                    onClick={handleQuestionAdd}>
                                    <IoAddSharp className={styles.icon} />
                                </Button>
                            }
                            {
                                questionList.length > 1 &&

                                <Button
                                    className={styles.delete_button}
                                    onClick={() => handleQuestionRemove(qindex)}>
                                    <BsFillTrash2Fill className={styles.icon} />
                                </Button>
                            }
                            <Form.Group className={`mb-3`}>
                                <Form.Select
                                    name='questionType'
                                    onChange={e => handleQuestionTypeChange(e, qindex)}
                                    defaultValue={question.isMultipleAns ? 'M' : question.isImageUpload ? 'I' : 'S'}>
                                    <option value='S'>Single Answer Question</option>
                                    <option value='M'>Multiple Answer Question</option>
                                    <option value='I'>Image Upload</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className={`mb-3`}>
                                <Form.Control
                                    name='points'
                                    type='number'
                                    value={question.points}
                                    placeholder='Points'
                                    onChange={(e) => handlePointsChange(qindex, e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={`mb-3`}>
                                <Form.Control
                                    name='question'
                                    placeholder={`Question ${qindex + 1}`}
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(e, qindex)}
                                />
                            </Form.Group>
                            {
                                question.isImageUpload ?
                                    <span></span>
                                    :
                                    question.options.map((option, oindex) => {
                                        return <Form.Group key={`${oindex}`} className={`mb-3 ${styles.options}`}>
                                            <Form.Check
                                                type={questionList[qindex].isMultipleAns ? 'checkbox' : 'radio'}
                                                name={`Question ${qindex + 1}`}
                                                className={styles.checkbox}
                                                onChange={() => updateOption(qindex, oindex)}
                                                checked={option.isCorrect} />

                                            <Form.Control
                                                name='option'
                                                placeholder={`Option ${oindex + 1}`}
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(e, qindex, oindex)}
                                                required />
                                            {
                                                questionList[qindex].options.length - 1 === oindex &&

                                                <Button
                                                    variant='primary'
                                                    className={styles.create_button}
                                                    onClick={() => handleOptionAdd(qindex)}>
                                                    <IoAddSharp className={styles.icon} />
                                                </Button>
                                            }
                                            {
                                                questionList[qindex].options.length > 1 &&

                                                <Button
                                                    className={styles.delete_button}
                                                    onClick={() => handleOptionRemove(qindex, oindex)}>
                                                    <BsFillTrash2Fill className={styles.icon} />
                                                </Button>
                                            }
                                        </Form.Group>
                                    })
                            }
                        </div>
                    ))
                }
                <Button
                    variant='primary'
                    onClick={(e) => onSubmit(e)}>
                    Update
                </Button>
            </form>
        </PageContainer>
    );
}

export default ChallengeUpdate;