import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Image, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsFillArrowLeftCircleFill, BsX } from 'react-icons/bs';
import { IoAddSharp } from 'react-icons/io5';
import { BsFillTrash2Fill, BsFillCheckSquareFill } from 'react-icons/bs';
import toast from 'react-hot-toast';

import styles from './ChallengeCreate.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import Swal from 'sweetalert2'
import Preview from './Preview';


const ChallengeCreate = props => {

    const { user } = useContext(GlobalContext);

    const { challengeId } = useParams();

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const [title, setTitle] = useState('');

    const [currTag, setCurrTag] = useState('');
    const [tags, setTags] = useState([]);
    const handleDeleteTag = tagToDelete => {
        setTags(tags.filter(tag => tag !== tagToDelete));
    }

    const [points, setPoints] = useState(0);
    const [questionList, setQuestionList] = useState([]);

    const [imgList, setImgList] = useState([]);
    const [previews, setPreviews] = useState([]);

    const getChallenge = () => {
        // Get challenge from server
        fetch(`http://localhost:5000/challenge/read/${challengeId}`)
            .then(
                res => res.json()
                    .then(data => {
                        // Set challenge
                        console.log(data);
                        setTitle(`${data.title} (updated)`);
                        setTags(data.tags);
                        setPoints(data.pointCount);
                        setQuestionList(data.questions);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    useEffect(() => {
        if(challengeId){
            getChallenge();
            return;
        }
        questionList.length <= 0 && handleQuestionAdd();
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
        setQuestionList([...questionList, { text: '', fileInputKey: '0', points: 0, type: 'single-answer', options: [{ text: '', isCorrect: false }] }])
        let newImgList = [...imgList, null];
        setImgList(newImgList);
    }

    const handleQuestionChange = (e, index) => {
        const { name, value } = e.target;
        let list = [...questionList];
        list[index].text = value;
        setQuestionList(list);
    }

    const handleQuestionTypeChange = (e, index) => {
        let newQuestionList = [...questionList];
        newQuestionList[index].type = e.target.value;
        setQuestionList(newQuestionList);
        console.log(newQuestionList);
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

        if (newQuestionList[qindex].type === 'multiple-answer') {
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
        newQuestionList[index].points = Math.min(Number(newPoints), 10);
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

    useEffect(()=>{
        if(imgList.length <= 0) return;

        const newPreviews = imgList.map((img, i) => {
            if(!img) return null;
            const objectUrl = URL.createObjectURL(img);
            return {
                qindex: i,
                objectUrl,
            };
        });
        setPreviews(newPreviews);

        console.log(newPreviews);

        return () => {
            // free memory when ever this component is unmounted
            for (var preview of previews){
                if(!preview) continue
                const { objectUrl } = preview;
                
                if(!objectUrl) continue;
                URL.revokeObjectURL(objectUrl);
            }
        }
    }, [imgList]);

    const onSubmit = async e => {
        e.preventDefault();
        for (var i = 0; i < questionList.length; i++) {
            var hasAnswer = false;
            for (var j = 0; j < questionList[i].options.length; j++) {
                if (questionList[i].options[j].isCorrect || questionList[i].type === 'image-upload') {
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
        if(challengeId){
            updateChallenge(user.id, title, tags, points, questionList);
        }
        else{
            createChallenge(user.id, title, tags, points, questionList);
        }
    }

    const createChallenge = async (userId, title, tags, points, content) => {

        let formData = new FormData();
        formData.append('userId', userId);
        formData.append('title', title);

        for (var tag of tags){
            formData.append('tags[]', tag);
        }

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
                navigate('/challenges');
            })
            .catch(err => {
                toast.error('Error creating challenge');
                console.log(err);
            });
    }
    const updateChallenge = async (userId, title, tags, points, content) => {

        let formData = new FormData();
        formData.append('userId', userId);
        formData.append('updated', true);
        formData.append('title', title);

        for (var tag of tags){
            formData.append('tags[]', tag);
        }

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

        console.log(`Updating challenge ${challengeId}`);

        const url = 'http://localhost:5000/challenge/create';

        fetch(url, options)
            .then(res => {
                console.log('Updated challenge');
                toast.success('Successfully updated challenge!');
                navigate('/challenges');
            })
            .catch(err => {
                toast.error('Error updating challenge');
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

                <h5>Title</h5>
                <Form.Group className={`mb-3`}>
                    <Form.Control
                        name='title'
                        type='input'
                        placeholder='e.g. Ethical Hacking Test, Network Security Week 3 Test'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required />
                </Form.Group>

                <h6 className={styles.tag_title}>Tags</h6>
                <Form.Group className={'mb-3'}>
                    <div className={styles.tags}>
                    {
                        tags.map( (tag, i) =>
                            <React.Fragment key={`${i}`}>
                                <div className={styles.tag}>
                                    <span className={styles.name}>{tag}</span>
                                    <div 
                                        className={styles.icon}
                                        onClick={e => handleDeleteTag(tag)}>
                                        <BsX />
                                    </div>
                                </div>
                                <input 
                                    type='hidden'
                                    name={`tags[]`}
                                    value={tag}
                                    />
                            </React.Fragment>
                        )
                    }
                    </div>
                    <Form.Control 
                        className={styles.tag_input}
                        type='input' 
                        placeholder='Type a tag and press "Enter"'
                        value={currTag}
                        onKeyDown={
                            e => {
                                if(!['Enter', 'Tab', ','].includes(e.key)) return;

                                e.preventDefault();
                                const value = currTag.trim();

                                if(!value) return;

                                setTags([
                                    ...tags,
                                    value,
                                ]);
                                setCurrTag('');
                            }
                        }
                        onChange={e => setCurrTag(e.target.value)}/>
                </Form.Group>

                <div className={styles.total_points}>
                    <h6>Total Points:</h6>
                    <Image src={'/media/coin.png'} className={styles.img}/>
                    <span className={styles.count}>{points}</span>
                </div>

                <hr></hr>

                <h5 style={{marginBottom: '1em'}}>Questions ({questionList.length})</h5>
                {
                    questionList.map((question, qindex) => (
                        <Card key={`${qindex}`} className={styles.question}>
                            <div className={styles.header}>
                                <span className={styles.title}>Question {qindex + 1}:</span>
                            {
                                questionList.length - 1 === qindex &&

                                <Button
                                    variant='primary'
                                    className={styles.create_button}
                                    onClick={handleQuestionAdd}>
                                    <IoAddSharp className={styles.icon} /> Add Question
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
                            </div>
                            <div className={styles.settings}>
                                <div className={styles.type}>
                                    <span>Type</span>
                                    <Form.Group className={`mb-3`}>
                                        <Form.Select
                                            name='questionType'
                                            onChange={e => handleQuestionTypeChange(e, qindex)}
                                            value={question.type}>
                                            <option value='single-answer' >Single Answer</option>
                                            <option value='multiple-answer' >Multiple Answer</option>
                                            <option value='image-upload' >Image Upload</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className={styles.points}>
                                    <span>Points (max: 10)</span>
                                    <Form.Group className={`mb-3`}>
                                        <Form.Control
                                            name='points'
                                            type='number'
                                            placeholder='Points'
                                            value={question.points}
                                            onChange={e => handlePointsChange(qindex, e.target.value)}
                                            step='any'
                                            required />
                                    </Form.Group>
                                </div>
                                <div className={styles.image}>
                                    <div className={styles.label}>
                                        <span className={styles.img_text}>Image</span>
                                        <span className={styles.optional_text}>(optional)</span>
                                    </div>
                                    <Form.Group className={`mb-3 ${styles.input}`}>
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
                                </div>
                            </div>
                            <Preview qindex={qindex} previews={previews}/>
                            <span>Text</span>
                            <Form.Group className={`mb-3`}>
                                <Form.Control
                                    name='question'
                                    placeholder={`Question ${qindex + 1}`}
                                    value={question.text}
                                    onChange={e => handleQuestionChange(e, qindex)}
                                    required />
                            </Form.Group>
                            {
                                question.type === 'image-upload' ?
                                    
                                <span className={styles.img_upload_text}>This type of question collects image responses from users.</span>
                                    
                                :
                                <>
                                    <span>Options <i style={{fontSize: 'smaller', marginLeft: '0.5em'}}>(select the right answers)</i></span>
                                {
                                    question.options.map((option, oindex) => {
                                        return <Form.Group key={`${oindex}`} className={`mb-3 ${styles.option}`}>
                                            <Form.Check
                                                type={questionList[qindex].type === 'multiple-answer' ? 'checkbox' : 'radio'}
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
                                                    variant='none'
                                                    className={styles.create_button}
                                                    onClick={() => handleOptionAdd(qindex)}
                                                    title='Add Option'>
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
                                </>
                            }
                        </Card>
                    ))
                }
                <Button
                    variant='primary'
                    onClick={(e) => onSubmit(e)}
                    className={styles.publish_btn}>
                    Publish Challenge
                </Button>
            </form>
        </PageContainer>
    );
}

export default ChallengeCreate;