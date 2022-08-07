import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Image, Card } from "react-bootstrap";
import { Link } from 'react-router-dom';

import styles from './Rewards.module.css';

import PageContainer from '../../layout/PageContainer';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import { useScreenType } from '../../hooks/useScreenType';
import RewardComponent from './RewardComponent';
import GlobalContext from '../../context/GlobalContext';

const Rewards = props => {
	const { user } = useContext(GlobalContext);

	const [rewards, setRewards] = useState([]);
	const [visibleRewards, setVisibleRewards] = useState([]);

	const fetchRewardsData = async () => {
		// Get all rewards from server
		fetch('http://localhost:5000/reward/read')
			.then(
				res => res.json()
					.then(data => {
						// Set rewards
						console.log(data);
						setRewards(data);
						setVisibleRewards(data);
					})
					.catch(err => console.log(err))
			)
			.catch(err => console.log(err));
	}

	const [searchFilter, setSearchFilter] = useState('');
	const handleSearch = searchValue => {
		// e.preventDefault();
		setSearchFilter(searchValue);

		console.log(searchValue);

		if(searchValue === ''){
			setVisibleRewards(rewards);
			return;
		}

		let newRewards = [...rewards].filter(reward => {
			const { name } = reward;
			const hasMatch = name.split(' ').some(word => {
				return word.toLowerCase().startsWith(searchValue.toLowerCase());
			});
			return hasMatch;
		});
		console.log(newRewards);

		setVisibleRewards(newRewards);
	}

	const [coinCount, setCoinCount] = useState(null);
	const fetchUserCoins = async () => {
		if(!user) return;
		console.log('fetch user coins');

		fetch(`http://localhost:5000/user/read?userId=${user._id}`)
			.then(
				res => res.json()
					.then(data => {
						console.log(`User coins: ${data.coinCount}`);
						setCoinCount(data.coinCount);
					})
					.catch(err => console.log(err))
			)
			.catch(err => console.log(err));
	}

	useEffect(() => {
		fetchRewardsData();
		fetchUserCoins();
	}, []);

	const screenType = useScreenType();

	return (
		<PageContainer>
			<PageHeader
                searchBarElement={
                    <SearchBar text={searchFilter} handleChange={text => handleSearch(text)} handleSearch={e => e.preventDefault()}/>
                }
                screenType={screenType}>
				<Link to='/rewards/redeemed'>
                    <Button
                        variant='primary'
                        className={`${styles.action_btn} ${styles.redeemed_link}`}>
                        Redeemed
                    </Button>
                </Link>
            </PageHeader>
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<div className={styles.text}>
						<h3 className={styles.title}>Rewards</h3>
						<span className={styles.subtitle}>Click a reward to find out more!</span>
					</div>
					<div className={styles.user}>
						<Image
							className={styles.icon}
							src={'/media/coin.png'}/>
						<span className={styles.coins}>{coinCount || '-'}</span>
					</div>
				</div>
			{
				visibleRewards.length > 0 ?
				<div className={styles.rewards}>
				{
					visibleRewards.map((reward, i) => {
						return <RewardComponent 
							key={`${i}`} 
							{...reward} 
							fetchUserCoins={fetchUserCoins}/>
					})
				}
				</div>

				:

				<span className={styles.no_rewards_text}>No rewards found</span>
			}
			</div>
		</PageContainer>
	)
}

export default Rewards
