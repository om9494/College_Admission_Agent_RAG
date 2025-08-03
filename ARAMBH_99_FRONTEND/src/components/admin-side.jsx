import React, { useEffect } from 'react'
import { useState } from 'react';
import PersonalGuide from './personal_guide'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import { UserContext, AdminContext, DTEContext } from "../App";
import { Link } from "react-router-dom";
import useSpeechSynthesis from "./ttsService";



export default function AdminSideBar() {
  const [isContentVisible, setIsContentVisible] = useState(false); // State to manage visibility


  const handleDashClick = (id) => {
    window.location.href = '#' + id;
  }

  const handleContentVisible = () => {
    setIsContentVisible(!isContentVisible); // Toggle visibility
  }

  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");
  const dte = localStorage.getItem("dte");
  const navigate = useNavigate();
  const { speak } = useSpeechSynthesis();
  const [activeButton, setActiveButton] = useState(null); // Tracks the active button

  const handleClick = (buttonId) => {
    setActiveButton(buttonId === activeButton ? null : buttonId);
    const event = new CustomEvent('sideBarChange', { detail: activeButton === buttonId ? null : buttonId }); // Corrected line
    window.dispatchEvent(event);
  };


  const getButtonClass = (buttonId) => {
    return activeButton === buttonId ? 'feature_active' : 'feature_inactive';
  };

  const [showDASHSidebar, setShowDASHSidebar] = useState(false);

  const handleDASH = () => {
    setShowDASHSidebar(!showDASHSidebar);
  };

  const handleCloseDASHSidebar = () => {
    setShowDASHSidebar(false);
  };

  return (
    <div>
      <div id='admin-sidebar' className="sidebar bar w-72 p-4 pt-20 h-screen fixed top-0 left-0 z-10 overflow-y-scroll scroll-smooth ">
        <div className="features space-y-4">
          <button className={`feature-button ${getButtonClass('adminprofile')}`} onClick={() => handleClick('adminprofile')}>
            <i className="fas fa-user"></i>
            <h3 className="">Profile</h3>
          </button>

          <button className={`feature-button ${getButtonClass('admininsights')}`} onClick={() => handleClick('admininsights')}>
            <i className="fas fa-lightbulb"></i>
            <h3 className="">College Insights</h3>
          </button>

          <button className={`feature-button ${getButtonClass('adminnotifications')}`} onClick={() => handleClick('adminnotifications')} >
            <i className="fas fa-bell"></i>
            <h3 className="">Notifications</h3>
          </button>

          <button className={`feature-button ${getButtonClass('uploaddata')}`} onClick={() => handleClick('uploaddata')}>
            <i className="fas fa-upload"></i>
            <h3 className="">Upload Data</h3>
          </button>

          <button style={{ display: 'block' }} className={`feature-button ${getButtonClass('admindashboard')}`} onClick={() => handleClick('admindashboard')}>
            <i className="fas fa-dashboard mt-1"></i>
            <h3 className="">Dashboard</h3>
            {/* <div
              className="side-card-content overflow-hidden transition-max-h " // For smoother transitions
              style={{
                // maxHeight: isContentVisible ? 'fit-content' : '0', // Example height, adjust as needed
              }}
            >
              <h2 onClick={() => handleDashClick('address')}>
                ADDRESS
              </h2>
              <h2 onClick={() => handleDashClick('contacts')}>
                CONTACT DETAILS
              </h2>
              <h2 onClick={() => handleDashClick('infrastructure')}>
                INFRASTRUCTURE
              </h2>
              <h2 onClick={() => handleDashClick('courses')}>
                COURSE STRUCTURE
              </h2>
              <h2 onClick={() => handleDashClick('admission')}>
                ADMISSION PROCESS
              </h2>
              <h2 onClick={() => handleDashClick('cutoff')}>
                CUTOFF
              </h2>
              <h2 onClick={() => handleDashClick('placements')}>
                PLACEMENT
              </h2>
              <h2 onClick={() => handleDashClick('alumni-networks')}>
                ALUMNI NETWORKS
              </h2>
              <h2 onClick={() => handleDashClick('events')}>
                EVENTS AND ACTIVITIES
              </h2>
              <h2 onClick={() => handleDashClick('governance')}>
                GOVERNANCE
              </h2>
              <h2 onClick={() => handleDashClick('commitees')}>
                COMMITTEES
              </h2>
              <h2 onClick={() => handleDashClick('other')}>
                OTHER INFORMATION
              </h2>
            </div> */}
          </button>
          <button onClick={handleDASH} className='p-1 relative bottom-14 pb-0 bg-transparent text-black border-none pl-2 pr-2 left-56'> <i className='fa fa-chevron-right'></i></button>

          <div className={`dash-sidebar ${showDASHSidebar ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-full pt-20 w-64 bg-white shadow-lg transition-transform ease-in-out duration-300 z-50 overflow-y-auto`}>
            <button
              onClick={handleCloseDASHSidebar}
              className="absolute top-20 right-2 text-gray-600 hover:text-gray-800 focus:outline-none p-2"
            >
              <i className="fas fa-times"></i> {/* Close icon */}
            </button>

            <div className="p-4">
              <ul className='space-y-8'>
                <h2 onClick={() => handleDashClick('address')}>
                  ADDRESS
                </h2>
                <h2 onClick={() => handleDashClick('contacts')}>
                  CONTACT DETAILS
                </h2>
                <h2 onClick={() => handleDashClick('infrastructure')}>
                  INFRASTRUCTURE
                </h2>
                <h2 onClick={() => handleDashClick('courses')}>
                  COURSE STRUCTURE
                </h2>
                <h2 onClick={() => handleDashClick('admission')}>
                  ADMISSION PROCESS
                </h2>
                <h2 onClick={() => handleDashClick('cutoff')}>
                  CUTOFF
                </h2>
                <h2 onClick={() => handleDashClick('placements')}>
                  PLACEMENT
                </h2>
                <h2 onClick={() => handleDashClick('alumni-networks')}>
                  ALUMNI NETWORKS
                </h2>
                <h2 onClick={() => handleDashClick('events')}>
                  EVENTS AND ACTIVITIES
                </h2>
                <h2 onClick={() => handleDashClick('governance')}>
                  GOVERNANCE
                </h2>
                <h2 onClick={() => handleDashClick('commitees')}>
                  COMMITTEES
                </h2>
                <h2 onClick={() => handleDashClick('other')}>
                  OTHER INFORMATION
                </h2>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
