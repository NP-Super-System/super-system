import React, {useState, useEffect, useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Navbar as NavbarBS, Nav, Container, Image} from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";

import styles from './Navbar.module.css';
import './NavbarBootstrap.css';

import { NavData } from '../NavData';
import GlobalContext from '../../context/GlobalContext';

const Navbar = props => {

    const { user } = useContext(GlobalContext);

    const [activeIndex, setActiveIndex] = useState(0);

    const location = useLocation();

    useEffect(()=>{
        const curPath = window.location.pathname.split('/')[1];
        const activeItem = NavData.findIndex(item => item.section === curPath);
        setActiveIndex(activeItem);
    }, [location]);

    return (
        <NavbarBS bg='dark' expand='lg' collapseOnSelect={true}>
            <Container>
                <NavbarBS.Brand>Super-System</NavbarBS.Brand>
                <NavbarBS.Toggle aria-controls="navbar-pages-nav">
                    <Image src="https://img.icons8.com/material-outlined/24/FFFFFF/menu--v1.png"/>
                </NavbarBS.Toggle>
                <NavbarBS.Collapse id='navbar-pages-nav'>   
                    <Nav>
                        {
                            NavData.map( (item, i) => 
                                <LinkContainer key={`${i}`} to={item.to} className={activeIndex === i ? styles.nav_item_active : styles.nav_item}>
                                    <Nav.Link>{item.title}</Nav.Link>
                                </LinkContainer>
                            )
                        }
                    </Nav>
                </NavbarBS.Collapse>
            </Container>
        </NavbarBS>
    );
}

export default Navbar;