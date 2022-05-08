import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Navbar as NavbarBS, Nav, Container, Image} from 'react-bootstrap';

import styles from './Navbar.module.css';
import './NavbarBootstrap.css';

const Navbar = props => {

    useEffect(() => {

    }, []);

    return (
        <NavbarBS bg='dark' expand='lg'>
            <Container>
                <NavbarBS.Brand>SUPER-SYSTEM</NavbarBS.Brand>
                <NavbarBS.Toggle aria-controls="navbar-pages-nav">
                    <Image src="https://img.icons8.com/material-outlined/24/FFFFFF/menu--v1.png"/>
                </NavbarBS.Toggle>
                <NavbarBS.Collapse id='navbar-pages-nav'>
                    <Nav>
                        <Nav.Link>Dashboard</Nav.Link>
                        <Nav.Link>Calendar</Nav.Link>
                        <Nav.Link>Forum</Nav.Link>
                    </Nav>
                </NavbarBS.Collapse>
            </Container>
        </NavbarBS>
    );
}

export default Navbar;