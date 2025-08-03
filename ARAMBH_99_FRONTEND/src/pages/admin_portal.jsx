import React, { useContext } from "react";
import { AdminContext, CollegeContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import AdminSideBar from "../components/admin-side";



function AdminPortal() {
    const { admin, setAdmin } = useContext(AdminContext);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [collegeData, setCollegeData] = useState({});
    const [initialLoad, setInitialLoad] = useState(true);
    const [originalCollege, setOriginalCollege] = useState(null);



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
        if (!initialLoad) {
            setOriginalCollege({ ...collegeData })
        }
    }, [admin, initialLoad, collegeData]);


    useEffect(() => {
        // Update UI elements based on collegeData.  This is a placeholder - you need to adapt it to your specific form elements.
        if (!initialLoad) {
            // Example:
            const { name, administrator, information, address, contact, websites, infrastructure, courses, admission_process, cutoff, placement, alumni, events_activities, governance, committees, other } = collegeData;
            // ... update your input fields using refs or by ID:
            //  document.getElementById('name-input').value = name; etc...
        }
    }, [collegeData, initialLoad]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...collegeData };

        // Handle nested objects
        const nestedKeys = name.split(".");
        if (nestedKeys.length > 1) {
            let currentLevel = updatedData;
            for (let i = 0; i < nestedKeys.length - 1; i++) {
                currentLevel = currentLevel[nestedKeys[i]];
                if (!currentLevel) {
                    //Handle missing nested objects appropriately. For now, we will just ignore the update
                    console.warn(`Nested object ${nestedKeys.slice(0, i + 1).join(".")} is missing.`);
                    return;
                }
            }
            currentLevel[nestedKeys[nestedKeys.length - 1]] = value;

        } else {
            updatedData[name] = value;
        }

        setCollegeData(updatedData);
    };



    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_API + 'college/update', {
                name: collegeData.name,
                administrator: collegeData.administrator,
                information: collegeData.information,
                address: collegeData.address,
                contact: collegeData.contact,
                websites: collegeData.websites,
                infrastructure: collegeData.infrastructure,
                courses: collegeData.courses,
                admission_process: collegeData.admission_process,
                cutoff: collegeData.cutoff,
                placement: collegeData.placement,
                alumni: collegeData.alumni,
                events_activities: collegeData.events_activities,
                governance: collegeData.governance,
                committees: collegeData.committees,
                other: collegeData.other
            });

            let updateMessage = `College ${collegeData.name} updated by admin ${admin.name}:\n`;

            for (const field in response.data.college) {
                if (originalCollege && originalCollege.hasOwnProperty(field)) {
                    const originalValue = originalCollege[field];
                    const updatedValue = response.data.college[field];

                    if (typeof originalValue === 'object' && typeof updatedValue === 'object') {
                        if (Array.isArray(updatedValue)) { // Check if it's an array
                            for (let i = 0; i < updatedValue.length; i++) {
                                const originalItem = originalValue[i] || {}; // Handle cases where originalValue is shorter
                                const updatedItem = updatedValue[i];

                                for (const key in updatedItem) {
                                    if (originalItem[key] !== updatedItem[key]) {
                                        updateMessage += `- ${field}[${i}].${key}: ${originalItem[key]} => ${updatedItem[key]}\n`;
                                    }
                                }


                            }
                        }
                        else {  // Regular Object
                            for (const key in updatedValue) {
                                if (originalValue.hasOwnProperty(key) && originalValue[key] !== updatedValue[key]) {
                                    updateMessage += `- ${field}.${key}: ${originalValue[key]} => ${updatedValue[key]}\n`;
                                }
                            }
                        }

                    } else if (originalValue !== updatedValue) {
                        updateMessage += `- ${field}: ${originalValue} => ${updatedValue}\n`;
                    }
                } else if (!originalCollege || (!originalCollege.hasOwnProperty(field) && response.data.college.hasOwnProperty(field) && response.data.college[field])) {
                    updateMessage += `- ${field} : Newly Added: ${JSON.stringify(response.data.college[field])}\n`
                }
            }






            // let updateMessage = `College ${collegeData.name} updated by admin ${admin.email}:\n\n`;    

            const sendNotification = await axios.post(import.meta.env.VITE_BACKEND_API + 'notification/send', {
                recipient: import.meta.env.VITE_DTE_EMAIL,
                sender: admin.email,
                message: updateMessage,
                college: collegeData.name,
                type: "update"
            });

            if (sendNotification.status >= 200 && sendNotification.status < 300) { //Check for successful status range (2xx). Or specifically check for 200
                console.log("Notification sent successfully!");
            }
            else {
                console.error("Failed to send notification:", sendNotification.data);
                //Optionally throw an error to handle it further up.
                throw new Error(sendNotification.data.message || "Failed to send notification!");
            }

            const emailer = await fetch(import.meta.env.VITE_BACKEND_API + 'college/emailler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: collegeData.name
                })
            });

            if (!emailer.ok) {
                const emaildta = await emailer.json(); //Parse error only when necessary
                throw new Error(emaildta.message || "Failed to verify update!");
            }

            if (response.status === 200) {
                localStorage.setItem("college", JSON.stringify(response.data.college));
                setCollegeData(response.data.college);
                console.log("College updated successfully!");
                navigate("/admin");
            } else {
                throw new Error("Failed to update college.");
            }
        } catch (err) {
            setError("Error updating college: " + err.message);
            console.error("Error updating:", err);
        }
    };

    const contacts = collegeData.contact || []; // Get contacts from collegeData, default to empty array
    const websites = collegeData.websites || []; // Get websites from collegeData, default to empty array
    const courses = collegeData.courses || []; // Get courses from collegeData, default to empty array



    const handleAddRow = (arrayName, defaultValue) => {
        setCollegeData({ ...collegeData, [arrayName]: [...collegeData[arrayName], defaultValue] });
    };

    const handleDeleteRow = (arrayName, index) => {
        const updatedArray = [...collegeData[arrayName]];
        updatedArray.splice(index, 1);
        setCollegeData({ ...collegeData, [arrayName]: updatedArray });
    };

    const handleUpdateRow = (arrayName, index, field, value) => {
        const newArray = [...collegeData[arrayName]];
        newArray[index] = { ...newArray[index], [field]: value }; // Update only the specific field
        setCollegeData({ ...collegeData, [arrayName]: newArray });
    };

    const addContactRow = () => {
        handleAddRow("contact", { person: "", phone: "", email: "" });
    };

    const deleteContactRow = (index) => {
        handleDeleteRow("contact", index);
    };

    const updateContact = (index, field, value) => {
        handleUpdateRow("contact", index, field, value);
    };


    const addWebRow = () => {
        handleAddRow("websites", { name: "", link: "" });
    };

    const deleteWebRow = (index) => {
        handleDeleteRow("websites", index);
    };

    const updateWebsite = (index, field, value) => {
        handleUpdateRow("websites", index, field, value);
    };

    const addCourseRow = () => {
        handleAddRow("courses", { name: "", seats: "", fees: "", eligibility: "" });
    };

    const deleteCourseRow = (index) => {
        handleDeleteRow("courses", index);
    };

    const updateCourse = (index, field, value) => {
        handleUpdateRow("courses", index, field, value);
    };


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
                    <form name="College Data" onSubmit={handleUpdate}>
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


                            {/* Submit/ Update Details */}
                            <div className="text-center absolute top-28 right-20">
                                <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-5">Update</button>
                                <Link to="/admin" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-5">Cancel</Link>
                            </div>

                            {/* College Information */}
                            <div id='college-information' className="pt-10">
                                <br /><br /><h4 className="text-xl font-semibold text-gray-800 mb-2">College Information:</h4>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                    placeholder="Enter College Information Here"
                                    value={collegeData.information}
                                    name="information"
                                    onChange={handleInputChange}
                                    rows={5}>
                                </textarea>
                                {/* <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</button> */}
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
                                    onChange={handleInputChange}
                                    rows={5}>
                                </textarea>
                                {/* <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Edit</button> */}
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
                                            <th className="border border-gray-300 px-4 py-2">Delete</th>
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
                                                        onChange={(e) => updateContact(index, "person", e.target.value)}

                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        className="w-full border-gray-300 rounded p-2"
                                                        type="tel"
                                                        placeholder="Enter Phone Number"
                                                        value={contact.phone}
                                                        onChange={(e) => updateContact(index, "phone", e.target.value)}

                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        className="w-full border-gray-300 rounded p-2"
                                                        type="email"
                                                        placeholder="Enter Email"
                                                        value={contact.email}
                                                        onChange={(e) => updateContact(index, "email", e.target.value)}

                                                    />
                                                </td>
                                                <td align="center">
                                                    <button
                                                        type="button"
                                                        className="text-red-500 bg-blue-100 p-2"
                                                        onClick={() => deleteContactRow(index)}
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={addContactRow}
                                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    + Add Contact
                                </button>
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
                                            <th className="border border-gray-300 px-4 py-2">Delete</th>
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
                                                        onChange={(e) =>
                                                            updateWebsite(index, "name", e.target.value)
                                                        }

                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        className="w-full border-gray-300 rounded p-2"
                                                        type="url"
                                                        placeholder="Enter Link"
                                                        value={website.link}
                                                        onChange={(e) =>
                                                            updateWebsite(index, "link", e.target.value)
                                                        }

                                                    />
                                                </td>
                                                <td align="center">
                                                    <button
                                                        type="button"
                                                        className="text-red-500 bg-blue-100 p-2"
                                                        onClick={() => deleteWebRow(index)}
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={addWebRow}
                                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    +
                                </button>
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
                                                        onChange={handleInputChange}
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
                                            <th className="border border-gray-300 px-4 py-2">Delete</th>
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
                                                        onChange={(e) =>
                                                            updateCourse(index, "name", e.target.value)
                                                        }

                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <textarea
                                                        className="w-full border-gray-300 rounded p-2"
                                                        placeholder="Enter Seat Structure"
                                                        value={course.seats}
                                                        onChange={(e) =>
                                                            updateCourse(index, "seats", e.target.value)
                                                        }

                                                    ></textarea>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <textarea
                                                        className="w-full border-gray-300 rounded p-2"
                                                        placeholder="Enter Fees Structure"
                                                        value={course.fees}
                                                        onChange={(e) =>
                                                            updateCourse(index, "fees", e.target.value)
                                                        }

                                                    ></textarea>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <textarea
                                                        className="w-full border-gray-300 rounded p-2"
                                                        placeholder="Enter Eligibility Criteria"
                                                        value={course.eligibility}
                                                        onChange={(e) =>
                                                            updateCourse(index, "eligibility", e.target.value)
                                                        }

                                                    ></textarea>
                                                </td>
                                                <td align="center">
                                                    <button
                                                        type="button"
                                                        className="text-red-500 bg-blue-100 p-2"
                                                        onClick={() => deleteCourseRow(index)}
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={addCourseRow}
                                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    +
                                </button>
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                    name="cutoff"
                                    rows={5}>
                                </textarea>
                            </div>

                            {/* Placement Records */}
                            <div id='placements' className="pt-10">
                                <br /><br />
                                {collegeData.placement && ( //Check if placement exists
                                    <>
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Infrastructure:</h4>
                                        <div className="space-y-4">
                                            {["Top Recruiters", "Statistics", "Average Packages", "Other"].map((topic) => (
                                                <div key={topic}>
                                                    <h6 className="text-lg font-semibold">{topic}:</h6>
                                                    <textarea
                                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                                        placeholder={`${topic} information here`}
                                                        value={collegeData.placement[handlePlacementTopics(topic)] || ""}
                                                        name={`placement.${handlePlacementTopics(topic)}`}
                                                        onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    placeholder="Enter Information of Governance:"
                                    value={collegeData.governance}
                                    name="governance"
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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

export default AdminPortal;
