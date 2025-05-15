import React from "react";
import './css/About.css';

function AboutPage() {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>
      <h2 className="about-subtitle">Health Help with Heart</h2>
      <p className="about-paragraph">
        <strong>VAID</strong> is a non-profit initiative started with the mission to ensure that every patient gets access to the medical care they deserve — without delays, confusion, or lack of resources.
        <br/>
    <br/>
    </p>
    <p className="about-paragraph">
        We focus on assisting patients in need by:<br/>
    </p>
    <ul className="about-list">
        - Connecting them to hospitals suited for their illness<br/>
        - Providing access to a curated list of available doctors<br/>
        - Offering free registration and guided navigation for patients<br/>
        - Ensuring support through every step of the treatment process<br/>
        <br/>
    </ul>
    
<p className="about-paragragh">
    Our goal is to remove barriers between people and care by leveraging technology, partnerships, and a compassionate approach. From the moment a patient registers on our platform, we work actively to match them with the most appropriate care provider based on their condition.
    <br/>
    **Together, we save lives – one patient at a time.**
</p>
    </div>
  );
}

export default AboutPage;