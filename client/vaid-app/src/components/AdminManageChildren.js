import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/AdminManageChildren.css';

function ManageChildren() {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const fetchChildren = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to access this page.');
                return;
            }

            const response = await axios.get('http://localhost:8000/manage-children', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('API response:', response.data); // Verify the response structure

            if (response.data.children.length === 0) {
                alert('No children found for this user.');
            } else {
                setChildren(response.data.children); // Update state with the children
            }
        } catch (err) {
            console.error('Error fetching children:', err);
            alert('Error fetching children data');
        }
    };

    fetchChildren();
}, []);

  const handleDelete = async (childId) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        alert('You must be logged in to delete a child.');
        return;
      }

      await axios.delete(`http://localhost:8000/api/children/${childId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
      });
      setChildren(children.filter(child => child.id !== childId)); // Remove deleted child from the state
      alert('Child record deleted successfully');
    } catch (err) {
      console.error('Error deleting child:', err);
      alert('Error deleting child');
    }
  };

  return (
    <div>
      <h2>Manage Registered Children</h2>
      <div className="children-list">
        {children.length === 0 ? (
          <p>No children registered yet.</p>
        ) : (
          children.map((child) => (
            <div key={child.id} className="child-card">
              <p>Name: {child.name}</p>
              <p>Age: {child.age}</p>
              <p>Gender: {child.gender}</p>
              <p>Blood Group: {child.blood_group}</p>
              <button onClick={() => handleDelete(child.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageChildren;
