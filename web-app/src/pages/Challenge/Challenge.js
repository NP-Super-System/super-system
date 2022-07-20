import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { Button, Form, Image } from 'react-bootstrap';

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
	const handleImageChange = (e, qindex) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setImgSubmission({
			img: e.target.files[0],
			qindex,
		});
    }

	useEffect(()=>{
		console.log(imgSubmission);
	}, [imgSubmission]);

	const handleSubmitImage = e => {
		const {img, qindex} = imgSubmission;

		let formData = new FormData();
		formData.append('img', img);
		formData.append('challengeId', challengeId);
		formData.append('qindex', qindex);

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

	var ans = [];

	const singleAnswer = (id) => {
		setIsCorrect(questions[questionIndex].options[id].isCorrect);
		setIsClicked(true);
	}

	const multipleAnswer = (id) => {
		if (isChosen.includes(id)) {
			console.log('remove');
			isChosen.splice(isChosen.findIndex(answer => answer === id), 1);
		}
		else {
			console.log('add');
			isChosen.push(id);
		}
		if (isCorrectCounter.includes(id)) {
			isCorrectCounter.splice(isCorrectCounter.findIndex(answer => answer === id), 1);
		}
		else if (questions[questionIndex].options[id].isCorrect) {
			isCorrectCounter.push(id);
		}
	}

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
			ans = [];
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
			const options = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ points }),
			}

			console.log(`Incrementing points`);

			const submitRating = `http://localhost:5000/increase/points/${user._id}`;

			fetch(submitRating, options)
				.then(res => {
					console.log('Incremented points');
				})
				.catch(err => {
					console.log('Error incrementing points');
					console.log(err);
				});

			const option = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ challengeId }),
			}

			console.log(`Adding user to list`);

			const submitUser = `http://localhost:5000/challenge/completed/${user._id}`;

			fetch(submitUser, option)
				.then(res => {
					console.log('Added user to list');
				})
				.catch(err => {
					console.log('Error adding user to list');
					console.log(err);
				});
		}
	}

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
					<div>
						You scored
					{
						score === questions.length ?
						` full marks! (${score} out of ${questions.length})`

						:
						` ${score} out of ${questions.length}`
					}
						<br />
						<br />
						<div>Please rate the challenge:</div>
						<br />
						<div className={styles.rater}>
							<BeautyStars
								value={rating}
								activeColor="blue"
								onChange={value => setRating(value)}
							/>
						</div>
						<br />
						<br />
						<Button variant='outline-primary' onClick={() => { restartChallenge(); submitRating(); incrementPoints() }}>Redo Challenge</Button>
						<br />
						<br />
						<Link to='/challenges'>
							<Button variant='outline-primary' onClick={() => { submitRating(); incrementPoints() }}>Back To Challenges</Button>
						</Link>
					</div>

					: // Show question
					<>
					{
						questions[questionIndex] &&
						<div className={styles.question}>
							<span>Challenge {questionIndex + 1}/{questions.length}</span>
						{
							questions[questionIndex].imgKey &&
							<Image
								className={styles.img}
								src={`http://localhost:5000/s3/image/?key=${questions[questionIndex].imgKey}`} />
						}
							<div>{questions[questionIndex].text}</div>
							<div className={styles.answersection}>
							{
								questions[questionIndex].type === 'multiple-answer' ?
								questions[questionIndex].options.map((answerOption, i) => (
									<div key={i + questionIndex * 10} className={styles.button}>
										<input type="checkbox" className="btn-check" name="options" id={answerOption._id} />
										<label className={`${styles.label} btn btn-outline-primary`} htmlFor={answerOption._id} onClick={() => multipleAnswer(i)}>{answerOption.text}</label>
									</div>
								))

								: questions[questionIndex].type === 'image-upload' ?
								<>
									<Form.Group>
										<Form.Control
											key=''
											name='image'
											type='file'
											accept='image/png, image/jpeg'
											size='sm'
											onChange={e => handleImageChange(e, questionIndex)}/>
									</Form.Group>
								{
									imgSubmission?.img &&
									<Button
										variant='primary'
										onClick={handleSubmitImage}>
										Submit Image
									</Button>
								}
									<span>Submissions ({questions[questionIndex].submissions.length})</span>
								</>
										
								: questions[questionIndex].type === 'single-answer' ?
								questions[questionIndex].options.map((answerOption, i) => (
									<div key={i + questionIndex * 10} className={styles.button}>
										<input type="radio" className="btn-check" name="options" id={answerOption._id} />
										<label className={`${styles.label} btn btn-outline-primary`} htmlFor={answerOption._id} onClick={() => singleAnswer(i)}>{answerOption.text}</label>
									</div>
								))

								: 

								<span style={{fontStyle: 'italic'}}>Error identifying question type</span>
							}
							</div>
							<label className={`${styles.label} btn btn-outline-success`} onClick={() => handleAnswerOptionClick()}>Next</label>
						</div>
					}
					</>
				}
			</div>
		</PageContainer>
	);
}

export default Challenge;