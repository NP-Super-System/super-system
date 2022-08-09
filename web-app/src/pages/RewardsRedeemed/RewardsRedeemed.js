import React, { useState, useEffect, useContext } from 'react';
import { Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import styles from './RewardsRedeemed.module.css';

import PageContainer from '../../layout/PageContainer';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import { useScreenType } from '../../hooks/useScreenType';
import GlobalContext from '../../context/GlobalContext';
import RedeemedComponent from './RedeemedComponent';

const RewardsRedeemed = props => {
    const { user } = useContext(GlobalContext);

    const screenType = useScreenType();

    const [searchFilter, setSearchFilter] = useState('');
	const handleSearch = e => {
		e.preventDefault();
	}

    const [rewards, setRewards] = useState([]);
    const [visibleRewards, setVisibleRewards] = useState([]);

    async function getRedeemedRewards(){
        fetch(`http://localhost:5000/reward/read/redeemed?userId=${user?.id}`)
            .then(res => res.json()
                .then(data => {
                    console.log(data);
                    const { user, redeemedRewards } = data;
                    setRewards(redeemedRewards);
                    setVisibleRewards(redeemedRewards);
                })
                .catch(err => {
                    toast.error(err);
                    console.log(err);
                })
            )
            .catch(err => {
                toast.error(err);
                console.log(err);
            });
    }

    
    useEffect(()=>{
        console.log(visibleRewards);
    }, [visibleRewards]);
    useEffect(()=>{
        if(!user) return;
        getRedeemedRewards();
    }, [user]);

    return (
        <PageContainer>
            <PageHeader
                searchBarElement={
                    <SearchBar text={searchFilter} handleChange={text => setSearchFilter(text)} handleSearch={handleSearch}/>
                }
                screenType={screenType}>
				<Link to='/rewards/'>
                    <Button
                        variant='primary'
                        className={`${styles.action_btn} ${styles.rewards_link}`}>
                        View All
                    </Button>
                </Link>
            </PageHeader>
            <div className={styles.wrapper}>
                <h3 className={styles.title}>My Redeemed Rewards</h3>
                <div className={styles.rewards}>
                {
                    visibleRewards.map((reward, i) => {
                        return <RedeemedComponent key={`${i}`} {...reward}/>
                    })
                }
                </div>
            </div>
        </PageContainer>
    )
}

export default RewardsRedeemed;