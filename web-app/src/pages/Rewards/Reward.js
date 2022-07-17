import React, {useState, useEffect, useContext} from 'react'

const Reward = () => {
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
        
    </PageContainer>
  )
}

export default Reward