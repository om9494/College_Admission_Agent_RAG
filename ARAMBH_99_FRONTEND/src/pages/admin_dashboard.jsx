import React, { useContext } from "react";
import { AdminContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import AdminSideBar from "../components/admin-side";




function AdminDashboard() {
    const { admin, setAdmin } = useContext(AdminContext);
    const navigate = useNavigate();
    const [collegeData, setCollegeData] = useState({});
    const [initialLoad, setInitialLoad] = useState(true);


    useEffect(() => {
        const loadCollegeData = async () => {
            try {
                const storedCollege = localStorage.getItem("college");
                if (storedCollege) {
                    setCollegeData(JSON.parse(storedCollege));
                    setInitialLoad(false); // Data loaded from localStorage
                } else {
                    // Fetch initial data from the server if not in localStorage
                    const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'college/get', {
                        params: { name: admin.college }
                    }); // Assumes you have a route to fetch college by name
                    if (response.status === 200) {
                        setCollegeData(response.data.college);
                        localStorage.setItem("college", JSON.stringify(response.data.college));
                        setInitialLoad(false); // Data loaded from server
                    } else {
                        setError("Failed to load college data.");
                    }
                }
            } catch (err) {
                setError("Error loading college data: " + err.message);
            }
        }

        if (admin && initialLoad) {
            loadCollegeData();
        }

    }, [admin, initialLoad]);


    useEffect(() => {
        // Update UI elements based on collegeData.  This is a placeholder - you need to adapt it to your specific form elements.
        if (!initialLoad) {
            // Example:
            const { name, administrator, information, address, contact, websites, infrastructure, courses, admission_process, cutoff, placement, alumni, events_activities, governance, committees, other } = collegeData;
            // ... update your input fields using refs or by ID:
            //  document.getElementById('name-input').value = name; etc...
        }
    }, [collegeData, initialLoad]);

    const contacts = collegeData.contact || []; // Get contacts from collegeData, default to empty array
    const websites = collegeData.websites || []; // Get websites from collegeData, default to empty array
    const courses = collegeData.courses || []; // Get courses from collegeData, default to empty array


    const handlePlacementTopics = (topic) => {
        // Create a mapping object for converting display names to database keys
        const topicMapping = {
            "Top Recruiters": "topRecruiters",
            "Statistics": "statistics",
            "Average Packages": "averagePackages",
            "Other": "other",
        };

        //Convert the display name to a database key
        const dbKey = topicMapping[topic];
        return dbKey;
    };



    const handleLogout = () => {
        setAdmin(null);
        localStorage.removeItem("admin");
        navigate("/login");
    };

    if (!admin) {
        return (
            <div className="profile-page">
                <h2>Please log in to access Admin Portal</h2>
            </div>
        );
    }

    return (
        <>
            <AdminHeader />
            <AdminSideBar />
            <div className=" text-blue-800 h-fit bg-white w-screen absolute left-0 top-0 pt-14 right-0 text-left -z-10">
                <div className=" bg-white rounded-lg p-8 ml-72">
                    <h1 className="text-3xl font-bold text-blue-600 mb-4">Admin Dashboard</h1>
                    <form name="College Data">
                        <div className="space-y-4">
                            {/* Admin Info */}
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Admin Name: <span className="text-gray-700">{admin.name} {admin.surname}</span>
                                </h3>
                                <h3 className="text-lg font-semibold">
                                    College: <span className="text-gray-700">{admin.college}</span>
                                </h3>
                            </div>

                            <div className="text-center absolute top-32 right-20">
                                <Link to="/admin/portal" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</Link>
                            </div>

                            {/* College Information */}
                            <div id='college-information' className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">College Information:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter College Information Here"
                                    value={collegeData.information}
                                    name="information"
                                    readOnly
                                    rows={5}>
                                </textarea>
                            </div>

                            {/* Address */}
                            <div className="pt-10" id="address">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Address:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter Address Here"
                                    value={collegeData.address}
                                    name="address"
                                    readOnly
                                    rows={5}>
                                </textarea>
                            </div>

                            {/* Contact Details */}
                            <div id='contacts' className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-4">Contact Details:</h4>
                                <table className="w-full text-left border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 px-4 py-2">Contact Person</th>
                                            <th className="border border-gray-300 px-4 py-2">Phone Number</th>
                                            <th className="border border-gray-300 px-4 py-2">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.map((contact, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        className="w-full border-gray-300 rounded p-2"
                                                        type="text"
                                                        placeholder="Enter Contact Person"
                                                        value={contact.person}
                                                        readOnly
                                                        required
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        className="w-full border-gray-300 rounded p-2"
                                                        type="tel"
                                                        placeholder="Enter Phone Number"
                                                        value={contact.phone}
                                                        readOnly
                                                        required
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        className="w-full border-gray-300 rounded p-2"
                                                        type="email"
                                                        placeholder="Enter Email"
                                                        value={contact.email}
                                                        readOnly
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Websites / Links */}
                            <div id='websites' className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-4">Website / Links:</h4>
                                <table className="w-full text-left border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 px-4 py-2">Name</th>
                                            <th className="border border-gray-300 px-4 py-2">Link</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {websites.map((website, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        className="w-full border-gray-300 rounded p-2"
                                                        type="text"
                                                        placeholder="Enter Website Name"
                                                        value={website.name}
                                                        readOnly
                                                        required
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        className="w-full border-gray-300 rounded p-2"
                                                        type="url"
                                                        placeholder="Enter Link"
                                                        value={website.link}
                                                        readOnly
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Infrastructure */}
                            <div id='infrastructure' className="pt-10">
                                <br /><br />
                                {collegeData.infrastructure && ( //Check if infrastructure exists
                                    <>
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Infrastructure:</h4>
                                        <div className="space-y-4">
                                            {["Library", "Hostel", "Canteen", "Sports", "Labs", "Classrooms", "Other"].map((facility) => (
                                                <div key={facility}>
                                                    <h6 className="text-lg font-semibold">{facility}:</h6>
                                                    <textarea
                                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                                        placeholder={`${facility} information here`}
                                                        value={collegeData.infrastructure[facility.toLowerCase()] || ""}
                                                        name={`infrastructure.${facility.toLowerCase()}`}
                                                        readOnly
                                                        rows={3}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {!collegeData.infrastructure && <p>Loading infrastructure data...</p>} {/* Display loading message */}
                            </div>

                            {/* Course Offerings */}
                            <div id='courses' className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-4">Course Offerings:</h4>
                                <table className="w-full text-left border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 px-4 py-2">Department/ Course/ Branch</th>
                                            <th className="border border-gray-300 px-4 py-2">Seats/ Capacities</th>
                                            <th className="border border-gray-300 px-4 py-2">Fee Structure</th>
                                            <th className="border border-gray-300 px-4 py-2">Eligibility Criteria</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        className="w-full border-gray-300 rounded p-2"
                                                        type="text"
                                                        placeholder="Enter Course Name"
                                                        value={course.name}
                                                        readOnly
                                                        required
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <textarea
                                                        className="w-full border-gray-300 rounded p-2"
                                                        placeholder="Enter Seat Structure"
                                                        value={course.seats}
                                                        readOnly
                                                        required
                                                    ></textarea>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <textarea
                                                        className="w-full border-gray-300 rounded p-2"
                                                        placeholder="Enter Fees Structure"
                                                        value={course.fees}
                                                        readOnly
                                                        required
                                                    ></textarea>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <textarea
                                                        className="w-full border-gray-300 rounded p-2"
                                                        placeholder="Enter Eligibility Criteria"
                                                        value={course.eligibility}
                                                        readOnly
                                                        required
                                                    ></textarea>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Admission Process */}
                            <div id='admission' className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Admission Process and scholarships:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter Admission Process Here"
                                    value={collegeData.admission_process}
                                    name="admission_process"
                                    readOnly
                                    rows={5}>
                                </textarea>
                            </div>

                            {/* Cut-off Details */}
                            <div id='cutoff' className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Cut-off Details:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter Cut-off Details Here"
                                    value={collegeData.cutoff}
                                    name="cutoff"
                                    readOnly
                                    rows={5}>
                                </textarea>
                            </div>


                            {/* Placement Records */}
                            <div id='placements' className="pt-10">
                                <br /><br />
                                {collegeData.placement && ( //Check if placement exists
                                    <>
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Placements:</h4>
                                        <div className="space-y-4">
                                            {["Top Recruiters", "Statistics", "Average Packages", "Other"].map((topic) => (
                                                <div key={topic}>
                                                    <h6 className="text-lg font-semibold">{topic}:</h6>
                                                    <textarea
                                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                                        placeholder={`${topic} information here`}
                                                        value={collegeData.placement[handlePlacementTopics(topic)] || ""}
                                                        name={`placement.${handlePlacementTopics(topic)}`}
                                                        readOnly
                                                        rows={3}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {!collegeData.placement && <p>Loading placement data...</p>} {/* Display loading message */}
                            </div>

                            {/* Alumni Networks */}
                            <div id="alumni-networks" className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Alumni Networks:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter Information on Alumni Networks Here"
                                    value={collegeData.alumni}
                                    name="alumni"
                                    readOnly
                                    rows={5}>
                                </textarea>
                                {/* <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</button> */}
                            </div>

                            {/* Events and Activities */}
                            <div id="events-activities" className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Events and Activities:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter Information on Events and Activities Here"
                                    value={collegeData.events_activities}
                                    name="events_activities"
                                    readOnly
                                    rows={5}>
                                </textarea>
                                {/* <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</button> */}
                            </div>

                            {/* Governance and Committees */}
                            <div id="governance-committees" className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Governance:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter Information of Governance Here"
                                    value={collegeData.governance}
                                    name="governance"
                                    readOnly
                                    rows={5}>
                                </textarea>
                                {/* <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</button> */}
                            </div>

                            {/* Committees */}
                            <div id="committees" className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Committees:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter Information on Committees Here"
                                    value={collegeData.committees}
                                    name="committees"
                                    readOnly
                                    rows={5}>
                                </textarea>
                                {/* <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</button> */}
                            </div>


                            {/* Other Information */}
                            <div id="other-information" className="pt-10">
                                <br /><br />
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Other Information:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter Other Information Here"
                                    value={collegeData.other}
                                    name="other"
                                    readOnly
                                    rows={5}>
                                </textarea>
                                {/* <buttonclassName="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</button> */}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>

    );
}
export default AdminDashboard;
