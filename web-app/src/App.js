// Packages
import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner } from 'react-bootstrap';
import { useScreenType } from './layout/useScreenType';

// Pages
import Login from './pages/Login/Login';

import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import Course from './pages/Course/Course';
import Announcement from './pages/Announcement/Announcement';
import Calendar from './pages/Calendar/Calendar';
import Deadline from './pages/Deadline/Deadline';
import Forum from './pages/Forum/Forum';
import ForumCreate from './pages/ForumCreate/ForumCreate';
import ChallengeList from './pages/ChallengeList/ChallengeList';
import Challenge from './pages/Challenge/Challenge';
import ChallengeCreate from './pages/ChallengeCreate/ChallengeCreate';
import Event from './pages/Event/Event';

// Components
import Sidebar from './nav-components/Sidebar/Sidebar';
import Navbar from './nav-components/Navbar/Navbar';

import './App.css';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const screenType = useScreenType();

  useEffect(()=>{
    // Reload when isAuthenticated value changes
    console.log(user);
  }, [isAuthenticated]);

  return (
    <div className="App">
      {
        isLoading ?

        <Spinner className="loader" animation="border" variant="primary" />

        :

        isAuthenticated ?

        <BrowserRouter>
          {
            screenType == 'show-sidebar' ?

            <Sidebar user={user}/>

            :

            <Navbar user={user}/>
          }
          <Routes>
            <Route path='/profile' element={<Profile />} />
            <Route path='/home' element={<Dashboard />} />        
            <Route path='/home/announcement/:announcementNum' element={<Announcement />} />    
            <Route path='/home/course/:courseCode' element={<Course />} />
            <Route path='/home/deadline/:deadlineId' element={<Deadline />} />      
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/forum' element={<Forum />} />
            <Route path='/forum/create' element={<ForumCreate />} />
            <Route path='/challenges' element={<ChallengeList />} />
            <Route path='/challenges/:challengeId' element={<Challenge />} />
            <Route path='/create-challenge/' element={<ChallengeCreate />} />
            <Route path='/event' element={<Event />} />
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
