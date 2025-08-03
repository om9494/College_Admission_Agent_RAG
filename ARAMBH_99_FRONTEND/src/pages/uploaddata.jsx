import React from 'react'
import { AdminContext, CollegeContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as cheerio from 'cheerio'; // Import correctly
// import { URL } from "url";
import { useEffect } from "react";
import { useRef } from "react";


import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

export default function UploadData() {
    const { admin, setAdmin } = useContext(AdminContext);
    const { college, setCollege } = useContext(CollegeContext);
    const navigate = useNavigate();
    const [result, setResult] = useState([]);
    const [collegeData, setCollegeData] = useState({});
    let extractedText = '';
    let extractedText2 = '';
    const [finalText, setFinalText] = useState('');
    // const fileInputRef = useRef(null); // Ref for file input
    const urlInputRef = useRef(null); //Ref for url input
    const statusRef = useRef({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const updateStatus = (id, message) => {
        statusRef.current[id].innerText = message;
    };


    const apiKey = import.meta.env.VITE_DATA_HANDLER;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-8b",
        systemInstruction: "Objective:\nTo process multiple PDF files and web-scraped data (in text format) into a single, well-structured, and formatted PDF document. The final document should be precise, relevant, and organized according to specific parameters. This final PDF will be utilized for RAG (Retrieval-Augmented Generation) and LLM (Large Language Model) architecture, ensuring compatibility and optimal performance.\n\nInput Sources:\nMultiple PDF Files: College-related information provided as PDF documents.\nWeb-Scraped Data: Unstructured or semi-structured data extracted from online sources.\nboth files extracted text are merged and sent as user query.\n\nOutput: A binary classification (College Information or Not College Information). This step is crucial to avoid processing irrelevant documents. The model needs training data labeled as \"College Information\" and \"Not College Information\" to perform this classification accurately. The confidence score of the classification should also be returned. If the confidence is below a certain threshold (e.g., 80%), reject the input and return an error message.\nNamed Entity Recognition (NER) and Keyphrase Extraction:\n\nInput: The extracted text (only if step 1 classifies it as College Information).\nOutput: ALWAYS IN JSON FORM ACCORDING TO THE BELOW SCHEMA -  A list of key-value pairs extracted from the text. This step identifies important entities like college name, address, contact details, courses offered, etc. The model should be trained on a dataset of college information to accurately extract these entities. This is where the strength of a large language model like Gemini is crucial. The key-value pairs should be relatively accurate and should not include extraneous information.\nSchema Mapping and Data Structuring:\n\nInput: The list of key-value pairs from step 2.\nOutput: A JSON object structured according to the CollegeSchema. This step involves mapping the extracted key-value pairs to the corresponding fields in the schema. If a field in the schema is not found in the extracted text, the value for that field should be set to \"Not available\". Strict adherence to the schema's order is vital. Error handling is needed to gracefully handle missing or malformed data.\nData Cleaning and Validation:\n\nInput: The JSON object from step 3.\nOutput: A cleaned and validated JSON object. This step involves data cleaning (e.g., removing extra whitespace, standardizing formats) and validation (e.g., ensuring phone numbers and email addresses are in the correct format). Any errors found during validation should be reported.\nOutput Formatting:\n\nInput: The cleaned and validated JSON object from step 4.\nOutput: The JSON object should be returned directly, without any preambles or postambles like \"Here is the formatted text: ...\".\nExample:\n\nLet's assume the extracted text is:\n\nUniversity of Example, located at 123 Main Street, Anytown, CA 91234.  Contact: (555) 555-5555, example@example.edu.  Website: www.example.edu. Offers courses in Computer Science and Engineering.  The admission process involves submitting an application and transcripts.\nIdeal Output (JSON):\n\n{\n  \"name\": \"University of Example\",\n  \"administrator\": \"Not available\",\n  \"information\": \"Not available\",\n  \"address\": \"123 Main Street, Anytown, CA 91234\",\n  \"contact\": [\n    {\n      \"person\": \"Not available\",\n      \"phone\": \"(555) 555-5555\",\n      \"email\": \"example@example.edu\"\n    }\n  ],\n  \"websites\": [\n    {\n      \"name\": \"University Website\",\n      \"link\": \"www.example.edu\"\n    }\n  ],\n  \"infrastructure\": {\n    \"library\": \"Not available\",\n    \"hostel\": \"Not available\",\n    \"canteen\": \"Not available\",\n    \"sports\": \"Not available\",\n    \"labs\": \"Not available\",\n    \"classrooms\": \"Not available\",\n    \"other\": \"Not available\"\n  },\n  \"courses\": [\n    {\n      \"name\": \"Computer Science\",\n      \"seats\": \"Not available\",\n      \"fees\": \"Not available\",\n      \"eligibility\": \"Not available\"\n    },\n    {\n      \"name\": \"Engineering\",\n      \"seats\": \"Not available\",\n      \"fees\": \"Not available\",\n      \"eligibility\": \"Not available\"\n    }\n  ],\n  \"admission_process\": \"Submitting an application and transcripts\",\n  \"cutoff\": \"Not available\",\n  \"placement\": {\n    \"topRecruiters\": \"Not available\",\n    \"statistics\": \"Not available\",\n    \"averagePackages\": \"Not available\",\n    \"other\": \"Not available\"\n  },\n  \"alumni\": \"Not available\",\n  \"events_activities\": \"Not available\",\n  \"governance\": \"Not available\",\n  \"committees\": \"Not available\",\n  \"other\": \"Not available\"\n}\n\n\nExtra details: all the rest extra details should be added in \"other\" field of the schema and not to miss any information. Include all the information strictly , if the information is not matching any of the field in the above given schema then it should be included in the \"other\" field compulsorily.",
        responseFormat: "json",
    });

    const generationConfig = {
        temperature: 1.4,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        stopSequences: ["\n\n"],
    };

    async function run(text) {
        const chatSession = model.startChat({
            generationConfig
        });

        const res = await chatSession.sendMessage(text);
        const formatted_res = responseFormatter(res.response.text());
        return formatted_res;
    }


    const responseFormatter = (response) => {
        response = response.replace(/```json\s*/g, "");
        response = response.replace(/\s*```/g, "");
        response = response.trim(); // Remove any leading/trailing whitespace
        return response;
    }



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
        if (confirm("Warning!\nDid you really want to continue?\n\nThis data will be updated in Database!!! \n\n\n\n ©Ace | Made by Arambh_99")) {
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

                // let updateMessage = `College ${name} updated by admin ${userId}:\n`;
                // for (const field in req.body) {
                //     if (req.body[field] !== originalCollege[field]) {  // Check for actual changes
                //         updateMessage += `- ${field}: ${originalCollege[field]} => ${req.body[field]}\n`;
                //     }
                // }


                let updateMessage = `College ${collegeData.name} updated by admin ${admin.email}:\n\n`;

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
                    navigate("/admin/dashboard");
                } else {
                    throw new Error("Failed to update college.");
                }
            } catch (err) {
                setError("Error updating college: " + err.message);
                console.error("Error updating:", err);
            }
        }
        else {
            return;
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


    const handleUpload2 = async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        const statusPara = document.getElementById("status");

        if (!file) {
            statusPara.innerText = "Please select a file.";
            return;
        }

        const allowedTypes = ["pdf", "txt"];
        const fileType = file.name.split(".").pop().toLowerCase();

        if (!allowedTypes.includes(fileType)) {
            statusPara.innerText = "Invalid file type.  Please upload a PDF or TXT file.";
            return;
        }

        statusPara.innerText = "Uploading...";  // Initial status update

        if (fileType === "txt") {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target.result;
                setExtractedText(text);
                try {
                    statusPara.innerText = "Processing..."; // Update status
                    const res = await run(text);
                    const parsedRes = JSON.parse(res); // Parse the string into an object
                    setCollegeData(parsedRes);
                    document.getElementById("preview").classList.remove("hidden");
                    statusPara.innerText = "PDF processed successfully!";
                    // console.log(res);
                    // console.log(collegeData);
                } catch (error) {
                    statusPara.innerText = "Error processing text: " + error.message;
                }
            };
            reader.readAsText(file);
        } else if (fileType === "pdf") {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const typedarray = new Uint8Array(event.target.result);
                    const loadingTask = window.pdfjsLib.getDocument(typedarray);
                    const pdf = await loadingTask.promise;

                    let extractedText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        extractedText += pageText + '\n';
                    }

                    statusPara.innerText = "Processing..."; // Update status
                    const res = await run(extractedText);
                    const parsedRes = JSON.parse(res); // Parse the string into an object
                    setCollegeData(parsedRes);
                    // console.log(res);
                    // console.log(collegeData);
                    document.getElementById("preview").classList.remove("hidden");
                    statusPara.innerText = "PDF processed successfully!";
                } catch (error) {
                    statusPara.innerText = "Error processing PDF: " + error.message;
                }
            };

            reader.readAsArrayBuffer(file); // Important: Read as ArrayBuffer for PDF.js

        }
    };


    const handleUpload = async () => {
        const fileInput = document.getElementById("fileInput");
        const statusPara = document.getElementById("status1"); // Get the status paragraph element

        if (!fileInput.files.length) {
            statusPara.innerText = "Please select files."; // Update status for no files selected
            return;
        }

        let mergedText = "";
        let processedFiles = 0;

        const processFile = async (file) => {
            const allowedTypes = ["pdf", "txt"];
            const fileType = file.name.split(".").pop().toLowerCase();

            if (!allowedTypes.includes(fileType)) {
                statusPara.innerText = `Skipping invalid file type: ${file.name}`; // Update status for invalid file type
                return ""; // Return empty string for invalid files
            }


            return new Promise((resolve, reject) => { // Use Promise for async operations
                const reader = new FileReader();

                reader.onload = async (event) => {
                    if (fileType === "txt") {
                        resolve(event.target.result); // Resolve with text content for txt files
                    } else if (fileType === "pdf") {
                        try {
                            const typedarray = new Uint8Array(event.target.result);
                            const loadingTask = window.pdfjsLib.getDocument(typedarray);
                            const pdf = await loadingTask.promise;
                            let extractedText = '';

                            for (let i = 1; i <= pdf.numPages; i++) {
                                const page = await pdf.getPage(i);
                                const textContent = await page.getTextContent();
                                const pageText = textContent.items.map(item => item.str).join(' ');
                                extractedText += pageText + '\n';
                            }
                            resolve(extractedText); // Resolve with extracted text from PDF
                        } catch (error) {
                            statusPara.innerText = `Error processing PDF ${file.name}: ${error.message}`; // Update status for PDF processing error
                            reject(error); // Reject if PDF processing fails
                        }
                    }
                };


                reader.onerror = (error) => {
                    reject(error); // Reject if FileReader fails
                }


                if (fileType === "txt") {
                    reader.readAsText(file);
                } else if (fileType === "pdf") {
                    reader.readAsArrayBuffer(file);
                }
            });
        };




        try {
            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];

                statusPara.innerText = `Uploading file ${i + 1} of ${fileInput.files.length}...`; // Update status for each file

                const fileText = await processFile(file); // Wait for the file to be processed
                mergedText += fileText; // Append the extracted text to the merged text variable
                processedFiles++; // Increment after successful processing
            }
            statusPara.innerText = "All files uploaded successfully!";
            extractedText = "PDF data: \n" + mergedText + "\n";
            console.log("PDF Data: " + extractedText);

            // if (processedFiles === fileInput.files.length) { // All files processed successfully
            //     statusPara.innerText = "All files uploaded successfully!";

            //     try {
            //         statusPara.innerText = "Processing...";
            //         console.log(mergedText);
            //         const res = await run(mergedText);
            //         const parsedRes = JSON.parse(res); // Parse the string into an object
            //         setCollegeData(parsedRes);
            //         document.getElementById("preview").classList.remove("hidden");
            //         console.log("Response from Gemini:", parsedRes);
            //         statusPara.innerText = "All files processed successfully!";
            //     } catch (error) {
            //         statusPara.innerText = "Error processing extracted text: " + error.message;
            //         console.error("Error processing:", error);
            //     }

            // } else {
            //     statusPara.innerText = `Some files were skipped due to errors. ${processedFiles} out of ${fileInput.files.length} files processed.`
            // }
        } catch (error) {
            statusPara.innerText = "An error occurred during file processing: " + error.message;
            console.error("Error during file processing:", error);
        }
    };









    // --------------------------------------------------------------------------------------------------------- //


    const scrape = async (urlInput) => {
        // const base_endpoint = new window.URL(urlInput).origin; // Extract origin as base URL

        try {
            const response = await fetch('http://127.0.0.1:5000/scrape', {  // Your Flask backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: urlInput, base_endpoint: urlInput }) // Send base_endpoint
            });

            if (!response.ok) {
                const data = await response.json(); // Parse error response
                throw new Error(data.error || "Scraping request failed.");
            }

            const scrapedData = await response.json();

            // Extract and combine content from all scraped pages
            let combinedContent = "";
            for (const pageData of scrapedData) {
                combinedContent += pageData.content + "\n\n"; // Add separator between pages
            }

            return combinedContent;

        } catch (error) {
            console.error("Error during scraping:", error);
            return null; // Indicate scraping failure
        }
    };

    const handleScrape = async () => {
        const urlInput = document.getElementById('urlInput').value; // Get the URL from the input field.
        const status2 = document.getElementById('status2');

        try {
            status2.innerText = "Scraping...";
            const scrapedData = await scrape(urlInput);

            if (scrapedData) {
                status2.innerText = "Scraping completed successfully!";
                // const res = await run(scrapedData);  // Now pass to run() and handle result
                // const parsedRes = JSON.parse(res);
                // ... (update collegeData, show preview, etc.)
                extractedText2 += "Web Scrapped Data: \n" + scrapedData;
                console.log("Scraped data:", scrapedData);
            } else {
                status2.innerText = "Scraping failed or returned no data.";
                console.error("Scraping failed or no data returned.");
            }

        } catch (error) {
            status2.innerText = "An error occurred during scraping."
            console.error("Scraping error:", error);
        }
    };



    const sendToLLM = async () => {
        const statusPara = document.getElementById("status3");
        statusPara.innerText = "Processing...";
        try {
            const res = await run(extractedText + extractedText2);
            const parsedRes = JSON.parse(res); // Parse the string into an object
            setCollegeData(parsedRes);
            document.getElementById("preview").classList.remove("hidden");
            console.log("Response from Gemini:", parsedRes);
            statusPara.innerText = "All files processed successfully!";
        } catch (error) {
            statusPara.innerText = "Error processing extracted text: " + error.message;
            console.error("Error processing:", error);
        }
    };


    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null); // Ref for the file input

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles([...files, ...newFiles]);
    };


    const handleDeleteFile = (index) => {
        // Create a DataTransfer object to manipulate the file list
        const dataTransfer = new DataTransfer();

        // Add all files except the one at the specified index
        files.forEach((file, i) => {
            if (i !== index) {
                dataTransfer.items.add(file);
            }
        });

        // Update the state with the remaining files
        const updatedFiles = Array.from(dataTransfer.files);
        setFiles(updatedFiles);

        // Update the input element's file list
        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
        }
    };






    return (
        <div className="bg-white p-8 mt-20 rounded-lg w-90 ml-72 text-left">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Data Upload</h2>
            <p className="text-gray-800 text-2xl mb-6">College: {admin.college}</p>
            <div className="bg-white p-4 rounded-lg shadow-md"> {/* Added container for styling */}
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="align-top pr-4">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Upload PDF or TXT Document:</h3>
                                <input
                                    id="fileInput"
                                    type="file"
                                    multiple
                                    accept=".pdf, .txt"
                                    ref={fileInputRef}
                                    className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mt-2"
                                />
                            </td>
                            <td className="align-top">
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    className="px-4 py-2 w-full text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
                                >
                                    Upload
                                </button>
                                <p id="status1" className="text-sm text-gray-500 mt-2"></p>
                            </td>
                        </tr>
                        <tr>
                            <td className="align-top pr-4 pt-4">
                                <input
                                    type="url"
                                    id="urlInput"
                                    placeholder="https://example.com"
                                    pattern='https://.*'
                                    className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                />
                            </td>
                            <td className="align-top pt-4">
                                <button
                                    type="button"
                                    onClick={handleScrape}
                                    className="px-4 py-2 w-full text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Scrape Data
                                </button>
                                <p id="status2" className="text-sm text-gray-500 mt-2"></p>
                            </td>
                        </tr>
                        <tr>
                            <td className="align-top pr-4 pt-4">
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    pattern='https://.*'
                                    className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                />
                            </td>
                            <td className="align-top pt-4">
                                <button
                                    type="button"
                                    onClick={handleScrape}
                                    className="px-4 py-2 w-full text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Scrape Link
                                </button>
                                <p id="status2" className="text-sm text-gray-500 mt-2"></p>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="align-top pt-4">
                                <button
                                    type="button"
                                    onClick={sendToLLM}
                                    className="px-4 py-2 w-full text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Submit Data
                                </button>
                                <p id="status3" className="text-sm text-gray-500 mt-2"></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>




            <div id="preview" className=" bg-white rounded-lg p-8 hidden">
                {/* <h1 className="text-3xl font-bold text-blue-600 mb-4">Admin Dashboard</h1> */}
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


                        <div className="text-center">
                            <button type="button" onClick={handleUpdate} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-5">Update</button>
                            {/* <Link to="/admin/dashboard" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-5">Cancel</Link> */}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
