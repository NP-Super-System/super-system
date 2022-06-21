import React, { useState, useEffect, useContext } from 'react';
import { getPostAge } from '../../hooks/getPostAge';
import { BsFillTrash2Fill, BsPencilFill, BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';

import styles from './Announcements.module.css';
import { Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { IoAddSharp, IoExpand } from 'react-icons/io5';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';


const Announcements = props => {
    const Swal = require('sweetalert2')
    const [announcements, setAnnouncements] = useState([]);
    const [isCollapsed, setCollapsedState] = useState(false);
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [userRoles, setUserRoles] = useState(false);
    const [showMore, setShowMore] = useState(true);

    useEffect((userId) => {
        getUser();
        getAnnouncements(userId);
    }, []);

    const getUser = async userEmail => {
        const getUserUrl = `http://localhost:5000/get-user/${user.email}`;

        const res = await fetch(getUserUrl);
        const userData = await res.json();
        setUserRoles(userData.userRoles);
    }

    const getAnnouncements = () => {
        // Get all announcements from server
        fetch('http://localhost:5000/announcement/read')
            .then(
                res => res.json()
                    .then(data => {
                        // Set announcements
                        console.log(data);
                        data.reverse()
                        setAnnouncements(data);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    const deleteAnnouncement = (userId, itemId) => {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ userId, itemId }),
        }

        console.log(`Deleting todo item...`);

        const deleteItemUrl = 'http://localhost:5000/announcement/delete';

        fetch(deleteItemUrl, options)
            .then(res => {
                console.log('Delete announcement');
                getAnnouncements(userId);
            })
            .catch(err => console.log(err));
    }

    const deleteBtn = (userId, itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your announcement has been deleted.',
                    'success'
                )
                deleteAnnouncement(userId, itemId)
            }
        })
    }

    const displayMessage = (item) => {
        if (item.createdAt === item.updatedAt) {
            return <span className={styles.user_name}>Created By: {item.user.userName} {getPostAge(item.createdAt)}</span>
        }
        return <span className={styles.user_name}>Updated By: {item.userUpdate} {getPostAge(item.updatedAt)}</span>
    }

    const isOwner = (index) => {
        if (user.email === announcements[index].user.userEmail || userRoles.includes('Admin')) {
            return true;
        }
        return false;
    }

    const showAnnouncements = () => {
        return (
            isCollapsed ||
            announcements.sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1).map((item, index) =>
                <div key={`${index}`}>
                    {
                        index < (showMore ? 2 : announcements.length) ?
                            <div className={styles.announcement}>
                                <Link to={`/home/announcement/${item._id}`} className={styles.announcementText}>
                                    <div className={styles.user_content}>
                                        {displayMessage(item)}
                                    </div>
                                    <h5 className={styles.announcement_title}>{item.title}</h5>
                                    <span className={styles.announcement_desc}>{item.body}</span>
                                </Link>
                                <div className={styles.buttons}>
                                    {
                                        isOwner(index) ?
                                            <div>
                                                <Link to={`/home/announcement/update/${item._id}`}>
                                                    <Button
                                                        variant='primary'
                                                        className={styles.edit_btn}>
                                                        <BsPencilFill
                                                            className={styles.icon} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant='primary'
                                                    onClick={e => deleteBtn(item.user.userId, item._id)}
                                                    className={styles.delete_btn}>
                                                    <BsFillTrash2Fill
                                                        className={styles.icon} />
                                                </Button>
                                            </div>
                                            :
                                            <span></span>
                                    }
                                </div>
                            </div>
                            :
                            <span></span>
                    }
                </div>
            )
        )
    }

    return (
        <div>
            <Card className={styles.wrapper}>
                <Card.Title>
                    Announcements
                    <Link to='/home/announcement/create'>
                        <Button
                            variant='primary'
                            className={styles.create_button}>
                            <IoAddSharp className={styles.create_icon} />
                        </Button>
                    </Link>
                    <Button
                        variant='outline-secondary'
                        className={styles.collaspible_button}
                        onClick={isCollapsed ? () => { setCollapsedState(false); } : () => { setCollapsedState(true); }}>
                        {isCollapsed ? <BsFillCaretDownFill /> : <BsFillCaretUpFill />}
                    </Button>
                </Card.Title>
                {
                    showAnnouncements()
                }
                {
                    isCollapsed ?
                        <span></span>
                        :
                        showMore ?
                            <span className={styles.show} onClick={() => { setShowMore(false); }}>Show All</span>
                            :
                            <span className={styles.show} onClick={() => { setShowMore(true); }}>Show Less</span>
                }
            </Card>

            {/* {
        isCollapsed ?
            <Card className={styles.wrapper}>     
                <Card.Title>
                    Announcements
                    <Link to='/home/announcement/create'>
                        <Button 
                            variant='primary'
                            className={styles.create_button}>
                            <IoAddSharp className={styles.create_icon}/>
                        </Button>
                    </Link>
                    <Button 
                        variant='outline-secondary'
                        className={styles.collaspible_button}
                        onClick={() => expand()}>
                        <BsFillCaretDownFill />
                    </Button>
                </Card.Title> 
            </Card>
            :
            <Card className={styles.wrapper}>     
                <Card.Title>
                    Announcements
                    <Link to='/home/announcement/create'>
                        <Button 
                            variant='primary'
                            className={styles.create_button}>
                            <IoAddSharp className={styles.create_icon}/>
                        </Button>
                    </Link>
                    <Button 
                        variant='outline-secondary'
                        className={styles.collaspible_button}
                        onClick={() => collaspe()}>
                        <BsFillCaretUpFill />
                    </Button>
                </Card.Title>       
                {
                    announcements.sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1).map((item, index) => 
                        <div key={`${index}`} className={styles.announcement}>
                            <Link to={`/home/announcement/${item._id}`} className={styles.announcementText}>
                                <div className={styles.user_content}>
                                    {displayMessage(item.user.userName, item.createdAt, item.updatedAt)}
                                </div>
                                <h5 className={styles.announcement_title}>{item.title}</h5>
                                <span className={styles.announcement_desc}>{item.body}</span>
                            </Link>
                            <div className={styles.buttons}>
                                <Link to={`/home/announcement/update/${item._id}`}>
                                    <Button
                                        variant='primary'
                                        className={styles.edit_btn}>
                                        <BsPencilFill 
                                            className={styles.icon}/>
                                    </Button>
                                </Link>
                                <Button
                                    variant='primary'
                                    onClick={e => deleteBtn(item.user.userId, item._id)}
                                    className={styles.delete_btn}>
                                    <BsFillTrash2Fill 
                                        className={styles.icon}/>
                                </Button>
                            </div>
                        </div>
                    )
                }        
            </Card>
        } */}
        </div>
    )

}

export default Announcements;