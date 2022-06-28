import React, { useState, useEffect, useContext } from 'react';

import styles from './Game.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';

import { Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

const Game = props=>{
    const { user: userCtx } = useContext(GlobalContext);
    const [userId, setUserId] = useState();

    const [food , setFood ] = useState(1);
    const [cleanliness , setCleanliness ] = useState(1);
    const [happiness , setHappiness ] = useState(1);
    const [level , setLevel ] = useState(1);

    const checkHappy = () => {
        if (happiness < 10 ) {
            setHappiness(happiness + 1)
        } else if (food == 10 && cleanliness == 10 && happiness == 10) {
            setLevel(level + 1);
            setFood(0);
            setCleanliness(0);
            setHappiness(0);
        } else {
            alert("Harry likes being pet, but not THIS much")
        }
    }

    const checkFood = () => {
        if (food < 10 ) {
            setFood(food + 1)
        } else if (food == 10 && cleanliness == 10 && happiness == 10) {
            setLevel(level + 1);
            setFood(0);
            setCleanliness(0);
            setHappiness(0);
        } else {
            alert("Harry feels like he is bursting at the seams")
        }
    }

    const checkClean = () => {
        if (cleanliness < 10 ) {
            setCleanliness(cleanliness + 1)
        } else if (food == 10 && cleanliness == 10 && happiness == 10) {
            setLevel(level + 1);
            setFood(0);
            setCleanliness(0);
            setHappiness(0);
        } else {
            alert("Harry feels SQUEAKY clean!")
        }
    }

    useEffect(()=>{
        fetch(`http://localhost:5000/user/read/?userId=${userCtx.id}`)
            .then(res => {
                res.json()
                    .then(data => {
                        console.log(data);
                        setUserId(data._id);
                        setLevel(data.pet.level);
                        setFood(data.pet.food);
                        setCleanliness(data.pet.cleanliness);
                        setHappiness(data.pet.happiness);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));

    }, []);

    const handleSubmit = e => {
        const options = {
            method: 'POST',
            body: JSON.stringify({
               level,
               food,
               cleanliness,
               happiness, 
            }),
        }
        fetch('http://localhost:5000/pet/update', options)
            .then(res => console.log(res))
            .catch(err => console.log(err));
        return false;
    }

    return (
        <PageContainer>
            <div className={styles.contents + " container"}>
                <div className="row align-items-start">
                    <div className={styles.stats + " col align-self-center" }>
                        <h1>Harry the Hamster</h1>
                        <h2>Level = {level}</h2>
                        <p>Happiness = {happiness}</p>
                        <p>Food Received = {food}</p>
                        <p>Cleanliness = {cleanliness}</p>
                    </div>
                </div>

                <div className ="row align-items-center">
                    <div className ="col">
                        <Image className={styles.icon} src='media/game/soap.png' onClick={checkClean}></Image>
                        <label style={{color: 'palevioletred'}}>Clean Me!</label>
                    </div>
                    <div className="col">
                    <label style={{color: 'green'}}>Feed Me!</label>
                    <Image className={styles.icon} src='media/game/food.png' onClick={checkFood}></Image>
                    </div>
                </div>
        
                <div className=" row align-items-end">
                    <div className=" col align-self-center">
                        <Image src='media/game/vpet.png' onMouseOver={checkHappy}></Image>
                        <p className={styles.petLabel}>Pet Me to Make Me Happy!</p>
                    </div>  
                    {/* <form onSubmit={handleSubmit}>
                        <input type='hidden' name='userId' value={userId}/>
                        <input type='hidden' name='food' value={parseInt(hunger)}/>
                        <input type='hidden' name='level' value={parseInt(level)}/>
                        <input type='hidden' name='cleanliness' value={parseInt(cleanliness)}/>
                        <input type='hidden' name='happiness' value={parseInt(happiness)}/>
                        <Button type='submit'>Save Progress</Button>
                    </form> */}
                </div>

            </div>
            
        </PageContainer>
    );
}

export default Game;