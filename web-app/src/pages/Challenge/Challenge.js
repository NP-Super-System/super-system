import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { Button, Form, Image, Card } from 'react-bootstrap';
import { BsArrowClockwise, BsFillFileEarmarkFontFill, BsArrowLeft } from 'react-icons/bs';

import styles from './Challenge.module.css';

import PageContainer from '../../layout/PageContainer';
import BeautyStars from 'beauty-stars';
import GlobalContext from '../../context/GlobalContext';


const Challenge = props => {

	const { challengeId } = useParams();
	const { user } = useContext(GlobalContext);

	const [questions, setQuestions] = useState([]);

	const [questionIndex, setQuestionIndex] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
	const [isClicked, setIsClicked] = useState(false);
	const [isChosen, setIsChosen] = useState([]);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isCorrectCounter, setIsCorrectCounter] = useState([]);
	const [rating, setRating] = useState(0);
	const [challengeRating, setChallengeRating] = useState(0);
	const [numberOfRatings, setNumberOfRatings] = useState(0);
	const [points, setPoints] = useState(0);
	const [usersCompleted, setUsersCompleted] = useState([]);

	const [imgSubmission, setImgSubmission] = useState(null);
	const handleImageChange = e => {
        if (!e.target.files || e.target.files.length === 0) return;

        setImgSubmission(e.target.files[0]);
    }

	const [textSubmission, setTextSubmission] = useState('');
	const handleTextChange = e => {
		setTextSubmission(e.target.value);
	}

	useEffect(()=>{
		console.log(imgSubmission);
	}, [imgSubmission]);

	const handleSubmission = e => {
		let formData = new FormData();
		formData.append('challengeId', challengeId);
		formData.append('questionIndex', questionIndex);
		formData.append('img', imgSubmission);
		formData.append('text', textSubmission);
		formData.append('userId', user.id);
		
		const url = 'http://localhost:5000/challenge/post';
        const options = {
            method: 'POST',
            body: formData,
        }

        fetch(url, options)
            .then(async res => {
				const data = JSON.parse(await res.text());
                console.log(data.msg);
                toast.success('Posted image submission!');
            })
            .catch(err => {
                toast.error(err);
                console.log(err);
            });
	}

	const singleAnswer = (id) => {
		setIsCorrect(questions[questionIndex].options[id].isCorrect);
		setIsClicked(true);
	}

	const multipleAnswer = (id) => {
		let newIsChosen = [...isChosen];

		if (isChosen.includes(id)) {
			console.log('remove');
			newIsChosen.splice(isChosen.findIndex(answer => answer === id), 1);
			setIsChosen(newIsChosen);
		}
		else {
			console.log('add');
			newIsChosen.push(id);
			setIsChosen(newIsChosen);
		}
		if (isCorrectCounter.includes(id)) {
			isCorrectCounter.splice(isCorrectCounter.findIndex(answer => answer === id), 1);
		}
		else if (questions[questionIndex].options[id].isCorrect) {
			isCorrectCounter.push(id);
		}
	}

	useEffect(()=>{
		console.log('isChosen:', isChosen);
	}, [isChosen]);

	const ansSelected = () => {
		if (questions[questionIndex].type === 'multiple-answer') {
			const correct = [];
			for (var i = 0; i < questions[questionIndex].options.length; i++) {
				if (questions[questionIndex].options[i].isCorrect) {
					correct.push(i);
				}
			}

			isCorrectCounter.sort((a, B) => a - B);

			if (JSON.stringify(isCorrectCounter) == JSON.stringify(correct)) {
				setScore(score + 1);
			}
		}
		else {
			if (isCorrect) {
				setScore(score + 1);
			}
		}
		setIsCorrectCounter([]);
		setIsCorrect(false);

		const nextQuestion = questionIndex + 1;
		if (nextQuestion < questions.length) {
			setIsClicked(false);
			setIsChosen([]);
			setQuestionIndex(nextQuestion);
		} else {
			setShowScore(true);
		}
	}

	const handleAnswerOptionClick = () => {
		{
			questions[questionIndex].type === 'multiple-answer' ?
				isChosen?.length !== 0 ?
					ansSelected()
					:
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Please select an answer!',
					})
				: questions[questionIndex].type === 'image-upload'  ?
					ansSelected()
					:
					isClicked ?
						ansSelected()
						:
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'Please select an answer!',
						})

		}
	};

	const submitRating = () => {
		if (rating !== 0) {
			const options = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ rating }),
			}

			console.log(`Submitting rating`);

			const submitRating = `http://localhost:5000/challenge/rating/${challengeId}`;

			fetch(submitRating, options)
				.then(res => {
					console.log('Submitted rating');
				})
				.catch(err => {
					console.log('Error submitting rating');
					console.log(err);
				});
		}
	}

	const restartChallenge = () => {
		getChallenge();
		setIsChosen([]);
		setIsClicked(false);
		setScore(0);
		setQuestionIndex(0);
		setShowScore(false);
		setRating(0);
	}

	const incrementPoints = () => {
		if (!usersCompleted.includes(user._id)) {
			const ratingOptions = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ points }),
			}

			console.log(`Incrementing points`);

			const submitRating = `http://localhost:5000/increase/points/${user._id}`;

			fetch(submitRating, ratingOptions)
				.then(res => {
					console.log('Incremented points');
				})
				.catch(err => {
					console.log('Error incrementing points');
					console.log(err);
				});

			const completedOptions = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ challengeId }),
			}

			console.log(`Adding user to list`);

			const completedUrl = `http://localhost:5000/challenge/completed/${user._id}`;

			fetch(completedUrl, completedOptions)
				.then(res => {
					console.log('Added user to completed list');
				})
				.catch(err => {
					console.log('Error adding user to completed list');
					console.log(err);
				});
		}
	}

	const [pastSubmissions, setPastSubmissions] = useState([]);
	const getPastSubmissions = questions => {
		setPastSubmissions(
			questions.map((qn, i) => {
					return {
						questionIndex: i,
						submissions: qn.submissions.filter(sub => sub.user._id == user.id),
					};
				})
		);
	}
	useEffect(()=>{
		console.log(pastSubmissions);
	}, [pastSubmissions]);

	const getChallenge = () => {
		// Get all challenges from server
		fetch(`http://localhost:5000/challenge/read/${challengeId}`)
			.then(
				res => res.json()
					.then(data => {
						// Set challenges
						console.log(data);
						const {pointCount, rating, numberOfRatings, questions, usersCompleted} = data;
						setPoints(pointCount);
						setChallengeRating(rating);
						setNumberOfRatings(numberOfRatings);

						setQuestions(questions);
						setUsersCompleted(usersCompleted);

						getPastSubmissions(questions);
					})
					.catch(err => console.log(err))
			)
			.catch(err => console.log(err));
	}

	useEffect(() => {
		getChallenge();
	}, []);

	return (
		<PageContainer>
			<div className={styles.challenge}>
				{
					showScore ? // Show final score
					<Card className={styles.rate}>
						<div className={styles.left_pane}>
							<Card.Title>
								You scored
							{
								score === questions.length ?
								` full marks! (${score} out of ${questions.length})`

								:
								` ${score} out of ${questions.length}`
							}
							</Card.Title>
							<div className={styles.pls_text}>Please rate the challenge:</div>
							<div className={styles.rater}>
								<BeautyStars
									value={rating}
									activeColor="blue"
									onChange={value => setRating(value)}
								/>
							</div>
						</div>
						<div className={styles.actions}>
							{/* BsArrowClockwise, BsFillFileEarmarkFontFill, BsArrowLeft */}
							<Button className={styles.button} variant='primary' onClick={() => { restartChallenge(); submitRating(); incrementPoints() }}>
								<BsArrowClockwise className={styles.icon}/>
								Redo Challenge
							</Button>
							<Link to={`/challenges/answers/${challengeId}`}>
								<Button className={styles.button} variant='primary' onClick={() => { submitRating(); incrementPoints() }}>
									<BsFillFileEarmarkFontFill className={styles.icon}/>
									View Answers
								</Button>
							</Link>
							<Link to='/challenges'>
								<Button className={styles.button} variant='primary' onClick={() => { submitRating(); incrementPoints() }}>
									<BsArrowLeft className={styles.icon}/>
									Back To All Challenges
								</Button>
							</Link>
						</div>
					</Card>

					: // Show question
					<>
					{
						questions[questionIndex] &&
						<Card className={styles.question}>
							<Card.Title className={styles.title}>Question {questionIndex + 1}/{questions.length}</Card.Title>
						{
							questions[questionIndex].imgKey &&
							<Image
								className={styles.img}
								src={`http://localhost:5000/s3/image/?key=${questions[questionIndex].imgKey}`} />
						}
						{
							questions[questionIndex].type === 'multiple-answer' &&
							<span style={{
								fontSize: 'small',
								fontStyle: 'italic',
								color: 'gray',
								marginBottom: '1em',
							}}>Multiple answer question</span>
						}
							<div className={styles.text}>{questions[questionIndex].text}</div>
							<div className={styles.answersection}>
							{
								questions[questionIndex].type === 'multiple-answer' ?
								questions[questionIndex].options.map((answerOption, i) => (
									<div key={`${i + questionIndex * 10}`} className={styles.button}>
										<input type="checkbox" className="btn-check" name="options" id={answerOption._id} />
										<label 
											className={`${isChosen.includes(i) ? styles.label_chosen : styles.label} btn btn-outline-primary`} 
											htmlFor={answerOption._id} 
											onClick={() => multipleAnswer(i)}>

											{answerOption.text}

										</label>
										<hr></hr>
									</div>
								))

								: questions[questionIndex].type === 'image-upload' ?
								<>
									<span className={styles.submission_text}>{questions[questionIndex].submissions.length} submissions</span>
									<hr style={{width: '100%'}}></hr>
								{
									pastSubmissions[questionIndex]?.submissions &&
									<>
										<span className={styles.user_submissions_text}>Your submissions ({pastSubmissions[questionIndex].submissions.length})</span>
									{
										pastSubmissions[questionIndex].submissions.map(submission => {
											const {imgKey, text, user, likedUser, pastLikedUsers} = submission;
											return <div className={styles.submissions}>
												<Image 
													src={`http://localhost:5000/s3/image/?key=${imgKey}`}
													className={styles.img}/>
												<span className={styles.text}>{text}</span>
											</div>
										})
									}
										<hr></hr>
									</>
								}
									<Form.Control
										key=''
										name='image'
										type='file'
										accept='image/png, image/jpeg'
										size='sm'
										onChange={handleImageChange}/>
									<Form.Control
										name='text'
										type='text'
										placeholder='Text'
										value={textSubmission}
										onChange={handleTextChange}/>
								{
									user && imgSubmission &&
									<Button
										variant='primary'
										onClick={handleSubmission}>
										Submit
									</Button>
								}
								</>
										
								: questions[questionIndex].type === 'single-answer' ?
								questions[questionIndex].options.map((answerOption, i) => (
									<div key={`${i + questionIndex * 10}`} className={styles.button}>
										<input type="radio" className="btn-check" name="options" id={answerOption._id} />
										<label className={`${styles.label} btn btn-outline-primary`} htmlFor={answerOption._id} onClick={() => singleAnswer(i)}>{answerOption.text}</label>
										<hr></hr>
									</div>
								))

								: 

								<span style={{fontStyle: 'italic'}}>Error identifying question type</span>
							}
							</div>
							<label className={`${styles.label} btn btn-outline-success`} onClick={() => handleAnswerOptionClick()}>Next</label>
						</Card>
					}
					</>
				}
			</div>
		</PageContainer>
	);
}

export default Challenge;