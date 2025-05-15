import React from "react";
import "./css/Home.css";


function HomePage() {
  return (
    <div className="homepage">
     

      {/* Main Content */}
      <main className="main-content">
        <h1>Welcome to Vaidyakiya Sahayaka</h1>
         <h2>Connecting Patients to the Right Care, at the Right Time</h2>
        <p>
        Welcome to CareConnect – an NGO-driven platform that helps patients get timely medical assistance by matching them with the best available hospitals and doctors based on their health condition. Whether it's a minor illness or a critical need, we are here to guide you to the right medical support.
        </p>
        <h2>Highlights</h2>
        <ul>
            <li>Easy patient registration  </li>
            <li>Smart illness-based doctor and hospital matching </li>
            <li>Verified hospital and doctor profiles </li>
            <li>Emergency contact and assistance </li>
            <li>100% free and compassionate service</li>
        </ul>

        <h2>Call To Action</h2>
        <p>
        If you or someone you know is in need of medical help, register now and let us help you get connected with the right care.

        </p>
      </main>
    </div>
  );
}

export default HomePage;