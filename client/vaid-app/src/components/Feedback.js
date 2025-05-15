import React, { useState } from "react";
import UserService from "./services/UserService";

function Feedback() {
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    rating: "",
    comments: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.name || !feedback.email || !feedback.rating) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
        const response = await UserService.submitFeedback(feedback);  // Use the service to submit feedback
        setMessage("✅ Thank you for your feedback!");
        setFeedback({ name: "", email: "", rating: "", comments: "" }); // Reset form after submission
      } catch (error) {
        console.error("Feedback error:", error);
        if (error.response && error.response.data && error.response.data.error) {
          setMessage(error.response.data.error);  // Handle backend error message
        } else {
          setMessage("❌ Something went wrong. Please try again.");
        }
      }
    };
  

  return (
    <div className="feedback-container">
      <div className="feedback-box">
        <h2>We Value Your Feedback</h2>

        {message && (
          <div className={`message ${message.includes("Thank") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={feedback.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={feedback.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              value={feedback.rating}
              onChange={handleChange}
              required
            >
              <option value="">Select a Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comments">Additional Comments</label>
            <textarea
              id="comments"
              name="comments"
              value={feedback.comments}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us what we can improve..."
            />
          </div>

          <button type="submit" className="submit">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
