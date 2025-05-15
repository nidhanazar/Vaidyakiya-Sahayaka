import axios from 'axios';

const BASE_URL = "http://localhost:8000";


class MedicalService {
    // Submit Medical Request and get hospital suggestions
    submitMedicalRequest(formData) {
      return axios.post(`${BASE_URL}/medicalRequest`, formData);
    }
  
    // (Optional) Fetch hospitals by illness if needed independently
    getHospitalsByIllness(illness) {
      return axios.get(`${BASE_URL}/api/hospitals`, {
        params: { illness }
      });
    }


    


      // Fetch all submitted medical requests for admin management
  getAllRequests() {
    return axios.get(`${BASE_URL}/api/medical-requests`); // Assuming the backend provides an endpoint like this
  }
}

  
  
  export default new MedicalService();