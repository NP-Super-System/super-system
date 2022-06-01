import React, {useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, renderMatches } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { IoAddSharp } from 'react-icons/io5';
import { BsFillTrash2Fill, BsFillCheckSquareFill } from 'react-icons/bs';


import styles from './ChallengeCreate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

const ChallengeCreate = props => {

    const { user } = useContext(GlobalContext);

    const [title, setTitle] = useState('');
    const [points, setPoints] = useState('');
    const [question, setQuestion] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [buttonState, setButtonState] = useState('');
    const [optionList, setOptionList] = useState([{ option: '', isCorrect: false}]);
    const [questionList, setQuestionList] = useState([{ question: '', isMultipleAns: false, options: [{ option: '', isCorrect: false}]}]);

    useEffect(()=>{

    }, []);

    const handleQuestionAdd = () => {
        setQuestionList([...questionList, { question: '', isMultipleAns: false, options: [{ option: '', isCorrect: false}]}])
    }

    const handleQuestionChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...questionList];
        list[index][name] = value;
        setQuestionList(list);
    }

    const handleQuestionTypeChange = (index) => {
        if (questionList[index].isMultipleAns) {
            questionList[index].isMultipleAns = false;
            setQuestionType('S');
        }
        else {
            questionList[index].isMultipleAns = true;
            setQuestionType('M');
        }
    }

    const handleQuestionRemove = (e, index) => {
        const list = [...questionList];
        list.splice(index, 1);
        setQuestionList(list);
    }

    const handleOptionAdd = (index) => {
        const list = [...questionList];
        list[index].options.push({ option: '', isCorrect: false})
        setQuestionList(list);
    }

    const handleOptionRemove = (qindex, oindex) => {
        const list = [...questionList];
        list[qindex].options.splice(oindex, 1);
        setQuestionList(list);
    }

    const handleOptionChange = (e, qindex, oindex) => {
        const {name, value} = e.target;
        const list = [...questionList];
        list[qindex].options[oindex][name] = value;
        setQuestionList(list);
    }

    const updateOption = (qindex, oindex) => {
        const list = [...questionList];
        const option = list[qindex].options[oindex];
        if (list[qindex].isMultipleAns){
            if (option.isCorrect) {
                option.isCorrect = false;
            }
            else {
                option.isCorrect = true;
            }
        }
        else {
            for (var i = 0; i < list[qindex].options.length; i++) {
                list[qindex].options[i].isCorrect = false;
            }
            option.isCorrect = true;            
        }
        console.log(list[qindex].options);
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
            })
            .catch(err => console.log(err));
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
                    <Form.Control name='title' type='input' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} required/>
                </Form.Group>
                <Form.Group className={`mb-3`}>
                <Form.Control name='points' type='number' placeholder='Points' value={points} onChange={e => setPoints(e.target.value)} required/>
                </Form.Group>
                {
                    questionList.map((question, qindex) => (
                        <div key={qindex}>
                            Question {qindex + 1}:
                            {questionList.length - 1 === qindex &&
                                <Button 
                                    variant='primary'
                                    className={styles.create_button}
                                    onClick={handleQuestionAdd}>
                                    <IoAddSharp className={styles.icon}/>
                                </Button>
                            }
                            {questionList.length > 1 &&                         
                                <Button
                                    className={styles.delete_button}
                                    onClick={() => handleQuestionRemove(qindex)}>
                                    <BsFillTrash2Fill className={styles.icon}/>
                                </Button>
                            }
                            <Form.Group className={`mb-3`}>
                            <Form.Select name='questionType' onChange={() => handleQuestionTypeChange(qindex)}>
                                <option>Single Answer Question</option>
                                <option>Multiple Answer Question</option>
                            </Form.Select>
                            </Form.Group>
                            <Form.Group className={`mb-3`}>
                            <Form.Control name='question' placeholder={`Question ${qindex + 1}`} value={question.question} onChange={(e) => handleQuestionChange(e, qindex)} required/>
                            </Form.Group>
                            {questionList[qindex].options.map((option, oindex) => (
                                <Form.Group key={oindex} className={`mb-3 ${styles.options}`}>
                                {questionList[qindex].isMultipleAns ? 
                                    <Form.Check
                                    type='checkbox'
                                    name="radioOptions"
                                    
                                    className={styles.checkbox}
                                    onChange={() => updateOption(qindex, oindex)}/>
                                    :
                                    <Form.Check
                                    type='radio'
                                    name="radioOptions"
                                    className={styles.checkbox}
                                    onChange={() => updateOption(qindex, oindex)}/>
                                }
                                <Form.Control name='option' placeholder={`Option ${oindex + 1}`} value={option.option} onChange={(e) => handleOptionChange(e, qindex, oindex)} required/>
                                {questionList[qindex].options.length - 1 === oindex &&
                                    <Button 
                                        variant='primary'
                                        className={styles.create_button}
                                        onClick={() => handleOptionAdd(qindex)}>
                                        <IoAddSharp className={styles.icon}/>
                                    </Button>
                                }
                                {questionList[qindex].options.length > 1 &&                         
                                    <Button
                                        className={styles.delete_button}
                                        onClick={() => handleOptionRemove(qindex, oindex)}>
                                        <BsFillTrash2Fill className={styles.icon}/>
                                    </Button>
                                }
                                </Form.Group>
                            ))}
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