import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import StripeRedirect from './StripeRedirect';
import VerifyEmail from './VerifyEmail';

// Component to handle root redirect
const RootRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      console.log('Redirecting from / to https://erlli.com/');
      window.location.replace('https://erlli.com/');
    }
  }, [location]);

  return null; // No UI needed, as redirect happens
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/stripe-redirect" element={<StripeRedirect />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;