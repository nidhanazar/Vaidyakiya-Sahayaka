import React, { useState } from 'react';
import UserService from './services/UserService';
import './css/childRegistration.css';
import { useNavigate } from 'react-router-dom';

function ChildRegistration() {
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', blood_group: '' });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, age, gender, blood_group } = form;

    // Log the form data to check if all fields are present
    console.log('Form data:', form);

    if (!name || !age || !blood_group) {
      alert('All fields are required');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token missing. Please login again.');
      return;
    }

    try {
      const response = await UserService.registerChild(form, token); // Capture the response here
      localStorage.setItem('child_id', response.child_id); // Now you can access response.child_id
      alert('Child registered successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error registering child');
    }
  };

  return (
    <div className="child-registration-container">
      <form onSubmit={handleSubmit} className="child-registration-form">
        <h2>Register Child</h2>

        <div className="form-group">
          <label>Name:</label>
          <input
            name="name"
            type="text"
            placeholder="Enter child's name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input
            name="age"
            type="number"
            placeholder="Enter child's age"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Blood Group:</label>
          <select
            name="blood_group"
            value={form.blood_group}
            onChange={handleChange}
            required
          >
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Register Child
        </button>
      </form>
    </div>
  );
}

export default ChildRegistration;
