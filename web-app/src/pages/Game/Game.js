import React, { useState, useEffect } from 'react';

import styles from './Game.module.css';

import PageContainer from '../../layout/PageContainer';

import { Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

const Game = props=>{
    const [hunger , setHunger ] = useState(1);
    const [cleanliness , setCleanliness ] = useState(1);
    const [happiness , setHappiness ] = useState(1);
    const [level , setLevel ] = useState(1);

    const checkHappy = () => {
        if (happiness < 10 ) {
            setHappiness(happiness + 1)
        } else {
            alert("Harry likes being pet, but not THIS much")
        }
    }

    const checkHunger = () => {
        if (hunger < 10 ) {
            setHunger(hunger + 1)
        } else {
            alert("Harry feels like he is bursting at the seams")
        }
    }

    const checkClean = () => {
        if (cleanliness < 10 ) {
            setCleanliness(cleanliness + 1)
        } else {
            alert("Harry feels SQUEAKY clean!")
        }
    }

    useEffect(() => {
        if (hunger == 10 && cleanliness == 10 && happiness == 10) {
            setLevel(level + 1);
            setHunger(0);
            setCleanliness(0);
            setHappiness(0);
        }
        console.log(hunger, cleanliness,  happiness, level);
    }, [hunger, cleanliness, happiness]);
    
    

    return (
        <PageContainer>
            <div className={styles.contents} class="container">
                <div class="row align-items-start">
                    <div className={styles.stats} class="col align-self-center">
                        <h1>Harry the Hamster</h1>
                        <h2>Level = {level}</h2>
                        <p>Happiness = {happiness}</p>
                        <p>Food Received = {hunger}</p>
                        <p>Cleanliness = {cleanliness}</p>
                    </div>
                </div>

                <div class="row align-items-center">
                    <div class="col">
                        <Image className={styles.icon} src='media/game/soap.png' onClick={checkClean}></Image>
                        <label style={{color: 'palevioletred'}}>Clean Me!</label>
                    </div>
                    <div class="col">
                    <label style={{color: 'green'}}>Feed Me!</label>
                    <Image className={styles.icon} src='media/game/food.png' onClick={checkHunger}></Image>
                    </div>
                </div>
        
                <div class="row align-items-end">
                    <div class="col align-self-center">
                        <Image src='media/game/vpet.png' onMouseOver={checkHappy}></Image>
                        <p className={styles.petLabel}>Pet Me to Make Me Happy!</p>
                    </div>  
                </div>

            </div>
            
        </PageContainer>
    );
}

export default Game;