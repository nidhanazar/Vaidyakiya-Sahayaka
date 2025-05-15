import React from 'react';
import './css/Dashboard.css';
import { useNavigate } from 'react-router-dom';

// images import - user
import HospitalSearch from '../images/hospital.png';
import FeedbackImage from '../images/feedback.png';
import childRegisterImage from '../images/childRegister.png';
import SearchHistoryImage from '../images/searchHistory.png';


// import images - admin
import manageRequest from '../images/admin-manage requests.jpg';
import manageChildren from '../images/manageChildren.png';
import viewUsers from '../images/viewUsers.png';
// import viewReports from '../images/viewReports.jpg';
import viewFeedback from '../images/viewFeedback.png';
import contactRequest from '../images/contactRequest.png';


function Dashboard() {
 const navigate = useNavigate();
 const role = localStorage.getItem("role");
 const isAdmin = role === "admin";

  return (
    <div>
     <h2 style={{ padding: '20px', fontSize: '2rem', color: '#333', textAlign: 'left', marginBottom: '20px' }}>
        Dashboard
    </h2>
      <br />
      <br />
      <div className="dashboard-container">
      {isAdmin ? (
          // Admin Dashboard view
          <>
            <div className="dashboard-box" onClick={() => navigate('/manage-requests')}>
              <img src={manageRequest} alt="view requests" height={100} width={100} />
              <p>Manage all submitted medical help requests</p>
            </div>
            <div className="dashboard-box" onClick={() => navigate('/manage-children')}>
              <img src={manageChildren} alt="manage children" height={100} width={100} />
              <p>Manage Registered Children</p>
            </div>
            {/* <div className="dashboard-box" onClick={() => navigate('/reports')}>
              <img src={viewUsers} alt="view users" height={100} width={100} />
              <p>View Users</p>
            </div> */}
            <div className="dashboard-box" onClick={() => navigate('/viewFeedback')}>
              <img src={viewFeedback} alt="view feedback" height={100} width={100} />
              <p>View Feedback</p>
            </div>
            {/* <div className="dashboard-box" onClick={() => navigate('/viewFeedback')}>
              <img src={contactRequest} alt="contact request" height={100} width={100} />
              <p>Contact Requests</p>
            </div> */}
          </>
        ) :(
          // User Dashboard view
          <>
            {/* <div className="dashboard-box" onClick={() => navigate('/medical-request')}>
              <img src={helpRequestImage} alt="submit request" height="100" width="100" />
              <p>Submit Medical Help Request</p>
            </div> */}
            <div className="dashboard-box" onClick={() => navigate('/search-hospitals')}>
              <img src={HospitalSearch} alt="Search hospitals" height={100} width={100} />
              <p>Search Hospitals</p>
            </div>
            <div className="dashboard-box" onClick={() => navigate('/child-registration')}>
              <img src={childRegisterImage} alt="child register" height={100} width={100} />
              <p>Child Registration</p>
            </div>
            <div className="dashboard-box" onClick={() => navigate('/search-history')}>
              <img src={SearchHistoryImage} alt="search history" height={100} width={100} />
              <p>Search History</p>
            </div>
            <div className="dashboard-box" onClick={() => navigate('/feedback')}>
              <img src={FeedbackImage} alt="Provide Feedback" height={100} width={100} />
              <p>Provide Feedback</p>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}

export default Dashboard;
