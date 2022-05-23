import React, {useState, useEffect, useContext} from 'react';
import { getPostAge } from '../../modules/getPostAge';
import { BsFillTrash2Fill, BsPencilFill } from 'react-icons/bs';

import styles from './Announcements.module.css';
import { Card, Image } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { AnnouncementsData } from './AnnouncementsData';
import { IoAddSharp } from 'react-icons/io5';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2'


const Announcements = props => {    
    const [announcements, setAnnouncements] = useState([]);

    useEffect((userId)=>{
        getAnnouncements(userId);
    }, []);

    const Swal = require('sweetalert2')

    const getAnnouncements = userId => {
        // Get all announcements from server
        fetch('http://localhost:5000/announcement/read')
            .then(
                res => res.json()
                    .then(data => {
                        // Set announcements
                        console.log(data);
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
            body: JSON.stringify({ userId, itemId}),
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

    const displayMessage = (user, create, update) => {
        if (create === update) {
            return <span className={styles.user_name}>Created By: {user} {getPostAge(create)}</span>
        }
        return <span className={styles.user_name}>Updated By: {user} {getPostAge(update)}</span>
        
    }

    return (
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
            </Card.Title>       
            {
                announcements.map((item, index) => 
                    <div key={`${index}`} className={styles.announcement}>
                        <Link to={`/home/announcement/${item.to}`} className={styles.announcementText}>
                            <div className={styles.user_content}>
                                {displayMessage(item.user.userName, item.createdAt, item.updatedAt)}
                            </div>
                            <h5 className={styles.announcement_title}>{item.title}</h5>
                            <span className={styles.announcement_desc}>{item.body}</span>
                        </Link>
                        <div className={styles.buttons}>
                            <Link to='/home/announcement/update'>
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
    )
    
}

export default Announcements;