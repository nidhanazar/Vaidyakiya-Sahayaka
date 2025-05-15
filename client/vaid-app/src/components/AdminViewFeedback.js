import React, { useState, useEffect } from "react";
import UserService from "./services/UserService";
import './css/AdminViewFeedback.css';

function FeedbackView() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch feedbacks from the backend
    const fetchFeedbacks = async () => {
      try {
        const response = await UserService.getFeedbacks(); // Call service to fetch feedbacks
        setFeedbacks(response.data.feedbacks); // Store feedbacks in state
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setMessage("❌ Could not fetch feedbacks.");
      }
    };

    fetchFeedbacks(); // Call the function when the component mounts
  }, []);

  return (
    <div className="feedback-view-container">
      <h2>Admin Feedback View</h2>

      {message && <div className="message error">{message}</div>}

      {feedbacks.length > 0 ? (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={index}>
                <td>{feedback.name}</td>
                <td>{feedback.email}</td>
                <td>{feedback.rating}</td>
                <td>{feedback.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No feedback available yet.</p>
      )}
    </div>
  );
}

export default FeedbackView;
