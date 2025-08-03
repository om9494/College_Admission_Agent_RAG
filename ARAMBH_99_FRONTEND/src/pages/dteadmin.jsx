import React, { useContext } from "react";
import { DTEContext, CollegeContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AdminHeader from "../components/admin_header";
import AdminSideBar from "../components/admin-side";
import DteProfile from "./dte_profile";
import DteInsights from "./dte_insights";
import DteNotifications from "./dte_notification";
import DteDashboard from "./dtedashboard";
import DtePortal from "./dteportal";


function DteAdmin() {
  const { dte, setDte } = useContext(DTEContext);
  const { college, setCollege } = useContext(CollegeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setDte(null);
    localStorage.removeItem("dte");
    localStorage.removeItem("token");
    localStorage.removeItem("college");
    navigate("/login");
  };

  if (!dte) {
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
        return <DteProfile />;
      case 'admininsights':
        return <DteInsights />;
      case 'adminnotifications':
        return <DteNotifications />;
      case 'admindashboard':
        return <DteDashboard />;
      case 'adminportal':
        return <DtePortal />;
      case null:
        return <DteProfile />;
      default:
        return <DteProfile />;
    }
  };

  return (
    <div>
      <AdminHeader/>
      <AdminSideBar/>
      <div className="absolute top-0 left-0 w-screen h-screen z-0 bg-white">
        {renderBody()}
      </div>
    </div>
  );
}

export default DteAdmin;
