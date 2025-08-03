import React, { useContext } from "react";
import { DTEContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import AdminSideBar from "../components/admin-side";




export default function DteDashboard() {
    const { dte, setDte } = useContext(DTEContext);
    const navigate = useNavigate();
    const [collegeData, setCollegeData] = useState({});
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [dataUnavailable, setDataUnavailable] = useState(false);

    const handleSelectCollege = (college) => {
        setSelectedCollege(college);
        setDataUnavailable(false);
    };


    useEffect(() => {
        const loadCollegeData = async () => {
            if (!selectedCollege) {
                // setCollegeData(null); // Set to null if no college selected
                return;
            }

            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'college/get', {
                    params: { name: selectedCollege }
                });

                if (response.status === 200 && response.data.college) {  //Check if college data exists
                    setCollegeData(response.data.college);
                    localStorage.setItem("college", JSON.stringify(response.data.college));
                } else {
                    console.error("College data not found.");
                    setCollegeData(null);  // setCollegeData to null to hide the form
                    setDataUnavailable(true); // Set data unavailable to true
                }
            } catch (error) {
                console.error("Error loading college data:", error);
                setCollegeData(" "); // setCollegeData to null to hide the form
                setDataUnavailable(true);
                alert("Data not Available! ");
            }
        };

        if (dte) {
            loadCollegeData();
        }
    }, [dte, selectedCollege]);


    if (!dte) {
        return (
            <div className="profile-page">
                <h2>Please log in to access Admin Portal</h2>
            </div>
        );
    }


    useEffect(() => {
        // Update UI elements based on collegeData
        if (collegeData) {
            const { name, administrator, information, address, contact, websites, infrastructure, courses, admission_process, cutoff, placement, alumni, events_activities, governance, committees, other } = collegeData;
            // ... update your input fields using refs or state variables
        }
    }, [collegeData]);

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



    if (!dte) {
        return (
            <div className="profile-page">
                <h2>Please log in to access Admin Portal</h2>
            </div>
        );
    }






    return (
        <>
            <div className=" text-blue-800 h-screen bg-white w-screen absolute left-0 top-0 pt-14 right-0 text-left -z-10">
                {/* <h1 className="text-4xl font-bold text-center text-blue-600 mb-4 mt-10"> DTE Dashboard</h1> */}
                <select className="text-blue-600 relative top-10 left-1/3 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => handleSelectCollege(e.target.value)} name="college">
                    <option value="">Select College</option>
                    <option value="CMRB Government Polytechnic College">CMRB Government Polytechnic College</option>
                    <option value="Government Engineering College, Barmer">Government Engineering College, Barmer</option>
                    <option value="Government Polytechnic College, Ajmer">Government Polytechnic College, Ajmer</option>
                    <option value="Government Polytechnic College, Alwar">Government Polytechnic College, Alwar</option>
                    <option value="Government Polytechnic College, Bagidora, Banswara">Government Polytechnic College, Bagidora, Banswara</option>
                    <option value="Government Polytechnic College, Banswara">Government Polytechnic College, Banswara</option>
                    <option value="Government Polytechnic College, Baran">Government Polytechnic College, Baran</option>
                    <option value="Government Polytechnic College, Barmer">Government Polytechnic College, Barmer</option>
                    <option value="Government Polytechnic College, Bharatpur">Government Polytechnic College, Bharatpur</option>
                    <option value="Government Polytechnic College, Bhilwara">Government Polytechnic College, Bhilwara</option>
                    <option value="Government Polytechnic College, Bikaner">Government Polytechnic College, Bikaner</option>
                    <option value="Government Polytechnic College, Bundi">Government Polytechnic College, Bundi</option>
                    <option value="Government Polytechnic College, Chittorgarh">Government Polytechnic College, Chittorgarh</option>
                    <option value="Government Polytechnic College, Churu">Government Polytechnic College, Churu</option>
                    <option value="Government Polytechnic College, Dausa">Government Polytechnic College, Dausa</option>
                    <option value="Government Polytechnic College, Dholpur">Government Polytechnic College, Dholpur</option>
                    <option value="Government Polytechnic College, Dungarpur">Government Polytechnic College, Dungarpur</option>
                    <option value="Government Polytechnic College, Hanumangarh">Government Polytechnic College, Hanumangarh</option>
                    <option value="Government Polytechnic College, Jaipur">Government Polytechnic College, Jaipur</option>
                    <option value="Government Polytechnic College, Jaisalmer">Government Polytechnic College, Jaisalmer</option>
                    <option value="Government Polytechnic College, Jalore">Government Polytechnic College, Jalore</option>
                    <option value="Government Polytechnic College, Jhalawar">Government Polytechnic College, Jhalawar</option>
                    <option value="Government Polytechnic College, Jhunjhunu">Government Polytechnic College, Jhunjhunu</option>
                    <option value="Government Polytechnic College, Jodhpur">Government Polytechnic College, Jodhpur</option>
                    <option value="Government Polytechnic College, Karauli">Government Polytechnic College, Karauli</option>
                    <option value="Government Polytechnic College, Kelwara">Government Polytechnic College, Kelwara</option>
                    <option value="Government Polytechnic College, Kota">Government Polytechnic College, Kota</option>
                    <option value="Government Polytechnic College, Mandore">Government Polytechnic College, Mandore</option>
                    <option value="Government Polytechnic College, Nagaur">Government Polytechnic College, Nagaur</option>
                    <option value="Government Polytechnic College, Neemrana">Government Polytechnic College, Neemrana</option>
                    <option value="Government Polytechnic College, Pali">Government Polytechnic College, Pali</option>
                    <option value="Government Polytechnic College, Pratapgarh">Government Polytechnic College, Pratapgarh</option>
                    <option value="Government Polytechnic College, Rajsamand">Government Polytechnic College, Rajsamand</option>
                    <option value="Government Polytechnic College, Sawai Madhopur">Government Polytechnic College, Sawai Madhopur</option>
                    <option value="Government Polytechnic College, Sikar">Government Polytechnic College, Sikar</option>
                    <option value="Government Polytechnic College, Sirohi">Government Polytechnic College, Sirohi</option>
                    <option value="Government Polytechnic College, Sriganganagar">Government Polytechnic College, Sriganganagar</option>
                    <option value="Government Polytechnic College, Tonk">Government Polytechnic College, Tonk</option>
                    <option value="Government Polytechnic College, Udaipur">Government Polytechnic College, Udaipur</option>
                    <option value="Government Ram Chandra Khaitan Polytechnic College, Jaipur">Government Ram Chandra Khaitan Polytechnic College, Jaipur</option>
                    <option value="Government Residential Women's Polytechnic, Jodhpur">Government Residential Women's Polytechnic, Jodhpur</option>
                    <option value="Government Women Polytechnic College, Ajmer">Government Women Polytechnic College, Ajmer</option>
                    <option value="Government Women Polytechnic College, Bharatpur">Government Women Polytechnic College, Bharatpur</option>
                    <option value="Government Women Polytechnic College, Bikaner">Government Women Polytechnic College, Bikaner</option>
                    <option value="Government Women Polytechnic College, Jaipur">Government Women Polytechnic College, Jaipur</option>
                    <option value="Government Women Polytechnic College, Kota">Government Women Polytechnic College, Kota</option>
                    <option value="Government Women Polytechnic College, Sanganer">Government Women Polytechnic College, Sanganer</option>
                    <option value="Government Women Polytechnic College, Udaipur">Government Women Polytechnic College, Udaipur</option>
                    <option value="Shri Gokul Verma Government Polytechnic College, Bharatpur">Shri Gokul Verma Government Polytechnic College, Bharatpur</option>
                    <option value="Sh Gokul Bhai Bhatt Government Polytechnic College, Sirohi">Sh Gokul Bhai Bhatt Government Polytechnic College, Sirohi</option>
                    <option value="Teachers Training Center and Learning Resource Development Center (TTC & LRDC), Jodhpur">Teachers Training Center and Learning Resource Development Center (TTC & LRDC), Jodhpur</option>
                </select>
                {collegeData && selectedCollege ? (
                    <div className='display-college'>
                        <div className=" bg-white rounded-lg p-8 ml-72 mt-10">
                            <form name="College Data">
                                <div className="space-y-4">
                                    {/* Admin Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Super Admin: <span className="text-gray-700">{dte.name} {dte.surname}</span>
                                        </h3>
                                        <h3 className="text-lg font-semibold">
                                            Administrator : <span className="text-gray-700">{collegeData.administrator}</span>
                                        </h3>
                                        <h3 className="text-lg font-semibold">
                                            College: <span className="text-gray-700">{collegeData.name}</span>
                                        </h3>
                                    </div>

                                    <div className="text-center absolute top-32 right-20">
                                        <Link to="/dte/portal" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</Link>
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
                                    </div>

                                    {/* Governance */}
                                    <div id="governance" className="pt-10">
                                        <br /><br />
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Governance:</h4>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                            placeholder="Enter Information on Governance Here"
                                            value={collegeData.governance}
                                            name="governance"
                                            readOnly
                                            rows={5}>
                                        </textarea>
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
                                    </div>

                                    {/* Other */}
                                    <div id="other" className="pt-10">
                                        <br /><br />
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Other:</h4>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                            placeholder="Enter Other Information Here"
                                            value={collegeData.other}
                                            name="other"
                                            readOnly
                                            rows={5}>
                                        </textarea>
                                    </div>
                                </div>
                            </form >
                        </div >
                    </div >
                ) : null
                }
            </div>
        </>
    )
}
