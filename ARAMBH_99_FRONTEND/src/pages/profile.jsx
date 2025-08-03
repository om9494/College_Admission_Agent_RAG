import React, { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div>
      <Header/>
      <div className="bg-white p-8 rounded-lg shadow-md w-90">  {/* Container for profile info */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {user.name}!</h2>
        <p className="text-gray-600 mb-6">Email: {user.email}</p>
        <button
          onClick={handleLogout}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Profile;
