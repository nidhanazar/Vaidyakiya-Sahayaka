import React, { useState } from 'react';
import './css/MedicalRequest.css';
import MedicalService from './services/MedicalService'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

function MedicalRequest() {
  const [formData, setFormData] = useState({
    illness: '',
    treatmentTaken: '',
    duration: '',
    bystanderName: '',
    bystanderContact: ''
  });

  const [hospitals, setHospitals] = useState([]); // Store hospitals
  const [submitted, setSubmitted] = useState(false); // To control display

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser) {
      alert("User not logged in");
      return;
    }

    const payload = {
      ...formData,
      user_id: loggedUser.id,  // add the user_id here
    };

    // Handle form submission here
    try {
      const response = await MedicalService.submitMedicalRequest(payload);
      console.log('Form submitted:', response.data);
      setHospitals(response.data.hospitals); // show hospitals
      setSubmitted(true); // ✅ Trigger display

      // Navigate to the HospitalList page, passing the hospitals as state
      navigate('/hospital-list', { state: { hospitals: response.data.hospitals } });

    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Submission failed');
    }
  };

  return (
    <div className="medical-request-container">
      <form onSubmit={handleSubmit} className="medical-request-form">
        <h2>Medical Request Form</h2>

        <div className="form-group">
          <label htmlFor="illness">Illness:</label>
          <input
            type="text"
            id="illness"
            name="illness"
            value={formData.illness}
            onChange={handleChange}
            placeholder="What illness do you have?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="treatmentTaken">Treatment Taken:</label>
          <input
            type="text"
            id="treatmentTaken"
            name="treatmentTaken"
            value={formData.treatmentTaken}
            onChange={handleChange}
            placeholder="Enter the treatment you have taken"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration:</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="How long have you had the illness?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bystanderName">Bystander Name:</label>
          <input
            type="text"
            id="bystanderName"
            name="bystanderName"
            value={formData.bystanderName}
            onChange={handleChange}
            placeholder="Enter the bystander's name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bystanderContact">Bystander Contact Number:</label>
          <input
            type="tel"
            id="bystanderContact"
            name="bystanderContact"
            value={formData.bystanderContact}
            onChange={handleChange}
            placeholder="Enter the bystander's contact number"
            required
          />
        </div>

        <div className="form-group">
          <button type="submit" className="submit-button">Submit</button>
        </div>
      </form>

      {/* Show Hospital Suggestions */}
      {hospitals.length > 0 && (
        <div className="hospital-list">
          <h3>Suggested Hospitals</h3>
          <ul>
            {hospitals.map((hospital, index) => (
              <li key={index}>
                <strong>{hospital.name}</strong><br />
                Contact: {hospital.contact}<br />
                Specialties: {hospital.specialties}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MedicalRequest;
