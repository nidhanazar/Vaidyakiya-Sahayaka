import React, { useEffect, useState } from 'react';
import './css/AdminManageRequests.css';  // Add this if you're using an external stylesheet

function AdminMedicalRequests() {
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ illness: '', description: '', recommended_hospitals: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      console.log('Fetching requests...');
      const res = await fetch('http://localhost:8000/api/medical-requests');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      console.log(data);
      setRequests(data); // Save the data to the state
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const startEdit = (req) => {
    setEditingId(req.id);  // Using `req.id` here instead of `req.request_id`
    setForm({
      illness: req.illness,
      description: req.description,
      recommended_hospitals: req.recommended_hospitals,
    });
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/medical-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      console.log('Save Edit Response Status:', res.status); // Log the response status
  
      if (res.ok) {
        console.log('Edit Saved Successfully');
        setEditingId(null);
        fetchRequests(); // Refresh the requests after saving
      } else {
        console.error('Error updating request:', res.statusText);
      }
    } catch (error) {
      console.error('Error saving request:', error);
    }
  };
  
  const deleteRequest = async (id) => {
    if (window.confirm('Are you sure to delete this request?')) {
      try {
        const res = await fetch(`http://localhost:8000/api/medical-requests/${id}`, {
          method: 'DELETE',
        });
  
        console.log('Delete Response Status:', res.status); // Log the response status
  
        if (res.ok) {
          console.log('Request Deleted Successfully');
          fetchRequests(); // Refresh the requests after deleting
        } else {
          console.error('Error deleting request:', res.statusText);
        }
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  return (
    <div className="admin-requests-container">
      <h2>All Medical Help Requests</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Illness</th>
            <th>Description</th>
            <th>Recommended Hospitals</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {requests.length === 0 ? (
    <tr>
      <td colSpan="6">No requests available</td>
    </tr>
  ) : (
    requests.map((req) => (
      <tr key={req.id}>
        <td>{req.name || 'N/A'}</td>

        {editingId === req.id ? (
          <>
            <td>
              <input
                type="text"
                value={form.illness}
                onChange={(e) => setForm({ ...form, illness: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={form.recommended_hospitals}
                onChange={(e) => setForm({ ...form, recommended_hospitals: e.target.value })}
              />
            </td>
          </>
        ) : (
          <>
            <td>{req.illness}</td>
            <td>{req.description}</td>
            <td>{req.recommended_hospitals}</td>
          </>
        )}

        <td>{new Date(req.request_date).toLocaleString()}</td>
        <td>
          {editingId === req.id ? (
            <button className="save-button" onClick={() => saveEdit(req.id)}>Save</button>
          ) : (
            <button className="edit-button" onClick={() => startEdit(req)}>Edit</button>
          )}
          <button className="delete-button" onClick={() => deleteRequest(req.id)}>Delete</button>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>
  );
}

export default AdminMedicalRequests;
