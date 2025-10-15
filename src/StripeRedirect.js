import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './ResetPassword.css';
import logo from './x.png';

const StripeRedirect = () => {
  const location = useLocation();
  const hasPosted = useRef(false);
  const messageId = useRef(Date.now().toString() + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    document.title = 'Erlli - Stripe Connection';
    if (hasPosted.current) return;
    console.log('Redirect URL:', window.location.href);
    console.log('All Query Parameters:', Object.fromEntries(new URLSearchParams(location.search)));
    const query = new URLSearchParams(location.search);
    const code = query.get('code');
    const state = query.get('state');
    const error = query.get('error');
    const errorDescription = query.get('error_description');
    console.log('Parsed Query:', { code, state, error, errorDescription, messageId: messageId.current });
    if (window.ReactNativeWebView && !hasPosted.current) {
      hasPosted.current = true;
      if (error) {
        console.log('Posting error to WebView:', { error, errorDescription, messageId: messageId.current });
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ error, errorDescription: errorDescription || 'Unknown error', messageId: messageId.current })
        );
      } else if (code && state) {
        console.log('Posting success to WebView:', { code, state, messageId: messageId.current });
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ code, state, messageId: messageId.current })
        );
      } else {
        console.log('Posting invalid request to WebView:', { messageId: messageId.current });
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ error: 'Invalid request', errorDescription: 'Missing code or state', messageId: messageId.current })
        );
      }
    } else if (!window.ReactNativeWebView) {
      console.error('ReactNativeWebView not available');
    }
  }, [location]);

  return (
    <div className="container">
      <div className="message-container">
        <img src={logo} alt="Erlli Logo" className="logo" />
        {new URLSearchParams(location.search).get('error') ? (
          <>
            <div className="circle-container failure">
              <div className="failure-circle-outer">
                <div className="failure-circle-middle">
                  <span className="exclamation-mark">!</span>
                </div>
              </div>
            </div>
            <h2 className="title-text">Stripe Connection Failed</h2>
            <p className="subtitle-text">
              {new URLSearchParams(location.search).get('error_description') ||
                'An error occurred during Stripe onboarding.'}
            </p>
            <p className="subtitle-text">You can close this page and try again.</p>
          </>
        ) : (
          <>
            <div className="circle-container success">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00BC7D" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="title-text">Stripe Connection Successful</h2>
            <p className="subtitle-text">Please wait, redirecting back to the app...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default StripeRedirect;