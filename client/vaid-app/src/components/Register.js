import React from 'react';
import './css/Register.css';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserService from './services/UserService'; // ✅ import service

function RegisterPage(){

    const [formData, setFormData] = useState({
        firstname : '',
        lastname : '',
        email : '',
        password : '',
        cpassword : '',
        mobile : '',
        gender : '',
        address : '',
        age : '',
        blood_group : '',
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async(e) => {
        e.preventDefault();

        if(formData.password !=formData.cpassword){
            alert("Password do not match");
            return;
        }

        try {
            const response = await UserService.registerUser(formData); //  use service
            // ✅Use response.data.message from your backend
            alert(response.data.message); 
            navigate('/dashboard');
        } 
        catch (error) {
            console.error("Registration error:", error);
            // Handle errors returned by the backend
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert("Something went wrong. Please try again.");
            }
          }
    }





    return(
        <div className='register-container'>
            <div className='register-box'>
                <form onSubmit={handleSubmit}>
                    <h2>REGISTRATION</h2>
                    <div className='form-group'>
                        <label>First Name:</label>
                        <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="Enter your Firstname"
                        />
                    </div>
                    <div className='form-group'>
                        <label>Last Name:</label>
                        <input
                        type="text"
                        name="lastname"
                        value={formData.lastname} 
                        onChange={handleChange}
                        placeholder="Enter your Lastname"
                        />
                    </div>

                    <div className='form-group'>
                        <label>Email:</label>
                        <input
                        type="email"
                        name="email"
                        value={formData.email} 
                        onChange={handleChange}
                        placeholder="Enter your Email"
                        />
                    </div>

                    <div className='form-group'>
                        <label>Password:</label>
                        <input
                        type="text"
                        name="password"
                        value={formData.password} 
                        onChange={handleChange}
                        placeholder="Enter your Password"
                        />
                    </div>

                    <div className='form-group'>
                        <label>Confirm Password:</label>
                        <input
                        type="text"
                        name="cpassword" 
                        value={formData.cpassword} 
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        />
                    </div>

                    <div className='form-group'>
                        <label>Mobile Number:</label>
                        <input
                        type="text"
                        name="mobile"
                        value={formData.mobile} 
                        onChange={handleChange}
                        placeholder="Enter your Phone Number"
                        />
                    </div>

                    <div className='gender-group'>
                        <label>Gender:</label>
                        <input type="radio" name="gender" value="male" onChange={handleChange} checked={formData.gender === "male"} /> Male
                        <input type="radio" name="gender" value="female" onChange={handleChange} checked={formData.gender === "female"} /> Female
                        <input type="radio" name="gender" value="other" onChange={handleChange} checked={formData.gender === "other"} /> Other
                    </div>

                    <div className='form-group'>
                        <label>Address</label>
                        <input
                        type="text"
                        name="address"
                        value={formData.address} 
                        onChange={handleChange}
                        placeholder="Enter your Address"
                        />
                    </div>

                    <div className='form-group'>
                        <label>Age:</label>
                        <input
                        type="text"
                        name="age"
                        value={formData.age} 
                        onChange={handleChange}
                        placeholder="Enter your Age"
                        />
                    </div>

                    <div className='form-group'>
                        <label>Blood Group:</label>
                        <select name="blood_group" value={formData.blood_group} onChange={handleChange}>
                            <option value="">Select your blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    <div>
                    <button type="submit" className='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;