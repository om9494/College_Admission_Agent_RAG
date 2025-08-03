import React from 'react'
import { AdminContext, CollegeContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
export default function AdminInsights() {

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

    return (
        <div className="bg-white p-8 mt-20 rounded-lg w-90 ml-72 text-left">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Data Insights</h2>
            <p className="text-gray-800 text-2xl mb-6">College: {admin.college}</p>
            <iframe src="https://ace-data-insights-render.onrender.com/" className='w-full h-screen'></iframe>
        </div>
    )
}
