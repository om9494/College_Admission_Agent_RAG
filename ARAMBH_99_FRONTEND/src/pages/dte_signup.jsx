import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DTEContext } from "../App";
import { Link } from "react-router-dom";

function DTESignup() {
  const [formData, setFormData] = useState({ name: "", surname: "", email: "", password: "" });
  
  const [error, setError] = useState("");
  const { setdte } = useContext(DTEContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // if (e.target.name === "college") {
    //   setCollegeData({ ...collegeData, name: e.target.value });
    // }
    // if (e.target.name === "name") {
    //   setCollegeData({ ...collegeData, dteistrator: e.target.value });
    // }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email || !formData.password || !formData.name || !formData.surname) {
      return setError("All fields are required");
    }

    // try {
    //   const res = await fetch(import.meta.env.VITE_BACKEND_API + 'college/create', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(collegeData),
    //   });
    //   const data = await res.json();

    //   if (!res.ok) {
    //     throw new Error(data.message || 'Failed to create college');
    //   }

    //   localStorage.setItem("college", JSON.stringify(data.college));
    // } catch (err) {
    //   setError(err.message);
    //   console.log(err);
    // }

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_API + `dte/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store the token in localStorage (NEW)
      localStorage.setItem("token", data.token);

      // Automatically log in the user after signup (No change here)
      setdte({ id: data.dte.id, name: data.dte.name, email: data.dte.email, college: data.dte.college });
      localStorage.setItem("dte", JSON.stringify(data.dte));
      navigate("/dte");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center bg-transparent">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md transition duration-300 hover:shadow-lg hover:shadow-blue-600 hover:border-blue-600 hover:scale-100"> {/* Added responsive width and hover animation */}
        <div className="flex justify-center mb-4"> {/* Centered the image */}
          <img src="../boto.svg" id="lobot" alt="Bot" className="h-40 w-auto" />
        </div>
        <h1 className="text-4xl font-semibold text-center text-indigo-700 mt-0 mb-4">Sign Up as dte</h1>
        <Link to="/signup" className="text-sm font-semibold text-center text-indigo-700  bg-slate-200 rounded-md p-2">Sign Up as User</Link>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" onChange={handleChange} placeholder="First Name" value={formData.name} name="name" />
          <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" onChange={handleChange} placeholder="Last Name" value={formData.surname} name="surname" />
          <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="email" onChange={handleChange} placeholder="Email" value={formData.email} name="email" />
          <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="password" onChange={handleChange} placeholder="Password" value={formData.password} name="password" />
          
          {/* <input className="" type="checkbox" onChange={handlecheckbox} checked={formData.notification} /> <font color="blue">Allow for Email Service and Notification</font> */}
          <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" type="submit"> Sign Up </button>

        </form>
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

      </div>
    </div>
  )
}

export default DTESignup