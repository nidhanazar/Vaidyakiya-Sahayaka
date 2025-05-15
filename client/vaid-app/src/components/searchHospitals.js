import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/searchHospital.css';

function HospitalSearch() {
  const [searchType, setSearchType] = useState('user'); // 'user' or 'child'
  const [query, setQuery] = useState('');
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [specialties, setSpecialties] = useState([
    "cardiology", "heart surgery", "emergency care", "general medicine", "surgery", "orthopedics", 
    "obstetrics", "gynecology", "delivery", "nephrology", "general health", "immunization"
  ]); // List of available specialties
  const [filteredSpecialties, setFilteredSpecialties] = useState([]); // To store matching specialties
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchChildren = async () => {
      if (searchType === 'child') {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:8000/manage-children", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (res.ok) {
            // If user is admin, filter for only their children if needed
            const filteredChildren = user.role === 'admin'
              ? data.children
              : data.children.filter(c => c.user_id === user.id);
            setChildren(filteredChildren);
          } else {
            alert(data.message);
          }
        } catch (err) {
          console.error("Failed to fetch children", err);
        }
      }
    };

    fetchChildren();
  }, [searchType, user]);

  useEffect(() => {
    // Filter specialties based on query
    if (query) {
      setFilteredSpecialties(specialties.filter(specialty =>
        specialty.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
      setFilteredSpecialties([]);
    }
  }, [query, specialties]);

  if (!user || !user.id) {
    alert('Please log in first.');
    return null;
  }

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query) {
      alert('Please enter a search term');
      return;
    }

    let url = '';
    let body = {};

    if (searchType === 'user') {
      url = 'http://localhost:8000/search-user/search';
      body = { illness: query, user_id: user.id };
    } else {
      if (!selectedChildId) {
        alert('Please select a child');
        return;
      }
      url = 'http://localhost:8000/api/hospitals/search-child';
      body = { illness: query, child_id: selectedChildId, user_id: user.id };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/hospital-list', { state: { hospitals: data.hospitals, child_name: data.child_name } });
      } else {
        alert('Error fetching hospital data');
      }
    } catch (err) {
      console.error('Search error:', err);
      alert('Failed to search');
    }
  };

  return (
    <div className="hospital-search-container">
      <h2>Search Users or Children</h2>
      <form onSubmit={handleSearch}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="user">Search by User</option>
          <option value="child">Search by Child</option>
        </select>

        {searchType === 'child' && (
          <select
            value={selectedChildId || ''}
            onChange={(e) => setSelectedChildId(e.target.value)}
            required
          >
            <option value="">Select Child</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} (Age: {child.age})
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Enter illness`}
        />

        {/* Display filtered specialties as suggestions */}
        {filteredSpecialties.length > 0 && (
          <div className="suggestions">
            {filteredSpecialties.map((specialty, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => setQuery(specialty)}
              >
                {specialty}
              </div>
            ))}
          </div>
        )}

        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default HospitalSearch;
