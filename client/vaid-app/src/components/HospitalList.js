import { useLocation, useNavigate } from 'react-router-dom';
import './css/HospitalList.css';

function HospitalList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hospitals, child_name } = location.state || {};

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="hospital-list-container">
        <p>No matching hospitals found.</p>
        <button onClick={goBack}>Back</button>
      </div>
    );
  }

  return (
    <div className="hospital-list-container">
      <h3>Recommended Hospitals</h3>
      <div className="hospital-list">
        {hospitals.map((hospital) => (
          <div className="hospital-card" key={hospital.id}>
            <h4>{hospital.name}</h4>
            <p><strong>Specialties:</strong> {hospital.specialties}</p>
            <p><strong>Location:</strong> {hospital.location}</p>
            <p><strong>Contact:</strong> {hospital.contact}</p>
          </div>
        ))}
      </div>
      <button onClick={goBack} className="back-btn">Back</button>
    </div>
  );
}

export default HospitalList;
