// Packages
import React, {useState, useEffect, useContext} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner } from 'react-bootstrap';
import { useScreenType } from './modules/useScreenType';
import { Toaster } from 'react-hot-toast';

import './App.css';
import GlobalContext from './context/GlobalContext';

// Pages
import * as Pages from './pages/index';

// Components
import Sidebar from './nav-components/Sidebar/Sidebar';
import Navbar from './nav-components/Navbar/Navbar';
import RequireRole from './RequireRole';

function App() {
	const screenType = useScreenType();
	const { user: userCtx, setUser: setUserCtx } = useContext(GlobalContext);

	// Auth0
	const { user, isAuthenticated, isLoading } = useAuth0();

	const addUser = userInfo => {
		const { name, email, picture } = userInfo;

		const newUser = {
			userName: name,
			userEmail: email,
			userPicture: picture,
			userRoles: ['Student'],
		}
		console.log(newUser);

		const options = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(newUser),
		}

		const addUserUrl = 'http://localhost:5000/add-user';

		fetch(addUserUrl, options)
			.then(res => {
				console.log('Added new user');
				res.json()
					.then(data => 
						setUserCtx({
							...user,
							id: data._id,
						})
					)
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}

	const getUserId = async userEmail => {
		const getUserUrl = `http://localhost:5000/get-user/${userEmail}`;

		const res = await fetch(getUserUrl);
		const userData = await res.json();
		return userData._id;
	}

	useEffect(()=>{
		// Reload when isAuthenticated value changes
		(
			async () => {
				if(user){
					const currentUserId = await getUserId(user.email);
					if(currentUserId){
						console.log('User already exists');
						setUserCtx({
							...user,
							id: currentUserId,
						});
					}
					else{
						addUser(user);
					}
					console.log(user);
				}
			}
		)();
	}, [isAuthenticated]);

	return (
		<div className="App">
		{
			isLoading ?

			<Spinner className="loader" animation="border" variant="primary" />

			:

			isAuthenticated && userCtx ?

			<BrowserRouter>
				{
					screenType == 'show-sidebar' ?

					<Sidebar />

					:

					<Navbar />
				}
				<Toaster 
					position="bottom-center"
					reverseOrder={false}/>
				<Routes>
					<Route path='/profile/' element={<Pages.Profile />} />
					<Route path='/profile/:userId' element={<Pages.UserProfile />} />
					<Route path='/home' element={<Pages.Dashboard />} />        
					<Route path='/home/announcement/:announcementNum' element={<Pages.Announcement />} />
					<Route element={<RequireRole allowedRoles={['Lecturer']} />} >
						<Route path='/home/announcement/create' element={<Pages.AnnouncementCreate />} /> 
					</Route>
					<Route path='/home/announcement/update/:announcementNum' element={<Pages.AnnouncementUpdate />} />     
					<Route path='/home/course/:courseCode' element={<Pages.Course />} />
					<Route path='/home/course/:courseCode/:sectionId' element={<Pages.CourseSection />} />
					<Route path='/home/deadline/:deadlineId' element={<Pages.Deadline />} />      
					<Route path='/calendar' element={<Pages.Calendar />} />
					<Route path='/forum' element={<Pages.Forum />} />
					<Route path='/forum/create' element={<Pages.ForumCreate />} />
					<Route path='/forum/post/:postId' element={<Pages.ForumPost />} />
					<Route path='/challenges' element={<Pages.ChallengeList />} />
					<Route path='/challenges/:challengeId' element={<Pages.Challenge />} />
					<Route path='/challenges/create' element={<Pages.ChallengeCreate />} />
					<Route path='/event' element={<Pages.Event />} />
					<Route path='/event/:eventId' element={<Pages.EventExpand />} />
					<Route path='/event/create' element={<Pages.EventCreate />} />
					<Route path='/game' element={<Pages.Game />} />
					<Route path='/unauthorized' element={<Pages.Unauthorized />} />
					<Route element={<RequireRole allowedRoles={['Admin']} />} >
						<Route path='/roles' element={<Pages.Roles />} />
						<Route path='/roles/update/:userId' element={<Pages.EditUserRoles />} />
					</Route>
					<Route 
						path='*'
						element={<Navigate to='/home' replace/>}
					/>
				</Routes>
			</BrowserRouter>

			:

			<Pages.Login />
		}
		</div>
	);
}

export default App;
