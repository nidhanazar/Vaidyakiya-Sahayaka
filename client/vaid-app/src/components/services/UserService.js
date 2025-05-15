
import axios from 'axios';

const BASE_URL = "http://localhost:8000";

class UserService {
  // Register a new user
  registerUser(userData) {
    return axios.post(`${BASE_URL}/register`, userData);
  }

  loginUser(credentials) {
    return axios.post(`${BASE_URL}/login`, credentials);
  }

// Submit Feedback
submitFeedback(feedbackData) {
  return axios.post(`${BASE_URL}/feedback`, feedbackData);
}


//   Submit form

  // Register a child
  registerChild(childData, token) {
    console.log("Token being used for registration:", token); // DEBUG to ensure token is correct
    return axios.post(`${BASE_URL}/child-registration`, childData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Use the token passed as an argument
      }
    });
  }

   // Register child's illness details
   async registerIllnessDetails(illnessData, token) {
    try {
      const response = await axios.post(`${BASE_URL}/child-illness`, illnessData, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include token in the header
          }
      });
      return response.data;
  } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to submit illness details');
  }
  }
  
  
  


//  admin
// 
  getFeedbacks(feedbackData) {
    return axios.get(`${BASE_URL}/viewFeedback`);
    }






    // forgot password
    forgotPassword(data){
      return axios.post(`${BASE_URL}/forgot-password`, data);
    };

    // reset password
    resetPassword(data) {
      return axios.post(`${BASE_URL}/reset-password`, data);
    }

  
}

export default new UserService();