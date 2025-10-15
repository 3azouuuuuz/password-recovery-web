import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyEmail.css';
import logo from './x.png';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set page title
    document.title = 'Erlli - Verify Your Email Address';
    const params = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace('#', ''));
    const type = params.get('type') || hashParams.get('type');
    console.log('VerifyEmail: Query params:', { type });
    console.log('VerifyEmail: URL:', window.location.href);
    if (type === 'recovery') {
      console.log('VerifyEmail: Redirecting to /reset-password');
      navigate('/reset-password' + (location.search || location.hash));
    }
  }, [location, navigate]);

  return (
    <div className="verify-email-container">
      <div className="message-box">
        <img src={logo} alt="Erlli Logo" className="logo" />
        <h2>Email Verification</h2>
        <p>Your account has been successfully verified!</p>
      </div>
    </div>
  );
};

export default VerifyEmail;