import React from 'react';

import styles from './Dashboard.module.css';

import PageContainer from '../../layout/PageContainer';
import MyCourses from '../../components/MyCourses/MyCourses';
import Announcements from '../../components/Announcements/Announcements'
import Deadline from '../../components/Deadlines/Deadlines'
import { Container, Row, Col } from 'react-bootstrap';

class Dashboard extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <PageContainer>
                <Row>
                    <Col><MyCourses /></Col>
                    <Col>
                        <Announcements />
                        <Deadline />
                    </Col>
                </Row>
            </PageContainer>
        );
    }
}

export default Dashboard;