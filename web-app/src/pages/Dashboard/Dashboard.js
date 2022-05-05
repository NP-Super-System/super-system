import React from 'react';

import styles from './Dashboard.module.css';

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
            <div className='container'>
                <Container>
                    <Row>
                        <Col><MyCourses /></Col>
                        <Col>
                            <Announcements />
                            <br />
                            <Deadline />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Dashboard;