import React, {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import PageContainer from '../../layout/PageContainer';
import styles from './EditUserRoles.module.css';
import { Form, Button } from 'react-bootstrap';


const EditUserRoles = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    const { userId } = useParams();

    const [user, setUser] = useState([]);

    const [roles, setRoles] = useState([]);

    const [userRoles, setUserRoles] = useState([]);

    const [isLoaded, setIsLoaded] = useState('loading');


    useEffect(()=>{
        getUser();
        getRoles();
    }, []);

    const getUser = () => {
        fetch(`http://localhost:5000/get-userId/${userId}`)
            .then(
                res => res.json()
                    .then(data => {
                        console.log(data);
                        setUser(data);
                        setUserRoles(data.userRoles);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    const getRoles = () => {
        fetch(`http://localhost:5000/roles/read`)
            .then(
                res => res.json()
                    .then(data => {
                        setRoles(data);
                        setIsLoaded(true);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }
    
    const handleRoleChange = (index) => {
        const newUserRolesList = [...userRoles];
        if (newUserRolesList.includes(roles[index].roleName)) {
            newUserRolesList.splice(newUserRolesList.findIndex(role => role === roles[index].roleName), 1);
        }
        else {
            newUserRolesList.push(roles[index].roleName);
        }
        setUserRoles(newUserRolesList);
    }

    const isChecked = (index) => {
        if (userRoles.includes(roles[index].roleName)) {
            return true;
        }
        return false;
    }

    const onSubmit = async e => {
        e.preventDefault();
        updateUserRoles(userId, userRoles);
    }

    const updateUserRoles = (userId, userRoles) => {
        console.log(userRoles);
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ userRoles }),
        }

        console.log(`Updating user roles`);

        const updateRolesUrl = `http://localhost:5000/roles/update/${userId}`;

        fetch(updateRolesUrl, options)
            .then(res => {
                navigate('/roles');
                window.location.reload(true);
            })
            .catch(err => {
                console.log(err);
            });
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
                <p>User Name: {user.userName}</p>
                <p>User Email: {user.userEmail}</p>
                <p>User Role(s): {user.userRoles}</p>

                {
                    isLoaded ?
                    <form onSubmit={onSubmit}>
                        <Form.Check>
                            {
                                roles.map((role, index) =>
                                <div key={index}>
                                    <Form.Check.Input type='checkbox' checked={isChecked(index)} onChange={() => handleRoleChange(index)} />    
                                    <Form.Check.Label>{role.roleName}</Form.Check.Label>
                                </div>
                                )
                            }
                        </Form.Check>
                        <Button 
                            variant='primary'
                            className={styles.updateBtn} 
                            type='submit'>
                            Update
                        </Button>
                    </form>
                    : <span>loading</span>
                }
            </div>
        </PageContainer>
    )
}

export default EditUserRoles;