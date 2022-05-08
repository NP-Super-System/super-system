import React, {useState, useEffect} from 'react';
import {BrowserRouter, Link, useLocation} from 'react-router-dom';
import {Navbar as NavbarBS, Nav, NavItem, Container, Image} from 'react-bootstrap';

import styles from './Navbar.module.css';
import './NavbarBootstrap.css';

import { NavData } from '../NavData';

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
                        {
                            NavData.map( (item, i) => 
                                <NavItem key={`${i}`}>
                                    <Nav.Link href={item.to}>{item.title}</Nav.Link>
                                </NavItem>
                            )
                        }
                    </Nav>
                </NavbarBS.Collapse>
            </Container>
        </NavbarBS>
    );
}

export default Navbar;