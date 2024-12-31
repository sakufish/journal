import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Dashboard from './pages/Dashboard'; 
import ReactGA from 'react-ga';


const App: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize('G-0NHX9CKWE0');
    ReactGA.pageview(window.location.pathname + window.location.search);
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
