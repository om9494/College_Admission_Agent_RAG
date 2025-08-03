import React from 'react'
import { AdminContext, CollegeContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";

export default function AdminProfile() {
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
        <div className="bg-white p-8 mt-20 rounded-lg w-90 ml-72">  {/* Container for profile info */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {admin.name}!</h2>
            <p className="text-gray-600 text-xl mb-6">Email: {admin.email}</p>
            <p className="text-gray-600 text-xl mb-6">College: {admin.college}</p>
            {/* <Link to="/admin/dashboard" className="bg-blue-500 hover:bg-blue-300 text-white hover:text-blue-600 font-medium py-2 px-4 rounded mr-10">Your College Dashboard</Link> */}
            <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-300 text-white hover:text-blue-600 font-medium py-2 px-4 round focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
                Log Out
            </button>

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
    )
}
