import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import PageContainer from '../../layout/PageContainer';
import styles from './Roles.module.css';
import { Button } from 'react-bootstrap';


const Roles = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-2);

    const [users, setUsers] = useState([]);

    useEffect(()=>{
        getUsers();
    }, []);

    const getUsers = () => {
        // Get users
        fetch('http://localhost:5000/user/all/read')
            .then(
                res => res.json()
                    .then(data => {
                        // Set users
                        console.log(data);                        
                        setUsers(data);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }
    
    return (
        <PageContainer>
            <Button 
                variant='outline-primary' 
                className={styles.backBtn}
                onClick={goBack}>
                <BsFillArrowLeftCircleFill />
            </Button>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>User Role(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => 
                            <tr key={index}>
                                <td>{user.userName}</td>
                                <td>{user.userEmail}</td>
                                <td>
                                    {
                                        user.userRoles.length === 0 ?
                                        'User has no roles'
                                        :
                                        user.userRoles.length === 2 ?
                                        `${user.userRoles[0]}, ${user.userRoles[1]}`
                                        :
                                        user.userRoles.length === 3 ?
                                        `${user.userRoles[0]}, ${user.userRoles[1]}, ${user.userRoles[2]}`
                                        :
                                        user.userRoles
                                    }
                                </td>
                                <td>
                                    <Link to={`/roles/update/${user._id}`}>
                                        <Button variant='outline-primary'>
                                            Edit User Roles
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </PageContainer>
    )
}

export default Roles;