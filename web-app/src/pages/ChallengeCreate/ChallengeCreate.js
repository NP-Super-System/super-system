import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { IoAddSharp } from 'react-icons/io5';
import { BsFillTrash2Fill, BsFillCheckSquareFill } from 'react-icons/bs';
import toast from 'react-hot-toast';

import styles from './ChallengeCreate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import Swal from 'sweetalert2'


const ChallengeCreate = props => {

    const { user } = useContext(GlobalContext);

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const [title, setTitle] = useState('');
    const [points, setPoints] = useState(0);
    const [questionList, setQuestionList] = useState([{ text: '', fileInputKey: '0', points: 0, isMultipleAns: false, isImageUpload: false, options: [{ text: '', isCorrect: false }] }]);
    const [imgList, setImgList] = useState([]);

    useEffect(() => {

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

    const handleQuestionAdd = e => {
        setQuestionList([...questionList, { text: '', fileInputKey: '0', points: 0, isMultipleAns: false, isImageUpload: false, options: [{ text: '', isCorrect: false }] }])
        let newImgList = [...imgList, null];
        setImgList(newImgList);
    }

    const handleQuestionChange = (e, index) => {
        const { name, value } = e.target;
        let list = [...questionList];
        list[index].text = value;
        setQuestionList(list);
        console.log(list);
    }

    const handleQuestionTypeChange = (e, index) => {
        let newQuestionList = [...questionList];
        newQuestionList[index].isMultipleAns = e.target.value === 'M'; // 'S' == false, 'M' == true
        newQuestionList[index].isImageUpload = e.target.value === 'I';
        setQuestionList(newQuestionList);
    }

    const handleQuestionRemove = (index) => {
        const newQuestionList = [...questionList];
        newQuestionList.splice(index, 1);
        setQuestionList(newQuestionList);

        let newImgList = [...imgList];
        newImgList.splice(index, 1);
        setImgList(newImgList);
    }

    const handleOptionAdd = (index) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].options.push({ text: '', isCorrect: false })
        setQuestionList(newQuestionList);
    }

    const handleOptionRemove = (qindex, oindex) => {
        const newQuestionList = [...questionList];

        newQuestionList[qindex].options.splice(oindex, 1);
        setQuestionList(newQuestionList);
        console.log(newQuestionList[qindex].options);
    }

    const handleOptionChange = (e, qindex, oindex) => {
        const { name, value } = e.target;
        const newQuestionList = [...questionList];

        newQuestionList[qindex].options[oindex].text = value;
        setQuestionList(newQuestionList);
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

    const handlePointsChange = (index, newPoints) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].points = Number(newPoints);
        setQuestionList(newQuestionList);
        setPoints(questionList.reduce((a, v) => a = a + v.points, 0));
    }

    const handleImageChange = (e, qindex) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const img = e.target.files[0];

        let newImgList = [...imgList];
        newImgList[qindex] = img;
        setImgList(newImgList);
        console.log(newImgList);
    }
    const cancelImageUpload = (e, qindex) => {
        let list = [...questionList];
        list[qindex].fileInputKey = Math.random().toString(36);
        setQuestionList(list);
        let newImgList = [...imgList];
        newImgList[qindex] = null;
        setImgList(newImgList);
        console.log(newImgList);
    }

    const onSubmit = async e => {
        e.preventDefault();
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
        createChallenge(user.id, title, points, questionList);
    }

    const createChallenge = async (userId, title, points, content) => {
        // const rating = 0 , numberOfRatings = 0;

        // const options = {
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     method: 'POST',
        //     body: JSON.stringify({ userId, title, points, rating, numberOfRatings, content }),
        // }

        let formData = new FormData();
        formData.append('userId', userId);
        formData.append('title', title);
        formData.append('points', points);
        formData.append('rating', 0);
        formData.append('numberOfRatings', 0);
        formData.append('content', JSON.stringify(content));
        for (var index in imgList){
            formData.append('imgList[]', imgList[index]);
            if(imgList[index]){
                formData.append('imgIndexList[]', index);
            }
        }

        for (var pair of formData) {
            console.log(pair);
        }
        console.log(imgList);

        const options = {
            method: 'POST',
            body: formData,
        }

        console.log(`Creating new challenge`);

        const url = 'http://localhost:5000/challenge/create';

        fetch(url, options)
            .then(res => {
                console.log('Added new challenge');
                toast.success('Successfully created challenge!');
                // navigate('/challenges');
            })
            .catch(err => {
                toast.error('Error creating challenge');
                console.log(err);
            });
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
                    <Form.Control
                        name='title'
                        type='input'
                        placeholder='Title'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required />
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
                                    onChange={e => handleQuestionTypeChange(e, qindex)}>
                                    <option value='S'>Single Answer Question</option>
                                    <option value='M'>Multiple Answer Question</option>
                                    <option value='I'>Image Upload</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className={`mb-3`}>
                                <Form.Control
                                    name='points'
                                    type='number'
                                    placeholder='Points'
                                    value={question.points}
                                    onChange={e => handlePointsChange(qindex, e.target.value)}
                                    required />
                            </Form.Group>
                            <Form.Group className={`mb-3`}>
                                <span>Image (optional)</span>
                                <Form.Control
                                    key={question.fileInputKey}
                                    name='file'
                                    type='file'
                                    accept='image/png, image/jpeg'
                                    size='sm'
                                    onChange={e => handleImageChange(e, qindex)} />
                                {
                                    imgList[qindex] &&
                                    <Button
                                        variant='danger'
                                        onClick={e => cancelImageUpload(e, qindex)}>
                                        Cancel
                                    </Button>
                                }
                            </Form.Group>
                            <Form.Group className={`mb-3`}>
                                <Form.Control
                                    name='question'
                                    placeholder={`Question ${qindex + 1}`}
                                    value={question.text}
                                    onChange={e => handleQuestionChange(e, qindex)}
                                    required />
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
                    Create
                </Button>
            </form>
        </PageContainer>
    );
}

export default ChallengeCreate;