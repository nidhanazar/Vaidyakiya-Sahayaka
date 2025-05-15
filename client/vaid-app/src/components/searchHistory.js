import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/SearchHistory.css";

const SearchHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    console.log("User ID:", userId);
    axios
      .get(`http://localhost:8000/api/search-history?user_id=${userId}`)
      .then((res) => {
        console.log("API Response:", res.data);
        setHistory(res.data.history || res.data); // Handle both cases
      })
      .catch((err) => {
        console.error(
          "Error fetching history:",
          err.response?.status,
          err.response?.data
        );
      });
  }, []);

  return (
    <div className="search-history-container">
      <h2 className="search-title">Search History</h2>
      {history.length === 0 ? (
        <p className="text-center text-gray-600">No search history found.</p>
      ) : (
        history.map((entry) => (
          <div key={entry.id} className="search-entry">
            <p>
              <span className="entry-label">🔍 Search For:</span>{" "}
              {entry.search_query}
            </p>

            <p>
              <span className="entry-label">🏥 Recommended Hospitals:</span>
              {entry.recommended_hospitals}
            </p>

            <p>
              <span className="entry-label">👤 Requested By:</span>{" "}
              {entry.search_type === "child"
                ? `Child: ${entry.child_name}`
                : entry.user_name}
            </p>

            <p>📅 Date: {new Date(entry.timestamp).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchHistory;
