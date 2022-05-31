import React, { useState, useEffect } from 'react';

import styles from './Game.module.css';

import PageContainer from '../../layout/PageContainer';

import { Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

const Game = props=>{
    const [hunger , setHunger ] = useState(1);
    const [cleanliness , setCleanliness ] = useState(1);
    const [health , setHealth ] = useState(1);
    const [happiness , setHappiness ] = useState(1);
    const [level , setLevel ] = useState(1);

    useEffect(() => {
        if (hunger == 10 && cleanliness == 10 && health == 10 && happiness == 10) {
            setLevel(level + 1);
            setHunger(0);
            setCleanliness(0);
            setHealth(0);
            setHappiness(0);
        }
        console.log(hunger, cleanliness, health, happiness, level);
    }, [hunger, cleanliness, health, happiness]);
    

    return (
        <PageContainer>
            <h1>Game</h1>
            <div>
                <p>Level = {level}</p>
                <p>Hunger = {hunger} </p>
                <p>Cleanliness = {cleanliness} </p>
                <p>Health = {health} </p>
                <p>Happiness = {happiness} </p>
            </div>
            <div>
                <Image src='media/game/vpet.png'></Image>
            </div>
            <div>
                <Button variant='primary' onClick = {() => {
                    if (hunger < 10 ) {
                        setHunger(hunger + 1)
                    }
                }}>Feed Pet</Button>

                <Button variant='danger' onClick = {() => {
                    if (cleanliness < 10 ) {
                        setCleanliness(cleanliness + 1)
                    }
                }}>Scrub Pet</Button>

                <Button variant='success'onClick = {() => {
                    if (health < 10 ) {
                        setHealth(health + 1)
                    }
                }}>Heal Pet</Button>

                <Button variant='warning'onClick = {() => {
                    if (happiness < 10 ) {
                        setHappiness(happiness + 1)
                    }
                }}>Stroke Pet</Button>
            </div>
            
        </PageContainer>
    );
}

export default Game;