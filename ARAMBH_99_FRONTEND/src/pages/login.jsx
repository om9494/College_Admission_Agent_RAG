import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext, AdminContext, DTEContext, CollegeContext } from "../App";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/header";
import { useLanguage } from '../context/LanguageContext'; // Import the context
import translations from '../context/translations.json';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const { setAdmin } = useContext(AdminContext);
  const { setCollege } = useContext(CollegeContext);
  const { setDte } = useContext(DTEContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();  // Access the language from context

  const translate = (key) => {
    return translations[language][key] || key; // Returns translated text or original key
  };


  useEffect(() => {
    // This effect will run whenever the language changes
  }, [language]);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_API + `auth/combinedLogin`, { //New route
        email,
        password,
      });

      const { token, user, admin, dte, role } = res.data;  // Get the role

      localStorage.setItem("token", token);

      if (role === "user") {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else if (role === "admin") {
        setAdmin(admin);
        localStorage.setItem("admin", JSON.stringify(admin));

        const col_res = await axios.get(import.meta.env.VITE_BACKEND_API + `college/get`, {
          params: { name: admin.college }
        });
        setCollege(col_res.data.college);
        localStorage.setItem("college", JSON.stringify(col_res.data.college));
        navigate("/admin");
      }
      else if (role === "dte") {
        setDte(dte);
        localStorage.setItem("dte", JSON.stringify(dte));
        navigate("/dte");
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong. Please try again.");
      console.error(err);
      console.error("Login Error:", err.response?.data?.message);
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
          <h1 className="text-xl font-semibold text-center text-black mt-0 mb-4">{translate("Hi, User")}</h1>
          {/* <Link to="/admin/login" className="text-sm font-semibold text-center text-purple-700  bg-slate-200 rounded-md p-2">Login as Admin</Link> */}
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translate("Email")}
              value={email}
              className="text-purple-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" // Improved input styling
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={translate("Password")}
              value={password}
              className="text-purple-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" // Improved input styling
            />
            <button
              type="submit"
              id="login-btn"
              className="w-full bg-purple-600 py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-black transition duration-300" // Improved button styling with hover effect
            >
              {translate("Login")}
            </button>
          </form>
          {message && (
            <p className="text-red-500 text-center mt-4">{message}</p>
          )}
          <div className="text-right text-sm mt-4"> {/* Centered the links */}
            <Link to="/forgot-password" className="text-purple-600 hover:underline">{translate("Forgot Password?")}</Link>
          </div>
          <div className="flex items-center justify-center mt-4">
            <div className="border-t border-gray-300 w-16"></div>
            <span className="mx-4 text-gray-500">{translate("OR")}</span>
            <div className="border-t border-gray-300 w-16"></div>
          </div>
          <div>
            <button className="p-2 bg-transparent w-full mt-8"><img src="./assets/google.svg" className="float-left w-6" /> {translate("Login with Google")}</button>
          </div>
          <div className="text-left text-sm mt-6"> {/* Centered the signup link */}
            <font className="float-left">{translate("Don't have an account?")}</font>
            <Link to="/signup" className="float-right">{translate("SignUp")}</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login