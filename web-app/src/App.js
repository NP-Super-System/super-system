import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

//Pages
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import Calendar from './pages/Calendar/Calendar';
import Forum from './pages/Forum/Forum';
import Course from './pages/Course/Course';

//Components
import Sidebar from './components/Sidebar/Sidebar';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path='/profile' element={<Profile />} />
          <Route path='/home' element={<Dashboard />} />
          <Route path='/home/:courseCode' element={<Course />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/forum' element={<Forum />} />
          <Route 
            path='*'
            element={<Navigate to='/home' replace/>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
