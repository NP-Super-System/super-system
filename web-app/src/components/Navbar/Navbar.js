import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {ProSidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import {BsArrowBarLeft, BsArrowBarRight} from 'react-icons/bs';

import styles from './Navbar.module.css';
import 'react-pro-sidebar/dist/css/styles.css';

import { NavbarData } from './NavbarData';

class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: true,
        }
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.expandSidebar = this.expandSidebar.bind(this);
        this.collapseSidebar = this.collapseSidebar.bind(this);
    }
    expandSidebar(e){
        this.setState({collapsed: false});
    }
    collapseSidebar(e){
        this.setState({collapsed: true});
    }
    toggleSidebar(e){
        e.preventDefault();

        this.setState({collapsed: !this.state.collapsed});
    }
    render(){
        return (
            <ProSidebar className={`${styles.sidebar} ${this.state.collapsed ? styles.collapsed : ''}`} onMouseEnter={this.expandSidebar} onMouseLeave={this.collapseSidebar}>
                {/* <Menu iconShape='circle'>
                    <MenuItem icon={this.state.collapsed ? <BsArrowBarRight /> : <BsArrowBarLeft />} onClick={this.toggleSidebar}></MenuItem>
                </Menu> */}
                <Menu iconShape='square'>
                    {
                        NavbarData.map( (item, i)=>{
                            return <MenuItem key={`${i}`} icon={item.icon}>
                                {item.title}
                                <Link to={item.to} />
                            </MenuItem>
                        } )
                    }
                </Menu>
            </ProSidebar>
        );
    }
}

export default Navbar;