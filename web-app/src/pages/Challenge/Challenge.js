import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from 'react-bootstrap';
import styles from './Challenge.module.css';

import PageContainer from '../../layout/PageContainer';
import { challenge } from './ChallengeData.js';
import { Link } from "react-router-dom";

const Challenge = props => {
	
	const { challengeId } = useParams();

	const [challenge, setChallenge] = useState([]);

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isCorrectCounter, setIsCorrectCounter] = useState([]);

	var ans = []

	const singleAnswer = (id) => {
		setIsCorrect(challenge[currentQuestion].options[id].isCorrect);		
	}

	const multipleAnswer = (id) => { 
		if (isCorrectCounter.includes(id)) {
			console.log('delete');
			isCorrectCounter.splice(isCorrectCounter.findIndex(answer => answer === id), 1);
		}
		else if (challenge[currentQuestion].options[id].isCorrect) {			
			console.log('add');
			isCorrectCounter.push(id);
		}
		console.log(isCorrectCounter);
	}

	const handleAnswerOptionClick = () => {
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
			setCurrentQuestion(nextQuestion);
			ans = []
		} else {
			setShowScore(true);
		}
	};

	const restartChallenge = () => {
		setScore(0);
		setCurrentQuestion(0);
		setShowScore(false);
	}

	const getChallenge = () => {
        // Get all challenges from server
        fetch(`http://localhost:5000/challenge/read/${challengeId}`)
            .then(
                res => res.json()
                    .then(data => {
                        // Set challenges
                        setChallenge(data.questions);
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
					You scored {score} out of {challenge.length}
					<br />
					<br />
					<Button variant='outline-primary' onClick={() => restartChallenge()}>Redo Challenge</Button>
					<br />
					<br />
					<Link to='/challenges'>
						<Button variant='outline-primary'>Back To Challenges</Button>
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
							<div>{challenge[currentQuestion].text}</div>
							<div className={styles.answersection}>
							{	
								challenge[currentQuestion].isMultipleAns ?
								challenge[currentQuestion].options.map((answerOption, i) => (
									<div key={i + currentQuestion * 10} className={styles.button}>
										<input type="checkbox" className="btn-check" name="options" id={answerOption._id} />
										<label className="btn btn-outline-primary" htmlFor={answerOption._id} onClick={() => multipleAnswer(i)}>{answerOption.text}</label>
									</div>
								))
								:
								challenge[currentQuestion].options.map((answerOption, i) => (
									<div key={i + currentQuestion * 10} className={styles.button}>
										<input type="radio" className="btn-check" name="options" id={answerOption._id} />
										<label className="btn btn-outline-primary" htmlFor={answerOption._id} onClick={() => singleAnswer(i)}>{answerOption.text}</label>
									</div>
								))
							}
							</div>
							<label className="btn btn-outline-success" onClick={() => handleAnswerOptionClick()}>Next</label>
						</div>
					}
				</>
			}
			</div>
		</PageContainer>
	);
}

export default Challenge;