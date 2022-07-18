import React, { useState, useEffect, useContext } from 'react';
import { Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import styles from './RewardsRedeemed.module.css';

import PageContainer from '../../layout/PageContainer';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import { useScreenType } from '../../hooks/useScreenType';

const RewardsRedeemed = props => {

    const screenType = useScreenType();

    const [searchFilter, setSearchFilter] = useState('');
	const handleSearch = e => {
		e.preventDefault();
	}

    useEffect(()=>{

    }, []);

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
                <h3 className={styles.title}>Redeemed Rewards</h3>
            </div>
        </PageContainer>
    )
}

export default RewardsRedeemed;