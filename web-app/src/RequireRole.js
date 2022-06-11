import { useLocation, Navigate, Outlet } from "react-router-dom";
import React, {useState, useEffect, useContext} from 'react';

import { useAuth0 } from '@auth0/auth0-react';

const RequireRole = ({allowedRoles}) => {
    const { user } = useAuth0();
    const [isAllowed, setIsAllowed] = useState('loading');

    useEffect(()=>{
        getUser();
	}, []);

	const getUser = () => {
        fetch(`http://localhost:5000/get-user/${user.email}`)
            .then(
                res => res.json()
                    .then(data => {
                        if (data.userRoles.some(role => allowedRoles?.includes(role)))
                        {
                            console.log("Allowed");
                            setIsAllowed('allow');
                        }
                        else {
                            console.log("Not allowed");
                            setIsAllowed('deny');

                        }
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
	}

    return (
        <div>
            {
                isAllowed === 'allow'
                ? <Outlet />
                :
                isAllowed === 'deny'
                ? <Navigate to="/unauthorized" />
                : <span>loading</span>
            }
        </div>
    )
}

export default RequireRole;