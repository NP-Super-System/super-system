import React from 'react';

import styles from './MyCourses.module.css';
import { Card, ProgressBar } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { CourseData } from './MyCoursesData';


class MyCourses extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        function variant(progress) {
            if (progress > 66) {
                return ''
            }
            if (progress > 33) {
                return 'warning'
            }
            return 'danger'
        }

        return (
            <Card className={styles.bigCard}>     
                <Card.Title>My Courses</Card.Title>

                {/* VERSION 1 - PICTURE ON TOP (SIMILAR TO POLITEMALL) */}
                {/* <div className={styles.cardList}>
                    {CourseData.map((item, index) =>
                        <Link key={`${index}`} to={`/home/${item.code}`} className={styles.link}>
                            <Card className={styles.smallCard}>
                                <Card.Img variant="top" src={item.pic} />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        {item.desc}
                                    </Card.Text>
                                    <ProgressBar now={item.progress} label={`${item.progress}%`} />
                                </Card.Body>
                            </Card>  
                        </Link>
                    )}  
                </div> */}
                
                {/* VERSION 2 - PICTURE ON THE LEFT */}
                <div className={styles.wrapper}>
                    {
                        CourseData.map( (item, i)=>{
                            return <Link key={`${i}`} to={`/home/${item.code}`} className={styles.course_link}>
                                <img className={styles.course_img} src={item.pic} alt="Course"/>
                                {/* <img className={styles.course_img} src={require(item.pic)}/> */}
                                <div className={styles.course_content}>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        {item.desc}
                                    </Card.Text>
                                    <ProgressBar variant={variant(item.progress)} now={item.progress} label={`${item.progress}%`} />
                                </div>
                            </Link>
                        } )
                    }
                </div>
                            
            </Card>
        )
    }
}

export default MyCourses;