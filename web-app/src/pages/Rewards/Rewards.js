<<<<<<< HEAD
import React, {useState, useEffect, useContext} from 'react';
import PageContainer from '../../layout/PageContainer'
import {FormControl} from "react-bootstrap"
import styles from './Rewards.module.css';

import { useScreenType } from '../../hooks/useScreenType';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);

  const getRewards = () => {
    // Get all rewards from server
    fetch('http://localhost:5000/rewards')
        .then(
            res => res.json()
                .then(data => {
                    // Set rewards
                    console.log(data);
                    setRewards(data);
                })
                .catch(err => console.log(err))
        )
        .catch(err => console.log(err));
}

useEffect(() => {
  getRewards();
}, []);

  return (
    <PageContainer>
      <div className='item-container'>
        {rewards.map((reward) => (
          <div className='card'>
            <h3>{reward.name}</h3>
            <p>{reward.description}</p>
            <p>{reward.cost}</p>
          </div>
        ))}
      </div>
        
    </PageContainer>
  )
}

export default Rewards
=======
import React, { useState, useEffect, useContext } from 'react';

import styles from './Rewards.module.css';

import PageContainer from '../../layout/PageContainer';

const Rewards = props => {
    useEffect(()=>{

    }, []);

    return (
        <PageContainer>
            <div className='wrapper'>
                Rewards Page
            </div>
        </PageContainer>
    )
}

export default Rewards;
>>>>>>> 2c85f90faaaedd6b7f1f98f2eab31f947896fdcb
