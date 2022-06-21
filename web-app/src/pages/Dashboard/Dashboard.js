import React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './Dashboard.module.css';

import PageContainer from '../../layout/PageContainer';
import Courses from './Courses';
import Announcements from './Announcements';
import Deadlines from './Deadlines';
import TodoList from './TodoList';

class Dashboard extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <PageContainer>
                <Row>
                    <Col>
                        <Courses />
                    </Col>
                    <Col>
                        <TodoList />
                        <Announcements />
                        <Deadlines />
                    </Col>
                </Row>
            </PageContainer>
        );
    }
}

export default Dashboard;