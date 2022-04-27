import React from 'react';

import styles from './Deadlines.module.css';
import Card from "react-bootstrap/Card";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { DeadlinesData } from './DeadlinesData';


class Deadlines extends React.Component{
    constructor(props) {
        super(props);
    }

    render(props) {
        return (
            <div>
                <Card className={styles}>     
                    <Card.Title>Deadlines</Card.Title>       
                    {DeadlinesData.map((item, index) => 
                        <p><b>{item.date} {item.title}</b> <br /> {item.desc} <br /></p>
                        // <Link key={`${index}`} to={`/home/${item.code}`} className={styles.link}>
                            
                        // </Link>   
                    )}  
                             
                </Card>
            </div>
        )
    }
}

export default Deadlines;