import React, { useContext, useEffect, useState } from 'react';
import { DTEContext } from '../App'; // Assuming DteContext is defined in your App.js
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const DteProfile = () => {
    const { dte, setDte } = useContext(DTEContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setDte(null);
        localStorage.removeItem('dte');
        localStorage.removeItem('token'); // Assuming token is stored
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
        <div className="bg-white p-8 mt-20 rounded-lg w-90 ml-72">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Welcome, {dte.name}!
            </h2>
            <p className="text-gray-600 text-xl mb-6">Email: {dte.email}</p>
            <p className="text-gray-600 text-xl mb-6">
                Department: {dte.department || 'N/A'}
            </p>
            {/* Add other relevant DTE profile details here */}

            <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Log Out
            </button>
            <Link to="/admin/signup" className="text-sm font-semibold text-center text-indigo-700  bg-slate-200 rounded-md p-2">Add New Admin</Link>

            <h3 className='text-2xl font-semibold mt-10'>Complete Process of Information filling</h3>
            <img className="cursor-pointer mx-auto" src="https://s3-alpha-sig.figma.com/img/296e/0284/dd647d48bd963d4c98b314f5c300b5f1?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ux5zwKg-LThOhU10h~2TcS2XHMIghRfBSXDUh58-D9zDq9pcS4U1OyJfBhyjTSAHzOeeaZTUY7uvgMqhxY~piwC32vfXK7QSfeA1XOZNp8L6w4iASrSSghZkwTYl9MvUPLFu1p3ofJRXrl0BsBXJeNroL~eWkHsrph3Ek770cGJUx0nHttmT995yYcWHsZ~~PrKGjrzz5xGSDusHWmsgt2YME887O1uBiMaoGgDvYDq1M-9eggScpNHaBAVLe7F2aaEDN0nzdcv3PjcjeYq~Veis8NK4PSlQ7wGulvW-Q~ZaIfSdWEpaUEb9FP049iCdwDCw-Ky8eIE6UHi9kw0paw__" />
            <div className="text-left p-5 bg-blue-100 text-black rounded-xl">
                <h3 className="text-blue-500 font-semibold mb-4">Instructions</h3>
                1. College admins must ensure accurate and complete information is entered regarding courses, fees, placements, and infrastructure.<br/>
                2. All data should be uploaded in the prescribed format provided by DTE to maintain uniformity.<br/>
                3. Supporting documents, such as brochures and certifications, must be valid and attached where required.<br/>
                4. Admins should carefully verify all information to avoid errors or discrepancies in the portal.<br/>
                5. Regular updates must be made to keep the information current and reliable.<br/>
                6. Submissions should be completed within the specified deadlines to ensure timely processing.<br/>
            </div>
        </div>
    );
};

export default DteProfile;

