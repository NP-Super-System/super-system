import React, { useState, useEffect, useContext } from 'react';
import { getPostAge } from '../../hooks/getPostAge';
import { BsFillTrash2Fill, BsPencilFill, BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import parse from 'html-react-parser';

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
    const { user } = useAuth0();
    const [userRoles, setUserRoles] = useState(null);
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

        console.log(`Deleting announcement...`);

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
            return <span className={styles.user_name}>{getPostAge(item.createdAt)}</span>
        }
        return <span className={styles.user_name}>{getPostAge(item.updatedAt)}</span>
    }

    const isOwner = (index) => {
        if (user.id === announcements[index].user._id || userRoles.includes('Admin')) {
            return true;
        }
        return false;
    }

    return (
        <Card className={styles.wrapper}>
            <Card.Title>
                Announcements
            {
                userRoles?.some(role => role === 'Admin' || role === 'Lecturer') &&
                <Link to='/home/announcement/create'>
                    <Button
                        variant='primary'
                        className={styles.create_button}>
                        <IoAddSharp className={styles.create_icon} />
                    </Button>
                </Link>
            }
                <Button
                    variant='outline-secondary'
                    className={styles.collaspible_button}
                    onClick={isCollapsed ? () => { setCollapsedState(false); } : () => { setCollapsedState(true); }}>
                    {isCollapsed ? <BsFillCaretDownFill /> : <BsFillCaretUpFill />}
                </Button>
            </Card.Title>
            {
                isCollapsed ||
                announcements.sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1).map((item, index) =>
                    <div key={`${index}`}>
                        {
                            index < (showMore ? 1 : announcements.length) ?
                                <div className={styles.announcement}>
                                    <div className={styles.tags}>
                                    {
                                        item.tags.map((tag, i) => {
                                            return <div key={`${i}`} className={styles.tag}>
                                                {tag}
                                            </div>
                                        })
                                    }
                                    </div>
                                    <div className={styles.announcementText}>
                                        <h5 className={styles.announcement_title}>{item.title}</h5>
                                        <div className={styles.announcement_desc}>
                                            {parse(item.body)}
                                        </div>
                                        <div className={styles.user_content}>{displayMessage(item)}</div>
                                    </div>
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
    )

}

export default Announcements;