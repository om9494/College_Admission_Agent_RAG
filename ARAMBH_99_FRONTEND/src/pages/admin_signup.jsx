import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext, CollegeContext } from "../App";
import { Link } from "react-router-dom";

function AdminSignup() {
  const [formData, setFormData] = useState({ name: "", surname: "", email: "", password: "", college: "" });
  const [collegeData, setCollegeData] = useState({
    name: "",
    administrator: "",
    information: "",
    address: "",
    contact: [
      {
        person: "",
        phone: "",
        email: ""
      }
    ],
    websites: [
      {
        name: "",
        link: ""
      }
    ],
    infrastructure: {
      library: "",
      hostel: "",
      canteen: "",
      sports: "",
      labs: "",
      classrooms: "",
      other: ""
    },
    courses: [
      {
        name: "",
        seats: "",
        fees: "",
        eligibility: ""
      }
    ],
    admission_process: "",
    cutoff: "",
    placement: {
      topRecruiters: "",
      statistics: "",
      averagePackages: "",
      other: ""
    },
    alumni: "",
    events_activities: "",
    governance: "",
    commitees: "",
    other: ""
  });  

  const [error, setError] = useState("");
  const { setAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "college") {
      setCollegeData({ ...collegeData, name: e.target.value });
    }
    if (e.target.name === "name") {
      setCollegeData({ ...collegeData, administrator: e.target.value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email || !formData.password || !formData.name || !formData.surname) {
      return setError("All fields are required");
    }

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_API + 'college/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collegeData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create college');
      }

      localStorage.setItem("college", JSON.stringify(data.college));
    } catch (err) {
      setError(err.message);
      console.log(err);
    }

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_API + `admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store the token in localStorage (NEW)
      // localStorage.setItem("token", data.token);

      // Automatically log in the user after signup (No change here)
      setAdmin({ id: data.admin.id, name: data.admin.name, email: data.admin.email, college: data.admin.college });
      // localStorage.setItem("admin", JSON.stringify(data.admin));
      alert("New Admin Account Created");
      navigate("/dte");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center -mt-14 items-center m-0 p-0 bg-transparent">
      <div className="bg-white p-12 rounded-lg shadow-md w-full max-w-md transition duration-300 hover:shadow-lg hover:shadow-blue-600 hover:border-blue-600 hover:scale-100"> {/* Added responsive width and hover animation */}
        <div className="flex justify-center mb-4"> {/* Centered the image */}
          <img src="../logo.svg" id="lobot" alt="Bot" className="h-40 w-auto" />
        </div>
        <h1 className="text-3xl font-semibold text-center text-indigo-700 mt-2 mb-12">Admin Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 pl-5 pr-5">
          <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" onChange={handleChange} placeholder="Admin's First Name" value={formData.name} name="name" />
          <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" onChange={handleChange} placeholder="Admin's Last Name" value={formData.surname} name="surname" />
          <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="email" onChange={handleChange} placeholder="Admin's Email" value={formData.email} name="email" />
          <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="password" onChange={handleChange} placeholder="Admin's Password" value={formData.password} name="password" />
          <select className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={handleChange} value={formData.college} name="college">
            <option value="">Admin's College</option>
            <option value="CMRB Government Polytechnic College">CMRB Government Polytechnic College</option>
            <option value="Government Engineering College, Barmer">Government Engineering College, Barmer</option>
            <option value="Government Polytechnic College, Ajmer">Government Polytechnic College, Ajmer</option>
            <option value="Government Polytechnic College, Alwar">Government Polytechnic College, Alwar</option>
            <option value="Government Polytechnic College, Bagidora, Banswara">Government Polytechnic College, Bagidora, Banswara</option>
            <option value="Government Polytechnic College, Banswara">Government Polytechnic College, Banswara</option>
            <option value="Government Polytechnic College, Baran">Government Polytechnic College, Baran</option>
            <option value="Government Polytechnic College, Barmer">Government Polytechnic College, Barmer</option>
            <option value="Government Polytechnic College, Bharatpur">Government Polytechnic College, Bharatpur</option>
            <option value="Government Polytechnic College, Bhilwara">Government Polytechnic College, Bhilwara</option>
            <option value="Government Polytechnic College, Bikaner">Government Polytechnic College, Bikaner</option>
            <option value="Government Polytechnic College, Bundi">Government Polytechnic College, Bundi</option>
            <option value="Government Polytechnic College, Chittorgarh">Government Polytechnic College, Chittorgarh</option>
            <option value="Government Polytechnic College, Churu">Government Polytechnic College, Churu</option>
            <option value="Government Polytechnic College, Dausa">Government Polytechnic College, Dausa</option>
            <option value="Government Polytechnic College, Dholpur">Government Polytechnic College, Dholpur</option>
            <option value="Government Polytechnic College, Dungarpur">Government Polytechnic College, Dungarpur</option>
            <option value="Government Polytechnic College, Hanumangarh">Government Polytechnic College, Hanumangarh</option>
            <option value="Government Polytechnic College, Jaipur">Government Polytechnic College, Jaipur</option>
            <option value="Government Polytechnic College, Jaisalmer">Government Polytechnic College, Jaisalmer</option>
            <option value="Government Polytechnic College, Jalore">Government Polytechnic College, Jalore</option>
            <option value="Government Polytechnic College, Jhalawar">Government Polytechnic College, Jhalawar</option>
            <option value="Government Polytechnic College, Jhunjhunu">Government Polytechnic College, Jhunjhunu</option>
            <option value="Government Polytechnic College, Jodhpur">Government Polytechnic College, Jodhpur</option>
            <option value="Government Polytechnic College, Karauli">Government Polytechnic College, Karauli</option>
            <option value="Government Polytechnic College, Kelwara">Government Polytechnic College, Kelwara</option>
            <option value="Government Polytechnic College, Kota">Government Polytechnic College, Kota</option>
            <option value="Government Polytechnic College, Mandore">Government Polytechnic College, Mandore</option>
            <option value="Government Polytechnic College, Nagaur">Government Polytechnic College, Nagaur</option>
            <option value="Government Polytechnic College, Neemrana">Government Polytechnic College, Neemrana</option>
            <option value="Government Polytechnic College, Pali">Government Polytechnic College, Pali</option>
            <option value="Government Polytechnic College, Pratapgarh">Government Polytechnic College, Pratapgarh</option>
            <option value="Government Polytechnic College, Rajsamand">Government Polytechnic College, Rajsamand</option>
            <option value="Government Polytechnic College, Sawai Madhopur">Government Polytechnic College, Sawai Madhopur</option>
            <option value="Government Polytechnic College, Sikar">Government Polytechnic College, Sikar</option>
            <option value="Government Polytechnic College, Sirohi">Government Polytechnic College, Sirohi</option>
            <option value="Government Polytechnic College, Sriganganagar">Government Polytechnic College, Sriganganagar</option>
            <option value="Government Polytechnic College, Tonk">Government Polytechnic College, Tonk</option>
            <option value="Government Polytechnic College, Udaipur">Government Polytechnic College, Udaipur</option>
            <option value="Government Ram Chandra Khaitan Polytechnic College, Jaipur">Government Ram Chandra Khaitan Polytechnic College, Jaipur</option>
            <option value="Government Residential Women's Polytechnic, Jodhpur">Government Residential Women's Polytechnic, Jodhpur</option>
            <option value="Government Women Polytechnic College, Ajmer">Government Women Polytechnic College, Ajmer</option>
            <option value="Government Women Polytechnic College, Bharatpur">Government Women Polytechnic College, Bharatpur</option>
            <option value="Government Women Polytechnic College, Bikaner">Government Women Polytechnic College, Bikaner</option>
            <option value="Government Women Polytechnic College, Jaipur">Government Women Polytechnic College, Jaipur</option>
            <option value="Government Women Polytechnic College, Kota">Government Women Polytechnic College, Kota</option>
            <option value="Government Women Polytechnic College, Sanganer">Government Women Polytechnic College, Sanganer</option>
            <option value="Government Women Polytechnic College, Udaipur">Government Women Polytechnic College, Udaipur</option>
            <option value="Shri Gokul Verma Government Polytechnic College, Bharatpur">Shri Gokul Verma Government Polytechnic College, Bharatpur</option>
            <option value="Sh Gokul Bhai Bhatt Government Polytechnic College, Sirohi">Sh Gokul Bhai Bhatt Government Polytechnic College, Sirohi</option>
            <option value="Teachers Training Center and Learning Resource Development Center (TTC & LRDC), Jodhpur">Teachers Training Center and Learning Resource Development Center (TTC & LRDC), Jodhpur</option>

          </select>

          {/* <input type="text" className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={handleChange} placeholder="College" value={formData.college} name="college"></input> */}
          
          {/* <input className="" type="checkbox" onChange={handlecheckbox} checked={formData.notification} /> <font color="blue">Allow for Email Service and Notification</font> */}
          <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" type="submit"> Register </button><br/>
          <Link to="/dte" className="text-indigo-600 relative top-4">Cancel</Link>
        </form>
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
        <div className="text-center mt-4">
          
        </div>
      </div>
    </div>
  )
}

export default AdminSignup