import React, { useContext } from 'react';
import { DTEContext } from '../App'; // Assuming DteContext is defined in your App.js
import { useNavigate } from 'react-router-dom';

export default function DteInsights() {
    const { dte, setDte } = useContext(DTEContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setDte(null);
        localStorage.removeItem('dte');
        localStorage.removeItem('token'); // Assuming you store token in localStorage
        navigate('/login');
    };

    if (!dte) {
        return (
            <div className="profile-page">
                <h2>Please log in to view your profile</h2>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 mt-20 rounded-lg w-90 ml-72 text-left">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Data Insights</h2>
            <p className="text-gray-800 text-2xl mb-6">
                College: {dte.college || 'N/A'} {/* Handle potential missing college data */}
            </p>
            {/* Add other relevant insights for DTE here */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
