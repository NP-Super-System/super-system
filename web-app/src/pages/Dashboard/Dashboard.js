import React from 'react';
import MyCourses from '../../components/MyCourses/MyCourses';
import styles from './Dashboard.module.css';

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