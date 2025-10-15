import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import logo from './x.png';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  useEffect(() => {
    document.title = 'Erlli - Reset Your Password';
    if (hasInitialized.current) {
      console.log('ResetPassword: Skipping re-initialization');
      return;
    }
    hasInitialized.current = true;
    const params = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace('#', ''));
    const accessToken = params.get('access_token') || hashParams.get('access_token');
    const refreshToken = params.get('refresh_token') || hashParams.get('refresh_token');
    const type = params.get('type') || hashParams.get('type');
    console.log('ResetPassword: Query params:', {
      accessToken: accessToken ? accessToken.substring(0, 10) + '...' : null,
      refreshToken: refreshToken ? refreshToken.substring(0, 10) + '...' : null,
      type,
    });
    console.log('ResetPassword: URL:', window.location.href);
    if (type === 'signup') {
      console.log('ResetPassword: Redirecting to /verify-email');
      navigate('/verify-email' + (location.search || location.hash));
      return;
    }
    if (!accessToken || !refreshToken) {
      console.error('ResetPassword: Missing access_token or refresh_token');
      setError('Invalid or missing reset token. Please request a new reset link.');
      return;
    }
    if (type !== 'recovery') {
      console.error('ResetPassword: Invalid type parameter:', type);
      setError('Invalid link type. Please use a password reset link.');
      return;
    }
    sessionStorage.setItem('resetAccessToken', accessToken);
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!newPassword || !confirmPassword) {
      console.error('ResetPassword: Missing password fields');
      setError('Please fill in both password fields.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      console.error('ResetPassword: Passwords do not match');
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      console.error('ResetPassword: Password too short');
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    try {
      const accessToken = sessionStorage.getItem('resetAccessToken');
      console.log('ResetPassword: Updating password with access_token:', {
        accessToken: accessToken.substring(0, 10) + '...',
      });
      const response = await fetch('https://auth.erlli.com/auth/v1/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzU2MTcwMTMzLCJleHAiOjIwNzE1MzAxMzN9.Sik1a3Sg-6nokPU0DNKurbrYzjSaPfPaOXtnj2qjRdk',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });
      const result = await response.json();
      console.log('ResetPassword: Direct update response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: result,
      });
      if (!response.ok) {
        console.error('ResetPassword: Update user error:', result);
        throw new Error(result.message || 'Failed to update password');
      }
      setSuccess(true);
      sessionStorage.removeItem('resetAccessToken');
    } catch (err) {
      console.error('ResetPassword: Unexpected error in updateUser:', err);
      setError(err.message || 'An error occurred while updating your password.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    console.log('ResetPassword: Redirecting to erlli.com');
    window.location.href = 'https://erlli.com'; // Redirect to erlli.com
  };

  return (
    <div className="reset-password-container">
      {success ? (
        <div className="success-message">
          <img src={logo} alt="Erlli Logo" className="logo" />
          <h2>Password Updated</h2>
          <p>Your password has been successfully changed.</p>
          <button onClick={handleBackToLogin} className="back-button">
            Back to Home
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="reset-password-form">
          <img src={logo} alt="Erlli Logo" className="logo" />
          <h2>Reset Your Password</h2>
          <p>Enter your new password below.</p>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;