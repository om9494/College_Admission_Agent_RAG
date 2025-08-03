import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminContext, CollegeContext } from "../App";
import { Link } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAdmin } = useContext(AdminContext);
  const { setCollege } = useContext(CollegeContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_API + `admin/login`, {
        email,
        password,
      });

      
      const { token, admin } = res.data;


      // Update context and localStorage
      setAdmin(admin);
      localStorage.setItem("admin", JSON.stringify(admin));
      localStorage.setItem("token", token);
      const col_res = await axios.get(import.meta.env.VITE_BACKEND_API + `college/get`, {
        params: { name: admin.college }
      });
      setCollege(col_res.data.college);
      localStorage.setItem("college", JSON.stringify(col_res.data.college));


      navigate("/admin");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong. Please try again.");
      console.error("Login Error:", err.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center bg-transparent">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md transition duration-300 hover:shadow-lg hover:shadow-blue-600 hover:border-blue-600 hover:scale-100"> {/* Added responsive width and hover animation */}
        <div className="flex justify-center mb-4"> {/* Centered the image */}
          <img src="../boto.svg" id="lobot" alt="Bot" className="h-40 w-auto" />
        </div>
        <h1 className="text-4xl font-semibold text-center text-indigo-700 mt-0 mb-4">Login as Admin</h1>
        <Link to="/login" className="text-sm font-semibold text-center text-indigo-700  bg-slate-200 rounded-md p-2">Login as User</Link>
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            value={email}
            className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" // Improved input styling
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            value={password}
            className="text-blue-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" // Improved input styling
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" // Improved button styling with hover effect
          >
            Login
          </button>
        </form>
        {message && (
          <p className="text-red-500 text-center mt-4">{message}</p>
        )}
        <div className="text-center mt-4"> {/* Centered the links */}
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">Forgot Password?</Link>
        </div>
        <div className="flex items-center justify-center mt-4">
          <div className="border-t border-gray-300 w-16"></div>
            <span className="mx-4 text-gray-500">OR</span> {/* Improved "OR" separator  */}
          <div className="border-t border-gray-300 w-16"></div>
        </div>
        <div className="text-center mt-4"> {/* Centered the signup link */}
          <Link to="/admin/signup" className="text-indigo-600">Don't have an account? - SignUp</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin