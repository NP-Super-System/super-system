import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Calendar from './pages/Calendar/Calendar';
import Forum from './pages/Forum/Forum';

//Components
import Navbar from './components/Navbar/Navbar';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/forum' element={<Forum />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
