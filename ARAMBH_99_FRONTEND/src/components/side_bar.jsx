import React, { useEffect } from 'react'
import { useState } from 'react';
import PersonalGuide from './personal_guide'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import { UserContext, AdminContext, DTEContext } from "../App";
import { Link } from "react-router-dom";
import useSpeechSynthesis from "./ttsService";



export default function SideBar() {
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");
  const dte = localStorage.getItem("dte");
  const navigate = useNavigate();
  const { speak } = useSpeechSynthesis();
  const [activeButton, setActiveButton] = useState(null); // Tracks the active button


  const handleClick = (buttonId) => {
    if (!user && !admin && !dte) {
      speak("Please Login to Access " + translate(buttonId), language);
      navigate("/login");
      return;
    }
    setActiveButton(buttonId === activeButton ? null : buttonId);
    const event = new CustomEvent('sideBarChange', { detail: activeButton === buttonId ? null : buttonId }); // Corrected line
    window.dispatchEvent(event);
  };


  const getButtonClass = (buttonId) => {
    return activeButton === buttonId ? 'feature_active' : 'feature_inactive';
  };

  const handleSideClose = () => {
    const event = new CustomEvent('sideBarChange', { detail: 'close_sidebar' });
    document.getElementById("sidebar").classList.remove("w-72");
    document.getElementById("sidebar").classList.add("w-0");
    document.getElementById("sidebar").classList.remove("p-6");
    document.getElementById("sidebar").classList.add("p-0");
    document.getElementById("chat-container").style.left = "10px";
    document.getElementById("side-open").classList.remove("hidden");
    window.dispatchEvent(event);
  };

  const handleSideOpen = () => {
    const event = new CustomEvent('sideBarChange', { detail: 'open_sidebar' });
    document.getElementById("sidebar").classList.remove("w-0");
    document.getElementById("sidebar").classList.add("w-72");
    document.getElementById("sidebar").classList.remove("p-0");
    document.getElementById("sidebar").classList.add("p-6");
    document.getElementById("chat-container").style.left = "300px";
    document.getElementById("side-open").classList.add("hidden");
    window.dispatchEvent(event);
  };

  const handleDownloadChat = () => {
    const event = new CustomEvent('downloadChatRequest');
    window.dispatchEvent(event);
  };

  const { language } = useLanguage();  // Access the language from context


  const translate = (key) => {
    return translations[language][key] || key; // Returns translated text or original key
  };


  useEffect(() => {
    // This effect will run whenever the language changes
  }, [language]);


  const [showFAQSidebar, setShowFAQSidebar] = useState(false);

  const handleFAQs = () => {
    setShowFAQSidebar(!showFAQSidebar);
  };

  const handleCloseFAQSidebar = () => {
    setShowFAQSidebar(false);
  };

  const ask_feedback = () => {
    const type = "Neutral";
    const id = -1;
    // Asks feedback from user by displaying POP uP
    const popup = document.createElement('div');
    popup.id = "feedbackPopup";
    popup.className = "popupn";
    const title = "We appreciate your feedback!";
    popup.innerHTML = `
      <h3>${title}</h3>
      <textarea id="feedbackText" placeholder="Enter your feedback..."></textarea>
      <button onclick="submitFeedback('${type}', ${id})">Submit</button>
      <button onclick="closeFeedbackPopup()">Close</button>
      `;
    document.body.appendChild(popup);
  }



  return (
    <div>
      <i id="side-open" className='fa-solid fa-chevron-right hidden text-2xl fixed left-5 z-10 cursor-pointer p-2 hover:bg-slate-400 rounded-full text-blue-600' onClick={handleSideOpen}></i>
      <div id="sidebar" className="sidebar bar w-72 p-6 pt-10 h-screen fixed top-0 left-0 overflow-y-scroll scroll-smooth ">
        <div id='side-head'><Link className={`text-2xl flex items-center font-bol text-blue-500 float-left ml-5 cursor-pointer`} to="/"><img src="logo.png" alt="logo" width="80px" /> <font className="font-thin text-xl relative -top-4 left-4">ASK</font><font className="font-bold text-3xl relative -left-8 -top-2"><br />ACE</font></Link>
        </div>
        <button className='mb-4 w-full rounded-3xl'>{translate("Download Chat")}</button>
        <hr></hr>
        <div className="features space-y-4">
          <button className={`feature-button ${getButtonClass('collegeComparison')}`} onClick={() => handleClick('collegeComparison')}>
            <i className="fas fa-search"></i>
            <h3 className="">{translate("College Comparison")}</h3>
          </button>

          <button className={`feature-button ${getButtonClass('personalizedGuidance')}`} onClick={() => handleClick('personalizedGuidance')}>
            <i className="fas fa-graduation-cap"></i>
            <h3 className="">{translate("Personal Counselling")}</h3>
          </button>

          <button className={`feature-button ${getButtonClass('admissionGuidance')}`} onClick={() => handleClick('admissionGuidance')}>
            <i className="fas fa-bell"></i>
            <h3 className="">{translate("Admission Guidance")}</h3>
          </button>
        </div>
        <br /><br />
        <center>
          <div className="opt-holder-side">
            <div className='opt-side'>
              <button className='' onClick={handleFAQs}> {/* Feedback button */}
                {translate("FAQs")}
              </button>
            </div>
            <div className='opt-side'>
              <button className='' onClick={ask_feedback}> {/* Feedback button */}
                {translate("Feedback")}
              </button>
              {/* FAQ Sidebar */}
              <div className={`faq-sidebar ${showFAQSidebar ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform ease-in-out duration-300 z-50 overflow-y-auto`}>
                <button
                  onClick={handleCloseFAQSidebar}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <i className="fas fa-times"></i> {/* Close icon */}
                </button>

                <div className="p-4">
                  {/* FAQ Buttons */}
                  <ul>
                    {[...Array(10)].map((_, index) => (
                      <li key={index} className="mb-2">
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg w-full text-left">
                          FAQ Item {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='opt-side'>
              <button className=''>
                {translate("Contact")}
              </button>
            </div>
          </div>
        </center>
        <p className="relative top-44 text-center text-sm text-gray-500">© ACE by Arambh_99</p>
      </div>
    </div>
  )
}