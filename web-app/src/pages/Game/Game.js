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
    const [img, setImg] = useState('media/game/harry.png');
    const [warning, setWarning] = useState();

    const handleSubmit = e => {
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                userId: userCtx.id,
                level,
                food,
                cleanliness,
                happiness, 
            }),
        }
        fetch(`http://localhost:5000/pet/update/`, options)
        .then(res => {
            res.json()
                .then(data => {
                    console.log(data, data.pet.level);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }

    const checkHappy = () => {
        if (happiness < 10 ) {
            setHappiness(happiness => happiness + 1);
            setWarning();
        } else if (food == 10 && cleanliness == 10 && happiness == 10) {
            setLevel(level => level + 1);
            setFood(0);
            setCleanliness(0);
            setHappiness(0);
            setWarning();
        } else {
            setWarning("Harry is tired now, try something else!")
        }
        setImg('media/game/harry.png')
        handleSubmit();
    }

    const checkFood = () => {
        if (food < 10 ) {
            setFood(food => food + 1);
            setWarning();
        } else if (food == 10 && cleanliness == 10 && happiness == 10) {
            setLevel(level => level + 1);
            setFood(0);
            setCleanliness(0);
            setHappiness(0);
            setWarning();
        } else {
            setWarning("Harry feels like he is about to explode, why not try another activity?")
        }
        setImg('media/game/eating.png')
        handleSubmit();
    }

    const checkClean = () => {
        if (cleanliness < 10 ) {
            setCleanliness(cleanliness => cleanliness + 1);
            setWarning();
        } else if (food == 10 && cleanliness == 10 && happiness == 10) {
            setLevel(level => level + 1);
            setFood(0);
            setCleanliness(0);
            setHappiness(0);
            setWarning();
        } else {
            setWarning("Harry is very clean already, stop scrubbing!")
        }
        setImg('media/game/bathing.png')
        handleSubmit();
    }

    useEffect(handleSubmit,[level, food, cleanliness, happiness])

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

    

    return (
        <PageContainer>
            <div className={styles.contents + " container"}>
                <div className={styles.name + " row align-items-start"}>
                    <Image src='media/game/text.gif' className={styles.textGif}></Image>
                    <h1><i>is currently level </i><b>{level}</b></h1>
                    <h3 className={styles.warn}>{warning}</h3>
                </div>

                <div className ="row align-items-center">
                    <div className = {styles.stats + " col"} >
                        <p className={styles.statLabel}>happiness: {happiness}/10 </p>
                        <p className={styles.statLabel}>cleanliness: {cleanliness}/10</p>
                        <p className={styles.statLabel}>food received: {food}/10 </p>
                    </div>
                    <div className=" col">
                        <Image src={img} className={styles.petImage}></Image>
                    </div>  
                    <div className=" col">
                        <div className = " row align-items-top">
                            <Image className={styles.icon} src='media/game/hand.png' onClick={checkHappy}></Image>
                        </div>
                        <div className = " row align-items-center">
                            <Image className={styles.icon} src='media/game/soap.png' onClick={checkClean}></Image>
                        </div>
                        <div className = " row align-items-bottom">
                            <Image className={styles.icon} src='media/game/food.png' onClick={checkFood}></Image>
                        </div>
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