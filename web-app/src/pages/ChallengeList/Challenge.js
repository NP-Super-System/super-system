import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Challenge.module.css';

import { questions } from './ChallengeData.js';

const Challenge = props => {

	const { challengeId } = useParams();

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);

	const handleAnswerOptionClick = (isCorrect) => {
		if (isCorrect) {
			setScore(score + 1);
		}

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			setShowScore(true);
		}
	};

	return (
		<div className='container'>
			{
				showScore ?

				<div className='score-section'>
					You scored {score} out of {questions.length}
				</div>
				
				:

				<>
					<div className='question-section'>
						<div className='question-count'>
							<span>Question {currentQuestion + 1}</span>/{questions.length}
						</div>
						<div className='question-text'>{questions[currentQuestion].questionText}</div>
					</div>
					<div className='answer-section'>
						{
							questions[currentQuestion].answerOptions.map((answerOption, i) => (
								<button key={`${i}`} className={styles.button} onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
							))
						}
					</div>
				</>
			}
		</div>
	);
}

export default Challenge;