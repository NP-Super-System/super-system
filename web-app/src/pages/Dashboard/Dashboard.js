import React from 'react';

import styles from './Dashboard.module.css';

import MyCourses from '../../components/MyCourses/MyCourses';

class Dashboard extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className='container'>
                Dashboard
                <MyCourses />
            </div>
        );
    }
}

export default Dashboard;