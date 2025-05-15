// ForgotPasswordPage.js
import React, { useState } from 'react';
import UserService from './services/UserService';

function ForgotPasswordPage() {
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.forgotPassword({ mobile });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Forgot Password</h2>
          <input
            type="text"
            placeholder="Enter your registered mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button type="submit">Send OTP / Reset Link</button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
