import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Dashboard from './pages/Dashboard'; 
import ReactGA from "react-ga4";


const App: React.FC = () => {
  useEffect(() => {
    ReactGA.send("pageview");
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
