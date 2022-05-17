import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from 'react-bootstrap';
import styles from './Challenge.module.css';

import PageContainer from '../../layout/PageContainer';
import { questions } from './ChallengeData.js';
import { Link } from "react-router-dom";

const Challenge = props => {
	
	const { challengeId } = useParams();

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);

	var ans = []

	const clickAnswer = (id) => {
		if (ans.includes(id)) {
			if (ans.length === 1) {
				ans = []
			}
			ans.splice(ans.findIndex(answer => answer === id), 1)
		}
		else {
			ans = ans.concat(id);
		}
	}

	const handleAnswerOptionClick = (answer) => {
		let numBerComparator = (a, B) => a - B
		ans = ans.sort(numBerComparator)
		if (JSON.stringify(ans) === JSON.stringify(answer)) {
			setScore(score + 1);
		}

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions[challengeId].length) {
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

	return (
		<PageContainer>
			<div className={styles.challenge}>

			{
				showScore ?

				<div>
					You scored {score} out of {questions[challengeId].length}
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
					<div>
						<div>
							<span>Challenge {currentQuestion + 1}</span>/{questions[challengeId].length}
						</div>
						<div>{questions[challengeId][currentQuestion].questionText}</div>
					</div>
					<div className={styles.answersection}>
						{
							questions[challengeId][currentQuestion].answerOptions.map((answerOption, i) => (
								<div key={i + currentQuestion * 10} className={styles.button}>
									<input type="checkbox" className="btn-check" name="options" id={answerOption.id} />
									<label className="btn btn-outline-primary" htmlFor={answerOption.id} onClick={() => clickAnswer(answerOption.id)}>{answerOption.answerText}</label>
								</div>
							))
						}
					</div>

					<label className="btn btn-outline-success" onClick={() => handleAnswerOptionClick(questions[challengeId][currentQuestion].answer)}>Next</label>
				</>
			}
			</div>
		</PageContainer>
	);
}

export default Challenge;