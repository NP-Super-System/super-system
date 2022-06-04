import React, {useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { IoAddSharp } from 'react-icons/io5';
import { BsFillTrash2Fill, BsFillCheckSquareFill } from 'react-icons/bs';
import toast from 'react-hot-toast';

import styles from './ChallengeCreate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

const ChallengeCreate = props => {

    const { user } = useContext(GlobalContext);

    const [title, setTitle] = useState('');
    const [points, setPoints] = useState('');
    const [questionList, setQuestionList] = useState([{ question: '', isMultipleAns: false, options: [{ option: '', isCorrect: false}]}]);

    const navigate = useNavigate();

    useEffect(()=>{

    }, []);

    const handleQuestionAdd = e => {
        setQuestionList([...questionList, { question: '', isMultipleAns: false, options: [{ option: '', isCorrect: false}]}])
    }

    const handleQuestionChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...questionList];
        list[index][name] = value;
        setQuestionList(list);
    }

    const handleQuestionTypeChange = (e, index) => {
        let newQuestionList = [...questionList];
        newQuestionList[index].isMultipleAns = e.target.value === 'M'; // 'S' == false, 'M' == true

        setQuestionList(newQuestionList);
    }

    const handleQuestionRemove = (e, index) => {
        const newQuestionList = [...questionList];

        newQuestionList.splice(index, 1);
        setQuestionList(newQuestionList);
    }

    const handleOptionAdd = (index) => {
        const newQuestionList = [...questionList];

        newQuestionList[index].options.push({ option: '', isCorrect: false})
        setQuestionList(newQuestionList);
    }

    const handleOptionRemove = (qindex, oindex) => {
        const newQuestionList = [...questionList];

        newQuestionList[qindex].options.splice(oindex, 1);
        setQuestionList(newQuestionList);

        console.log(newQuestionList[qindex].options);
    }

    const handleOptionChange = (e, qindex, oindex) => {
        const {name, value} = e.target;
        const newQuestionList = [...questionList];
        
        newQuestionList[qindex].options[oindex][name] = value;
        setQuestionList(newQuestionList);
    }

    const updateOption = (qindex, oindex) => {
        const newQuestionList = [...questionList];
        const option = newQuestionList[qindex].options[oindex];

        if (newQuestionList[qindex].isMultipleAns){
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

    const onSubmit = async e => {
        e.preventDefault();
        createChallenge(user.id, title, points, questionList);
    }

    const createChallenge = (userId, title, points, content) => {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ userId, title, points, content }),
        }

        console.log(`Creating new challenge`);

        const createChallengeUrl = 'http://localhost:5000/challenge/create';

        fetch(createChallengeUrl, options)
            .then(res => {
                console.log('Added new challenge');
                toast.success('Successfully created challenge!');
                navigate('/challenges');
            })
            .catch(err => {
                toast.error('Error creating challenge');
                console.log(err);
            });
    }

    return (
        <PageContainer>
            <form onSubmit={onSubmit} className={styles.form}>
                <Link to='/challenges'>
                    <Button 
                        variant='outline-primary' 
                        className={styles.backBtn}>
                        <BsFillArrowLeftCircleFill />
                    </Button>
                </Link>
                <Form.Group className={`mb-3`}>
                    <Form.Control 
                        name='title' 
                        type='input' 
                        placeholder='Title' 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        required/>
                </Form.Group>
                <Form.Group className={`mb-3`}>
                    <Form.Control 
                        name='points' 
                        type='number' 
                        placeholder='Points' 
                        value={points} 
                        onChange={e => setPoints(e.target.value)} 
                        required/>
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
                                    <IoAddSharp className={styles.icon}/>
                                </Button>
                            }
                            {
                                questionList.length > 1 &&

                                <Button
                                    className={styles.delete_button}
                                    onClick={() => handleQuestionRemove(qindex)}>
                                    <BsFillTrash2Fill className={styles.icon}/>
                                </Button>
                            }
                            <Form.Group className={`mb-3`}>
                                <Form.Select 
                                    name='questionType' 
                                    onChange={e => handleQuestionTypeChange(e, qindex)}>
                                    <option value='S'>Single Answer Question</option>
                                    <option value='M'>Multiple Answer Question</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className={`mb-3`}>
                                <Form.Control 
                                    name='question'     
                                    placeholder={`Question ${qindex + 1}`} 
                                    value={question.question} 
                                    onChange={(e) => handleQuestionChange(e, qindex)} 
                                    required/>
                            </Form.Group>
                            {
                                question.options.map((option, oindex) => {
                                    console.log(option, oindex);
                                    return <Form.Group key={`${oindex}`} className={`mb-3 ${styles.options}`}>

                                        <Form.Check
                                            type={questionList[qindex].isMultipleAns ? 'checkbox': 'radio'}
                                            name="radioOptions"
                                            className={styles.checkbox}
                                            onChange={() => updateOption(qindex, oindex)}
                                            checked={option.isCorrect}/>

                                        <Form.Control 
                                            name='option' 
                                            placeholder={`Option ${oindex + 1}`} 
                                            value={option.option} 
                                            onChange={(e) => handleOptionChange(e, qindex, oindex)} 
                                            required/>
                                        {
                                            questionList[qindex].options.length - 1 === oindex &&

                                            <Button 
                                                variant='primary'
                                                className={styles.create_button}
                                                onClick={() => handleOptionAdd(qindex)}>
                                                <IoAddSharp className={styles.icon}/>
                                            </Button>
                                        }
                                        {
                                            questionList[qindex].options.length > 1 &&

                                            <Button
                                                className={styles.delete_button}
                                                onClick={() => handleOptionRemove(qindex, oindex)}>
                                                <BsFillTrash2Fill className={styles.icon}/>
                                            </Button>
                                        }
                                    </Form.Group>
                                })
                            }
                        </div>
                    ))
                }
                <input type='hidden' name='userId' value={user.id} />
                <Button 
                    variant='primary' 
                    type='submit'>
                    Create
                </Button>
            </form>
        </PageContainer>
    );
}

export default ChallengeCreate;