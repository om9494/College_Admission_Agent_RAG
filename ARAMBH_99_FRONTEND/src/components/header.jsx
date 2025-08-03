import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UserContext, AdminContext, DTEContext } from "../App";
import { useState } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
// import { LanguageContext } from "../contexts/LanguageContext";
import useSpeechSynthesis from "./ttsService";
import translations from "../context/translations.json"; // Import the JSON file





const Header = () => {

  // Dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from local storage during component mount
    const storedDarkMode = localStorage.getItem('darkMode');
    return storedDarkMode ? JSON.parse(storedDarkMode) : false; // Default to false if not set
  });

  useEffect(() => {
    // Apply dark mode class to body when `isDarkMode` changes
    document.body.classList.toggle('dark', isDarkMode);
    // Save the preference to local storage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    // Apply the 'dark' class to the body based on the isDarkMode state
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };


  const { language, setLanguage } = useLanguage();
  const { speak } = useSpeechSynthesis();

  const [text, setText] = useState("");
  const { setUser } = useContext(UserContext); // Add setUser for logout
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");
  const dte = localStorage.getItem("dte");
  const parsedUser = user ? JSON.parse(user) : null; // Parse user once
  const parsedAdmin = admin ? JSON.parse(admin) : null; // Parse admin once
  const parsedDte = dte ? JSON.parse(dte) : null; // Parse dte once
  const navigate = useNavigate();

  const [notification, setNotification] = useState(parsedUser?.notification || false);
  const email = parsedUser?.email || "";
  const name = parsedUser?.name || "";
  const admin_name = parsedAdmin?.name || "";
  const admin_email = parsedAdmin?.email || "";
  const dte_name = parsedDte?.name || "";
  const dte_email = parsedDte?.email || "";


  // console.log("Parsed User:", parsedUser);
  // console.log("Notification State:", notification);
  // console.log("Email:", email);
  // console.log("Name:", name);


  const token = localStorage.getItem("token"); // Retrieve token

  useEffect(() => {
    if (!parsedUser) {
      setNotification(false);
    } else {
      setNotification(parsedUser.notification);
    }
  }, [parsedUser]);

  const handleNotification = async (e) => {
    e.preventDefault();
    const newNotification = e.target.checked; // Get the updated checkbox value
    if (!user) {
      speak("Please Login to Enable Email Notification", language);
      // alert("Please Login for Email Notification");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_API + "auth/notify-user", {
        notification: newNotification,
        email,  // Send user's email
        token,  // Send the JWT token
      });

      if (res.status === 200) {
        setNotification(newNotification); // Update local state

        // Parse the existing user data, update the notification field, and save back to local storage
        const updatedUser = { ...JSON.parse(user), notification: newNotification };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        console.log("Notification updated successfully:", res.data);
      } else {
        alert("Notification update failed");
        console.error("Notification update failed:", res.data);
      }
    } catch (err) {
      alert("Notification update failed");
      console.error("Error updating notification:", err);
    }
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleLanguageChange = (e) => {
    const targetLang = e.target.value;
    setLanguage(targetLang);
    localStorage.setItem('language', targetLang);
  };


  const translate = (key) => {
    return translations[language][key] || key; // Returns the translated text or the original key if not found
  };

  // const handleLanguageChange = (e) => {
  //   const targetLang = e.target.value;
  //   setLanguage(targetLang);
  //   // console.log("Language changed to:", targetLang);
  //   // Example: translate specific static text (adjust as per your use case)
  //   document.querySelectorAll("[data-translate-key]").forEach(async (el) => {
  //     const key = el.innerText;
  //     // console.log("Element text:", el.innerText);
  //     // console.log("Translating key:", key);
  //     const translatedText = await translateText(key, targetLang);
  //     // console.log("Translated text:", translatedText);
  //     el.innerText = translatedText;
  //   });
  // };


  const handleLoginNav = (e) => {
    e.preventDefault();
    window.open(import.meta.env.VITE_FRONTEND_API + "login", "_blank");
    // window.open("http://localhost:5173/login", "_blank");
  }


  return (
    <header className="header">
      <div className="mx-auto">
        <Link className={`text-2xl flex items-center font-bold ${isDarkMode ? 'text-white' : 'text-blue-500'} float-left ml-5 cursor-pointer`} to="/"><img src="logo.png" alt="logo" width="80px" /> <font className="font-thin text-xl relative -top-4 left-4">ASK</font><font className="font-bold text-3xl relative -left-8 -top-2"><br />ACE</font></Link>
        <nav className="flex space-x-4 float-right mr-10">

          {/* <label htmlFor="language" className="text-white mt-2"></label> */}
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}

            className="bg-transparent border border-none rounded px-3 py-1 focus:outline-none"
          >
            <option value="en" title="English">English</option>
            <option value="hi" title="Hindi">हिंदी</option>
            {/* <option value="mr" title="Marathi">मराठी</option>
            <option value="pa" title="Punjabi">ਪੰਜਾਬੀ</option>
            <option value="gu" title="Gujrati">ગુજરાતી</option>
            <option value="sd" title="Sindhi">سنڌي</option> */}
            <option value="mwr" title="Marwadi">मारवाड़ी</option>
          </select>

          <label id="theme" name="Theme" title="Theme Switch" className="switch">
            <p id="status"></p>
            <input type="checkbox" checked={isDarkMode} onChange={handleDarkModeToggle} />
            <span className="theme-slider round"></span>
          </label>


          {parsedAdmin ? (
            <>
            </>
          ) : (
            <>
              <label id="notification" name="Notification" title="Notification and Email Services" className="switch">
                <p id="status"></p>
                <input type="checkbox" checked={notification} onChange={handleNotification} />
                <span className="slider round"></span>
              </label>
            </>
          )}


          <div>
            {parsedUser ? (
              <>
                <button className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200" onClick={() => navigate("/profile")}>{name}</button>
              </>
            ) : parsedAdmin ? (
              <>
                <button className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200" onClick={() => navigate("/admin")} >{admin_name}</button>
              </>
            ) : parsedDte ? (
              <>
                <button className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200" onClick={() => navigate("/dte")} >{dte_name}</button>
              </>
            ) : (
              <>
                <button className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200" onClick={handleLoginNav}> {translate("Login")} </button>
              </>
            )}

          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;