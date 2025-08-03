import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import Header from "../components/header";
import { useLanguage } from '../context/LanguageContext'; // Import the context
import translations from '../context/translations.json';


function Signup() {
  const [formData, setFormData] = useState({ name: "", surname: "", email: "", password: "", notification: false });
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const { language } = useLanguage();  // Access the language from context


    const translate = (key) => {
      return translations[language][key] || key; // Returns translated text or original key
    };


    useEffect(() => {
      // This effect will run whenever the language changes
    }, [language]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlecheckbox = (e) => {
    setFormData({ ...formData, notification: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email || !formData.password || !formData.name || !formData.surname) {
      return setError("All fields are required");
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setError("Invalid email format");
    }

    // phone number validation
    // const phoneRegex = /^[+]?[0-9]{2}-[0-9]{10}$/;
    // if (!phoneRegex.test(formData.phone)) {
    //   return setError("Invalid phone number format");
    // }

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_API + `auth/signup`, {
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
      setUser({ id: data.user.id, name: data.user.name, email: data.user.email, notification: data.user.notification });
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center bg-transparent">
        <div className="login-card p-16 pb-8 pt-8 rounded-lg shadow-md w-full max-w-sm transition duration-300 hover:shadow-lg hover:scale-100"> {/* Added responsive width and hover animation */}
          <div className="flex justify-center mb-4"> {/* Centered the image */}
            <img src="logo.svg" alt="Bot" className="h-40 w-auto" />
          </div>
          <h1 className="text-xl font-semibold text-center text-purple-700 mt-0 mb-4">{translate("Create an Account")}</h1>
          {/* <Link to="/admin/signup" className="text-sm font-semibold text-center text-purple-700 bg-slate-200 rounded-md p-2">Sign Up as Admin</Link> */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="text" onChange={handleChange} placeholder={translate("First Name")} value={formData.name} name="name" />
            <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="text" onChange={handleChange} placeholder={translate("Last Name")} value={formData.surname} name="surname" />
            <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="email" onChange={handleChange} placeholder={translate("Email")} value={formData.email} name="email" />
            <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="password" onChange={handleChange} placeholder={translate("Password")} value={formData.password} name="password" />
            {/* <input className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="tell" onChange={handleChange} pattern="+[1-9]{2}-[0-9]{10}" placeholder={translate("+91-0123456789")} value={formData.phone} name="Phone Number" /> */}
            {/* <input className="" type="checkbox" onChange={handlecheckbox} checked={formData.notification} /> <font color="blue">Allow for Email Service and Notification</font> */}
            <button
              type="submit"
              id="login-btn"
              className="w-full bg-purple-600 py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-black transition duration-300" // Improved button styling with hover effect
            >
              {translate("Sign Up")}
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}

          <div className="flex items-center justify-center mt-4">
            <div className="border-t border-gray-300 w-16"></div>
            <span className="mx-4 text-gray-500">{translate("OR")}</span>
            <div className="border-t border-gray-300 w-16"></div>
          </div>

          <div>
            <button className="p-2 bg-transparent w-full mt-8"><img src="./assets/google.svg" className="float-left w-6" /> {translate("Signup with Google")}</button>
          </div>

          <div className="text-left text-sm mt-6">
            <font className="float-left">{translate("Already have an account?")}</font>
            <Link to="/login" className="float-right">{translate("Login")}</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup