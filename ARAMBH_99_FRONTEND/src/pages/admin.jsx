import React, { useContext, useEffect } from "react";
import { AdminContext, CollegeContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AdminHeader from "../components/admin_header";
import AdminSideBar from "../components/admin-side";
import AdminProfile from "./admin_profile";
import AdminInsights from "./admin_insights";
import AdminNotifications from "./admin_notification";
import AdminPortal from "./admin_portal";
import AdminDashboard from "./admin_dashboard";
import UploadData from "./uploaddata";

function Admin() {
  const { admin, setAdmin } = useContext(AdminContext);
  const { college, setCollege } = useContext(CollegeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("college");
    navigate("/login");
  };

  if (!admin) {
    return (
      <div className="profile-page">
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  const [activeButton, setActiveButton] = React.useState(null);

  React.useEffect(() => {
    const handleSideBarChange = (event) => {
      setActiveButton(event.detail);
      console.log(event.detail);
    };
    window.addEventListener('sideBarChange', handleSideBarChange);
    return () => window.removeEventListener('sideBarChange', handleSideBarChange);
  }, []);

  const renderBody = () => {
    switch (activeButton) {
      case 'adminprofile':
        return <AdminProfile />;
      case 'admininsights':
        return <AdminInsights />;
      case 'adminnotifications':
        return <AdminNotifications />;
      case 'admindashboard':
        return <AdminDashboard />;
      case 'adminportal':
        return <AdminPortal />;
      case 'uploaddata':
        return <UploadData/>
      case null:
        return <AdminProfile />;
      default:
        return <AdminProfile />;
    }
  };

  return (
    <div>
      <AdminHeader />
      <AdminSideBar />
      <div className="absolute top-0 left-0 w-screen h-screen z-0 bg-white">
        {renderBody()}
      </div>
    </div>
  );
}

export default Admin;
