// Packages
import React, {useState, useEffect, useContext} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner } from 'react-bootstrap';
import { useScreenType } from './modules/useScreenType';

// Pages
import Login from './pages/Login/Login';

import Profile from './pages/Profile/Profile';
import UserProfile from './pages/UserProfile/UserProfile';
import Dashboard from './pages/Dashboard/Dashboard';
import Course from './pages/Course/Course';
import CourseSection from './pages/CourseSection/CourseSection';
import Announcement from './pages/Announcement/Announcement';
import AnnouncementCreate from './pages/AnnouncementCreate/AnnouncementCreate';
import AnnouncementUpdate from './pages/AnnouncementUpdate/AnnouncementUpdate';
import Calendar from './pages/Calendar/Calendar';
import Deadline from './pages/Deadline/Deadline';
import Forum from './pages/Forum/Forum';
import ForumCreate from './pages/ForumCreate/ForumCreate';
import ForumPost from './pages/ForumPost/ForumPost';
import ChallengeList from './pages/ChallengeList/ChallengeList';
import Challenge from './pages/Challenge/Challenge';
import ChallengeCreate from './pages/ChallengeCreate/ChallengeCreate';
import Event from './pages/Event/Event';
import Game from './pages/Game/Game';

// Components
import Sidebar from './nav-components/Sidebar/Sidebar';
import Navbar from './nav-components/Navbar/Navbar';

import './App.css';
import GlobalContext from './context/GlobalContext';

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
          <Routes>
            <Route path='/profile/' element={<Profile />} />
            <Route path='/profile/:userId' element={<UserProfile />} />
            <Route path='/home' element={<Dashboard />} />        
            <Route path='/home/announcement/:announcementNum' element={<Announcement />} />
            <Route path='/home/announcement/create' element={<AnnouncementCreate />} /> 
            <Route path='/home/announcement/update/:announcementNum' element={<AnnouncementUpdate />} />     
            <Route path='/home/course/:courseCode' element={<Course />} />
            <Route path='/home/course/:courseCode/:sectionId' element={<CourseSection />} />
            <Route path='/home/deadline/:deadlineId' element={<Deadline />} />      
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/forum' element={<Forum />} />
            <Route path='/forum/create' element={<ForumCreate />} />
            <Route path='/forum/post/:postId' element={<ForumPost />} />
            <Route path='/challenges' element={<ChallengeList />} />
            <Route path='/challenges/:challengeId' element={<Challenge />} />
            <Route path='/challenges/create' element={<ChallengeCreate />} />
            <Route path='/event' element={<Event />} />
            <Route path='/game' element={<Game />} />
            <Route 
              path='*'
              element={<Navigate to='/home' replace/>}
            />
          </Routes>
        </BrowserRouter>

        :

        <Login />
      }
    </div>
  );
}

export default App;
