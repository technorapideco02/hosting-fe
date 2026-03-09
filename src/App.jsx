import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Repositories from './pages/Repositories';
import DeploymentDetail from './pages/DeploymentDetail';
import LoginCallback from './pages/LoginCallback';
import Billing from './pages/Billing';
import Admin from './pages/Admin';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col font-sans">
        <Navbar token={token} setToken={setToken} />
        <main className="flex-grow flex flex-col pt-16">
          <Routes>
            <Route path="/" element={!token ? <Landing /> : <Navigate to="/dashboard" />} />
            <Route path="/auth/callback" element={<LoginCallback setToken={setToken} />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/repositories" element={token ? <Repositories /> : <Navigate to="/" />} />
            <Route path="/deployments/:id" element={token ? <DeploymentDetail /> : <Navigate to="/" />} />
            <Route path="/billing" element={token ? <Billing /> : <Navigate to="/" />} />
            <Route path="/admin" element={token ? <Admin /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
