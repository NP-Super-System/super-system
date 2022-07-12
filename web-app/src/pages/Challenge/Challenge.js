import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Button, Form, Image } from 'react-bootstrap';
import styles from './Challenge.module.css';

import PageContainer from '../../layout/PageContainer';
import { Link } from "react-router-dom";
import BeautyStars from 'beauty-stars';
import GlobalContext from '../../context/GlobalContext';

import Swal from 'sweetalert2';


const Challenge = props => {

	const { challengeId } = useParams();
	const { user } = useContext(GlobalContext);

	const [challenge, setChallenge] = useState([]);

	const [currentQuestion, setCurrentQuestion] = useState(0);
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

	var ans = []

	const singleAnswer = (id) => {
		setIsCorrect(challenge[currentQuestion].options[id].isCorrect);
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
		else if (challenge[currentQuestion].options[id].isCorrect) {
			isCorrectCounter.push(id);
		}
	}

	const ansSelected = () => {
		if (challenge[currentQuestion].isMultipleAns) {
			const correct = [];
			for (var i = 0; i < challenge[currentQuestion].options.length; i++) {
				if (challenge[currentQuestion].options[i].isCorrect) {
					correct.push(i);
				}
			}

			let numBerComparator = (a, B) => a - B
			isCorrectCounter.sort(numBerComparator)

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

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < challenge.length) {
			setIsClicked(false);
			setIsChosen([]);
			setCurrentQuestion(nextQuestion);
			ans = []
		} else {
			setShowScore(true);
		}
	}

	const handleAnswerOptionClick = () => {
		{
			challenge[currentQuestion].isMultipleAns ?
				isChosen?.length !== 0 ?
					ansSelected()
					:
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Please select an answer!',
					})
				: challenge[currentQuestion].isImageUpload ?
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
		setCurrentQuestion(0);
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
						setNumberOfRatings(data.numberOfRatings);
						setChallengeRating(data.rating);
						setChallenge(data.questions);
						setPoints(data.pointCount);
						setUsersCompleted(data.usersCompleted);
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
					showScore ?
						<div>
							You scored
							{
								score === challenge.length ?
									' full marks!'
									:
									` ${score} out of ${challenge.length}`
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
						:
						<>
							{
								challenge[currentQuestion] &&
								<div>
									<div>
										<span>Challenge {currentQuestion + 1}</span>/{challenge.length}
									</div>
									{
										challenge[currentQuestion].imgKey &&
										<Image
											className={styles.img}
											src={`http://localhost:5000/s3/image/?key=${challenge[currentQuestion].imgKey}`} />
									}
									<div>{challenge[currentQuestion].text}</div>
									<div className={styles.answersection}>
										{
											challenge[currentQuestion].isMultipleAns ?
												challenge[currentQuestion].options.map((answerOption, i) => (
													<div key={i + currentQuestion * 10} className={styles.button}>
														<input type="checkbox" className="btn-check" name="options" id={answerOption._id} />
														<label className={`${styles.label} btn btn-outline-primary`} htmlFor={answerOption._id} onClick={() => multipleAnswer(i)}>{answerOption.text}</label>
													</div>
												))
												: challenge[currentQuestion].isImageUpload ?
													'image upload'
													:
													challenge[currentQuestion].options.map((answerOption, i) => (
														<div key={i + currentQuestion * 10} className={styles.button}>
															<input type="radio" className="btn-check" name="options" id={answerOption._id} />
															<label className={`${styles.label} btn btn-outline-primary`} htmlFor={answerOption._id} onClick={() => singleAnswer(i)}>{answerOption.text}</label>
														</div>
													))
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