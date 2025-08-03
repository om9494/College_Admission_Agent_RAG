import React, { useRef, useEffect, useState, useContext } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"; //Corrected import path assumption
import useSpeechSynthesis from "./ttsService";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, AdminContext } from "../App";
import axios from "axios";
import jsPDF from 'jspdf';
import translations from "../context/translations.json"; // Import the JSON file
import MobSideBar from "./mob_side_bar";



export default function PersonalGuide() {
  // const instructionsUrl = "./data/instructions.txt";
  const dbdataUrl = "./data/personal.txt";
  const [sysInstruction, setSysInstruction] = useState("");

  // Define the getdata function *inside* the component
  const getdata = async (dbdataUrl) => {
    try {
      // const instructionsResponse = await fetch(instructionsUrl);
      const dbdataResponse = await fetch(dbdataUrl);

      if (!dbdataResponse.ok) {
        throw new Error(`HTTP error! status: ${instructionsResponse.status} ${dbdataResponse.status}`);
      }

      // const instructions = await instructionsResponse.text();
      const dbdata = await dbdataResponse.text();
      return dbdata;  // Or any other way you want to merge

    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to be caught by the useEffect's catch block
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mergedContent = await getdata(dbdataUrl);
        setSysInstruction(mergedContent);
      } catch (error) {
        console.error("Error fetching instructions:", error);
        setSysInstruction("Error fetching instructions");
      }
    };

    fetchData();
  }, [dbdataUrl]);


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




  const { language, setLanguage } = useLanguage();

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


  const { translateText } = useLanguage();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleLanguageChange = (e) => {
    const targetLang = e.target.value;
    setLanguage(targetLang);
    localStorage.setItem('language', targetLang);
    document.querySelectorAll("[data-translate-key]").forEach(async (el) => {
      const key = el.innerText;
      // console.log("Element text:", el.innerText);
      // console.log("Translating key:", key);
      const translatedText = await translateText(key, targetLang);
      // console.log("Translated text:", translatedText);
      el.innerText = translatedText;
    });
  };

  const trans = async (message) => {
    const translatedMessage = await translateText(message, language);
    return translatedMessage;
  }


  const translate = (key) => {
    return translations[language][key] || key; // Returns the translated text or the original key if not found
  };


  // -----------------------------------Main -------------------------






  const [transcript, setTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  


  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);


  // Initialize the Gemini Model
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: sysInstruction,
  });

  const generationConfig = {
    temperature: 1.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];


  // Format the chatbot response
  const responseTextFormatter = (response) => {
    if (!response.includes("#@")) {
      response = response + "</div>"
    }
    return response
      .replace(/(\bhttps?:\/\/[^\s]+)/g, (url) => `<a href="${url}" target="_blank" style="color:blue;text-decoration:none">${url}</a>`)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, (_, text, url) => `<a href="${url}" target="_blank" style="color:blue;text-decoration:none">${text}</a>`)
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/_(.*?)_/g, "<u>$1</u>")
      .replace(/\n/g, "<br>")
      .replace(/(#@)/g, "</div><div id='questions'><div id='freq-que'><img src='./assets/sound.svg' id='freq-icon'/> <h6 id='freq-text'>Related Questions</h6></div> <hr/> <button id='que' data-question=''>")
      .replace(/(!@@ )/g, "</button><button id='que' data-question=''>")
      .replace(/(!@!#)/g, "</button></div>")
  };


  // Display messages in chat
  const displayChat = (type, message) => {
    const chatHistory = document.getElementById("chat-history");
    const messageDiv = document.createElement("div");
    messageDiv.className = `${type}-message`;
    messageDiv.innerHTML = message;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    if (type === "bot") {
      // speak(message, language);
    }
    handleLanguageChange({ target: { value: language } });
  };


  const [id_counter, setIdCounter] = useState(0);

  // Send user message to Gemini and display response
  const handleSend = async () => {
    try {
      const userMessage = transcript.trim();
      if (!userMessage) return;

      document.getElementById("bot").style.display = "none";
      document.getElementById("typing-dots").style.display = "block";
      // document.getElementById("send").disabled = true;
      // document.getElementById("user-input").disabled = true;

      setConversationHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: userMessage }] },
      ]);
      setTranscript("");

      displayChat("user", responseTextFormatter(userMessage));

      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: conversationHistory,
      });

      const result = await chat.sendMessage(userMessage);
      const botResponse = await result.response.text();

      setConversationHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: botResponse }] },
      ]);
      const botMessageHtml = `
      <div class="bot-text" id="bot-text${id_counter}" data-translate-key>
        ${await responseTextFormatter(botResponse)}
      </div>
      <div class='bot-opt'>
        <i class='fa fa-thumbs-o-up' title='Like' id='like${id_counter}' onclick='handleLike(${(id_counter)})'></i>
        <i class='fa fa-thumbs-o-down' title='Dislike' id='dislike${id_counter}' onclick='handleDislike(${(id_counter)})'></i>
        <i class='fa fa-copy' title='Copy' id='copy${id_counter}' onclick='handleCopy(${(id_counter)})'></i>
        <i class='fa fa-volume-up' title='Speak' id='speak${id_counter}' onclick='handleSpeak(${(id_counter)})'></i>
      </div>`;

      const formattedResponse = botMessageHtml; 
      displayChat("bot", formattedResponse);
      document.getElementById("typing-dots").style.display = "none";
      setIdCounter(id_counter + 1);
    } catch (error) {
      const errorMessage = `An error occurred while processing your request: ${error.message}`;
      console.error(errorMessage);
      displayChat("bot", responseTextFormatter(errorMessage));
      document.getElementById("typing-dots").style.display = "none";
      setIdCounter(id_counter + 1);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };




  const generatePdf = async (conversationHistory) => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    // Improved formatting:  Iterate through the conversation history and format each message
    let y = 10; // Starting vertical position
    conversationHistory.forEach(item => {
      const role = item.role;
      const text = item.parts[0].text;
      const formattedMessage = `${role.toUpperCase()}: ${text}`;

      // Split text into lines if it's too long to fit on one line.  This prevents overflowing
      const lines = doc.splitTextToSize(formattedMessage, 180); // Adjust 180 for width

      lines.forEach(line => {
        doc.text(line, 10, y); // Adjust x-coordinate (10) as needed
        y += 10; // Adjust vertical spacing as needed
      });
      y += 5; // Add extra space between messages

    });

    const pdfBlob = doc.output('blob');
    return pdfBlob;
  };


  useEffect(() => {
    const handleDownloadRequest = (event) => {
      downloadChatHistory(conversationHistory); //Call function to generate PDF
    };
    window.addEventListener('downloadChatRequest', handleDownloadRequest);
    return () => window.removeEventListener('downloadChatRequest', handleDownloadRequest);
  }, [conversationHistory]);


  const downloadChatHistory = async (conversationHistory) => {
    try {
      if (conversationHistory.length === 0) {
        alert("No chat history to download."); //Handle empty history
        return;
      }
      const pdfData = await generatePdf(conversationHistory);
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ace_chat.pdf';
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading chat history:", error);
      alert("Error downloading chat history. Please try again later."); //More user-friendly error message
    }
  };










  // -------------------------------------STT-----------------------------------


  const [recognizedText, setRecognizedText] = useState("");
  const sendTimeoutRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("Speak");
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false); // Track listening state


  const handleStartRecording = () => {
    setTranscript("");
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.SpeechRecognition) {
      setStatusMessage(
        "Speech Recognition is not supported in your browser."
      );
      return;
    }

    if (recognitionRef.current && isListening) { // Stop if already listening
      recognitionRef.current.stop();
      return;
    }


    document.getElementById("audio_out").style.display = "block";

    setStatusMessage("Listening...");
    setIsListening(true); // Set listening state


    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false; //Changed to false for single utterance
    recognitionRef.current.interimResults = true; // Show interim results for better UX
    recognitionRef.current.lang = language === "mwr" ? "hi-IN" : language; // Corrected language code

    recognitionRef.current.onstart = () => {  // Added onstart handler
      setIsListening(true)
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setRecognizedText(finalTranscript || interimTranscript)
      setTranscript(finalTranscript || interimTranscript);

    };

    recognitionRef.current.onerror = (event) => {
      setIsListening(false); // Reset listening state on error
      setStatusMessage(`Error: ${event.error}`);
      document.getElementById("audio_out").style.display = "none"; // Hide status on error
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);  //Set listening state to false to prevent errors
      setStatusMessage("Speak");
      document.getElementById("audio_out").style.display = "none";
    };
    recognitionRef.current.start();

  };



  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const [mob_side_bar, setMobSideBar] = useState(false)

  const handleMobSide = () => {
    setMobSideBar(!mob_side_bar);
  }



  return (
    <div className="chat-container" id="chat-container">
      <div id='ace-head'>
        <Link to="/"><img src="./assets/home.svg" id='home' alt="Home" /></Link>
        <i id="hamb-side" className="fa fa-bars" onClick={handleMobSide}></i>
        <div className={`faq-sidebar ${mob_side_bar ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform ease-in-out duration-300 z-50 overflow-y-auto`}>
          <button
            onClick={handleMobSide}
            className="fixed top-4 right-4 z-10 text-gray-600 hover:text-gray-800 focus:outline-none bg-transparent p-0 cursor-pointer"
          >
            <i className="fas fa-times"></i> {/* Close icon */}
          </button>
          <div className="">
            <MobSideBar/>
          </div>
        </div>
        <div></div>

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
          className="text-blue-500 border border-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
      <div id="chat-history"></div>

      <div id="text_box" className="text_box">
        <div id="inner-text-box">
          <button
            onClick={() => window.location.reload()}
            title="New Chat"
            id="newchat"
          >
            <i className="fa-solid fa-rotate-left"></i>
          </button>
          <input
            type="text"
            id="user-input"
            onKeyDown={handleKeyDown}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Type your message here..."
            autoFocus
            autoComplete="off"
          />
          <div className="text-black">
            <p id="audio_out">{statusMessage}</p>
            <button
              onClick={isListening ? handleStopRecording : handleStartRecording}
              id="audio_input"
              title={isListening ? "Stop Recording" : "Start Recording"}
            >
              <i className={`fa-solid fa-microphone${isListening ? "-slash" : ""}`}></i>
            </button>
          </div>
          <button title="Send" id="send" onClick={handleSend}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>



      <img src="boto.svg" id="bot" alt="Bot" height="250px" width="220px" />
      <div className="typing-dots" id="typing-dots">
        <div id="dot1"></div>
        <div id="dot2"></div>
        <div id="dot3"></div>
      </div>
    </div>
  );
}
