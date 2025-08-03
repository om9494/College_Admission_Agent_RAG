import React, { useRef, useEffect, useState, useContext } from "react";
import { useLanguage } from "../context/LanguageContext";

import useSpeechSynthesis from "./ttsService";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, AdminContext } from "../App";
import axios from "axios";
import jsPDF from 'jspdf';

// Example ask function
export const ask = (question) => {
    console.log("Question:", question);
    // Add logic to handle the question here
};



export default function CollegeComparison() {
    const [collegeData, setCollegeData] = useState([{}, {}, {}, {}]); // Array of objects
    const [selectedColleges, setSelectedColleges] = useState([null, null, null, null]);

    const handleSelectCollege = (e, index) => {  // Pass the index directly
        const collegeName = e.target.value;
        setSelectedColleges(prevColleges => {
            const newColleges = [...prevColleges];
            newColleges[index] = collegeName;
            return newColleges;
        });
    };

    useEffect(() => {
        const loadCollegeData = async (collegeName, index) => {
            if (!collegeName) {
                setCollegeData(prevData => {
                    const newData = [...prevData];
                    newData[index] = {};
                    return newData;
                });
                return;
            }

            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'college/get', {
                    params: { name: collegeName }
                });

                if (response.status === 200 && response.data.college) {
                    setCollegeData(prevData => {
                        const newData = [...prevData];
                        newData[index] = response.data.college;
                        return newData;
                    });
                } else {
                    console.error("College data not found.");
                    setCollegeData(prevData => {  // Update correctly if no college is found
                        const newData = [...prevData];
                        newData[index] = {}; // Or null if you prefer
                        return newData;
                    });
                }
            } catch (error) {
                console.error("Error loading college data:", error);
                setCollegeData(prevData => {
                    const newData = [...prevData];
                    newData[index] = {}; // Or null if you prefer
                    return newData;
                });
                alert("Data not Available!");
            }
        };

        selectedColleges.forEach((college, index) => {
            loadCollegeData(college, index);
        });

    }, [selectedColleges]);
    // const contacts1 = col1.contact || [];
    // const websites1 = col1.websites || [];
    // const courses1 = col1.courses || [];
    // const contacts2 = col2.contact || [];
    // const websites2 = col2.websites || [];
    // const courses2 = col2.courses || [];
    // const contacts3 = col3.contact || [];
    // const websites3 = col3.websites || [];
    // const courses3 = col3.courses || [];
    // const contacts4 = col4.contact || [];
    // const websites4 = col4.websites || [];
    // const courses4 = col4.courses || [];

    // const handlePlacementTopics = (topic) => {
    //     // Create a mapping object for converting display names to database keys
    //     const topicMapping = {
    //         "Top Recruiters": "topRecruiters",
    //         "Statistics": "statistics",
    //         "Average Packages": "averagePackages",
    //         "Other": "other",
    //     };

    //     //Convert the display name to a database key
    //     const dbKey = topicMapping[topic];
    //     return dbKey;
    // };





    // Dark mode toggle
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Initialize state from local storage during component mount
        const storedDarkMode = localStorage.getItem('darkMode');
        return storedDarkMode ? JSON.parse(storedDarkMode) : false; // Default to false if not set
    });

    useEffect(() => {
        // Apply dark mode class to body when `isDarkMode` changes
        document.body.classList.toggle('dark', isDarkMode);
        // Save the preference to local storage
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        // Apply the 'dark' class to the body based on the isDarkMode state
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleDarkModeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };




    const { speak } = useSpeechSynthesis();
    const [text, setText] = useState("");
    const { setUser } = useContext(UserContext); // Add setUser for logout
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("admin");
    const parsedUser = user ? JSON.parse(user) : null; // Parse user once
    const parsedAdmin = admin ? JSON.parse(admin) : null; // Parse admin once
    const navigate = useNavigate();

    const [notification, setNotification] = useState(parsedUser?.notification || false);
    const email = parsedUser?.email || "";
    const name = parsedUser?.name || "";
    const admin_name = parsedAdmin?.name || "";
    const admin_email = parsedAdmin?.email || "";

    // console.log("Parsed User:", parsedUser);
    // console.log("Notification State:", notification);
    // console.log("Email:", email);
    // console.log("Name:", name);


    const token = localStorage.getItem("token"); // Retrieve token

    useEffect(() => {
        if (!parsedUser) {
            setNotification(false);
        } else {
            setNotification(parsedUser.notification);
        }
    }, [parsedUser]);

    const handleNotification = async (e) => {
        e.preventDefault();
        const newNotification = e.target.checked; // Get the updated checkbox value
        if (!user) {
            speak("Please Login to Enable Email Notification", language);
            // alert("Please Login for Email Notification");
            navigate("/login");
            return;
        }
        try {
            const res = await axios.post(import.meta.env.VITE_BACKEND_API + 'auth/notify-user', {
                notification: newNotification,
                email,  // Send user's email
                token,  // Send the JWT token
            });

            if (res.status === 200) {
                setNotification(newNotification); // Update local state

                // Parse the existing user data, update the notification field, and save back to local storage
                const updatedUser = { ...JSON.parse(user), notification: newNotification };
                localStorage.setItem("user", JSON.stringify(updatedUser));

                console.log("Notification updated successfully:", res.data);
            } else {
                alert("Notification update failed");
                console.error("Notification update failed:", res.data);
            }
        } catch (err) {
            alert("Notification update failed");
            console.error("Error updating notification:", err);
        }
    };


    const { language, setLanguage, translateText } = useLanguage();

    const handleLanguageChange = (e) => {
        const targetLang = e.target.value;
        setLanguage(targetLang);
        // console.log("Language changed to:", targetLang);
        // Example: translate specific static text (adjust as per your use case)
        document.querySelectorAll("[data-translate-key]").forEach(async (el) => {
            const key = el.innerText;
            // console.log("Element text:", el.innerText);
            // console.log("Translating key:", key);
            const translatedText = await translateText(key, targetLang);
            // console.log("Translated text:", translatedText);
            el.innerText = translatedText;
        });
    };


    // const generatePdf = async (conversationHistory) => {
    //     const doc = new jsPDF();
    //     doc.setFontSize(12);

    //     // Improved formatting:  Iterate through the conversation history and format each message
    //     let y = 10; // Starting vertical position
    //     conversationHistory.forEach(item => {
    //         const role = item.role;
    //         const text = item.parts[0].text;
    //         const formattedMessage = `${role.toUpperCase()}: ${text}`;

    //         // Split text into lines if it's too long to fit on one line.  This prevents overflowing
    //         const lines = doc.splitTextToSize(formattedMessage, 180); // Adjust 180 for width

    //         lines.forEach(line => {
    //             doc.text(line, 10, y); // Adjust x-coordinate (10) as needed
    //             y += 10; // Adjust vertical spacing as needed
    //         });
    //         y += 5; // Add extra space between messages

    //     });

    //     const pdfBlob = doc.output('blob');
    //     return pdfBlob;
    // };


    // useEffect(() => {
    //     const handleDownloadRequest = (event) => {
    //         downloadChatHistory(conversationHistory); //Call function to generate PDF
    //     };
    //     window.addEventListener('downloadChatRequest', handleDownloadRequest);
    //     return () => window.removeEventListener('downloadChatRequest', handleDownloadRequest);
    // }, [conversationHistory]);


    // const downloadChatHistory = async (conversationHistory) => {
    //     try {
    //         if (conversationHistory.length === 0) {
    //             alert("No chat history to download."); //Handle empty history
    //             return;
    //         }
    //         const pdfData = await generatePdf(conversationHistory);
    //         const blob = new Blob([pdfData], { type: 'application/pdf' });
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'ace_chat.pdf';
    //         a.click();
    //         window.URL.revokeObjectURL(url);

    //     } catch (error) {
    //         console.error("Error downloading chat history:", error);
    //         alert("Error downloading chat history. Please try again later."); //More user-friendly error message
    //     }
    // };




    return (
        <div className="chat-container" id="chat-container">
            <div id='ace-head'>
                <Link to="/"><img src="./assets/home.svg" id='home' alt="Home" /></Link>


                <div>
                    {parsedUser ? (
                        <>
                            <button className="" onClick={() => navigate("/profile")}>{name}</button>
                        </>
                    ) : parsedAdmin ? (
                        <>
                            <button className="" onClick={() => navigate("/admin")} >{admin_name}</button>
                        </>
                    ) : (
                        <>
                            <button className="" onClick={() => navigate("/login")} data-translate-key > Login </button>
                        </>
                    )}

                </div>

                {parsedAdmin ? (
                    <>
                    </>
                ) : (
                    <>
                        <label name="Notification" title="Notification and Email Services" className="switch">
                            <p id="status"></p>
                            <input type="checkbox" checked={notification} onChange={handleNotification} />
                            <span className="slider round"></span>
                        </label>
                    </>
                )}

                <label name="Theme" title="Theme Switch" className="switch">
                    <p id="status"></p>
                    <input type="checkbox" checked={isDarkMode} onChange={handleDarkModeToggle} />
                    <span className="theme-slider round"></span>
                </label>

                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="text-white bg-blue-600 border border-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <option value="en" title="English">English</option>
                    <option value="hi" title="Hindi">हिंदी</option>
                    {/* <option value="mr" title="Marathi">मराठी</option>
            <option value="pa" title="Punjabi">ਪੰਜਾਬੀ</option>
            <option value="gu" title="Gujrati">ગુજરાતી</option>
            <option value="sd" title="Sindhi">سنڌي</option> */}
                    <option value="mwr" title="Marwadi">मारवाड़ी</option>
                </select>
            </div>


            <div className="college-comp-display">
                {/* Make a table of four columns each column containing a '+' button to add the college (it is a select tag as if the user clicks all the college list will appear so that user could select and then after selecting the particular college data will be got dislayed in the next rows of particular column in the table) */}
                <table className="border-collapse border border-gray-300 m-10">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">College 1</th>
                            <th className="border border-gray-300 px-4 py-2">College 2</th>
                            <th className="border border-gray-300 px-4 py-2">College 3</th>
                            <th className="border border-gray-300 px-4 py-2">College 4</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {[0, 1, 2, 3].map(index => (
                                <td key={index} className="border border-gray-300 px-4 py-2">
                                    <select
                                        className="w-full border-gray-300 rounded p-2"
                                        onChange={(e) => handleSelectCollege(e, index)} // Pass index
                                    >
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
                                </td>
                            ))}
                        </tr>
                        {/* College Name */}
                        <tr>
                            {collegeData.map((college, index) => (
                                <td key={index} className="border border-gray-300 px-4 py-2">
                                    {Object.keys(college).length > 0 && (
                                        <div>
                                            <p>Name: {college.name}</p>
                                            {/* Add other fields as needed */}
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                        {/* College Address */}
                        <tr>
                            {collegeData.map((college, index) => (
                                <td key={index} className="border border-gray-300 px-4 py-2">
                                    {Object.keys(college).length > 0 && (
                                        <div>
                                            <p>Address: {college.address}</p>
                                            {/* Add other fields as needed */}
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                        {/* College Information */}
                        <tr>
                            {collegeData.map((college, index) => (
                                <td key={index} className="border border-gray-300 px-4 py-2">
                                    {Object.keys(college).length > 0 && (
                                        <div>
                                            <p>Information: {college.information}</p>
                                            {/* Add other fields as needed */}
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                        {/* Contact Details */}
                        <tr>
                            {collegeData.map((college, index) => (
                                <td key={index} className="border border-gray-300 px-4 py-2">
                                    {Object.keys(college).length > 0 && (
                                        <div>
                                            <p>Contacts:</p>
                                            <ul>
                                                {(college.contact || []).map((contact, i) => (
                                                    <li key={i}>
                                                        {contact.person}: {contact.phone}, {contact.email}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                        {/* Websites */}
                        <tr>
                            {collegeData.map((college, index) => (
                                <td key={index} className="border border-gray-300 px-4 py-2">
                                    {Object.keys(college).length > 0 && (
                                        <div>
                                            <p>Websites:</p>
                                            <ul>
                                                {(college.websites || []).map((website, i) => (
                                                    <li key={i}>
                                                        <a href={website.link} target="_blank" rel="noopener noreferrer">
                                                            {website.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>

                        {/* Infrastucture */}
                        <tr>
                            {collegeData.map((college, index) => (
                                <td key={index} className="border border-gray-300 px-4 py-2">
                                    {Object.keys(college).length > 0 && (
                                        <div>
                                            <p>Infrastructure:</p>
                                            <ul>
                                                {Object.entries(college.infrastructure || {}).map(([facility, details]) => (
                                                    <li key={facility}>{facility}: {details}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>

                        {/* Courses */}
                        <tr>
                            {collegeData.map((college, index) => (
                                <td key={index} className="border border-gray-300 px-4 py-2">
                                    {Object.keys(college).length > 0 && (
                                        <div>
                                            <p>Courses:</p>
                                            <ul>
                                                {(college.courses || []).map((course, i) => (
                                                    <li key={i}>
                                                        {course.name}: {course.seats}, {course.fees}, {course.eligibility}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>



                    </tbody>
                </table>
            </div>


        </div>
    );
}
