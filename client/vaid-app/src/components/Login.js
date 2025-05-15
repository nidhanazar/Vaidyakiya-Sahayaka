import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';
import UserService from './services/UserService';

const loginContainerStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundSize: 'cover',
  position: 'relative', 
};

function LoginPage() {
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleReset = () => {
    setForm({ mobile: '', password: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { mobile, password } = form;
  
    if (!mobile || !password) {
      setError('Both username and password are required.');
      return;
    }
  
    try {
      const response = await UserService.loginUser({ mobile, password });
  
      if (response.status === 200) {
        // Set the role based on the login credentials
      const role = (mobile === "1234567890" && password === "admin123") ? "admin" : "user";
  
         // Save the role, token, and user data in localStorage
      localStorage.setItem("role", role);


        const token = response.data.token;
        console.log("Token being saved:", token);

        const data = response.data; 
  
        // Save user data and token
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data.user));  // Save the user object correctly
        localStorage.setItem("user_id", data.user.id); // storing user_id
        localStorage.setItem("isAuthenticated", "true"); 
        localStorage.setItem("isLoggedIn", "true");
        
  
        alert("Login successful!");
        navigate("/dashboard");
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed");
    }
  };
  
  return (
    <div className='login-container' style={loginContainerStyle}>
      <div> </div>
      <div className='login-box'>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>LOGIN</h2>
          <div className='form-group-inline'>
            <label id="mobile">Username:</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter your Mobile Number"
              value={form.mobile}
              onChange={handleChange}
            />
          </div>
          
          <div className='form-group-inline'>
            <label id="password">Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <div className='button-group'>
            <button type="reset" className='reset-button' onClick={handleReset}>Reset</button>
            <button type="submit" className='submit-button'>Submit</button>
          </div>
        </form>
        {error && <p className='error-message'>{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage; 
