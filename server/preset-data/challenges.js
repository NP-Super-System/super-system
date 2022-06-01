const Challenge = require('../models/challenge/Challenge');
const Questions = require('../models/challenge/Question');
const Option = require('../models/challenge/Option');
const Question = require('../models/challenge/Question');


// init course data

const challengesList = [
    // Challenge 1
    {
        user: "628c5ddf589c03766c446dec",
        title: 'Challenge 1',
        pointCount: 100,
        rating: 4,
        questions: [
            new Question(
                {
                    isMultipleAns: false,
                    text: 'What is the capital of France?',
                    options: [
                        new Option({
                            text: 'New York',
                            isCorrect: false,
                        }),
                        new Option({
                            text: 'London',
                            isCorrect: false,
                        }),
                        new Option({
                            text: 'Paris',
                            isCorrect: true,
                        }),
                        new Option({
                            text: 'Dublin',
                            isCorrect: false,
                        }),
                    ],
                },
            ),
            new Question(
                {
                    isMultipleAns: false,
                    text: 'Who is CEO of Tesla?',
                    options: [
                        new Option({
                            text: 'Jeff Bezos',
                            isCorrect: false,
                        }),
                        new Option({
                            text: 'Elon Musk',
                            isCorrect: true,
                        }),
                        new Option({
                            text: 'Bill Gates',
                            isCorrect: false,
                        }),
                        new Option({
                            text: 'Tony Stark',
                            isCorrect: false,
                        }),
                    ],
                },
            )
        ]
    }
]

// add challenges

async function addChallenges(){
    for (var challengeData of challengesList){
        console.log(challengeData);
        const challenge = new Challenge(challengeData);
        try{
            const result = await challenge.save();
            console.log(`Added challenge: ${result}`)
        }
        catch(err){
            console.log(err);
        }
        finally{
            continue;
        }
    }
}

addChallenges();