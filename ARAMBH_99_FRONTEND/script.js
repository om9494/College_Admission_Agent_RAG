

function speak(text, language, voiceOptions = {}) {

  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported by this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Set language
  utterance.lang = language || navigator.language; // Use provided language or default

  // Apply voice options
  const voices = window.speechSynthesis.getVoices();
  if (voiceOptions.voiceURI) { // Find by voiceURI
    utterance.voice = voices.find(voice => voice.voiceURI === voiceOptions.voiceURI);
  } else if (voiceOptions.name) { // Find by name
    utterance.voice = voices.find(voice => voice.name === voiceOptions.name);
  } else if (voiceOptions.gender || voiceOptions.lang) { // Find by gender and/or language
    utterance.voice = voices.find(voice =>
      (voiceOptions.gender && voice.name.toLowerCase().includes(voiceOptions.gender.toLowerCase())) &&
      (voiceOptions.lang && voice.lang.startsWith(voiceOptions.lang)));
  }

  //Set other voice parameters (optional)
  utterance.rate = voiceOptions.rate || 1; // Default rate is 1
  utterance.pitch = voiceOptions.pitch || 1;  // Default pitch is 1
  utterance.volume = voiceOptions.volume || 1; // Default volume is 1


  //Event listeners for debugging/feedback (optional)
  utterance.onstart = () => console.log("Speech started");
  utterance.onend = () => console.log("Speech ended");
  utterance.onerror = (error) => console.error("Speech error:", error);


  window.speechSynthesis.speak(utterance);

  return utterance; // Return the utterance object for potential manipulation
}


function showFeedbackPopup(type, text, id) {
  const popup = document.createElement('div');
  popup.id = 'feedbackPopup';
  popup.className = 'popup';  // Add a CSS class for styling

  const title = type === 'like' ? 'Why did you like this response?' : 'Why did you dislike this response?';


  popup.innerHTML = `
    <h3>${title}</h3>
    <p>${text.substring(0, 200)}...</p> <textarea id="feedbackText" placeholder="Enter your feedback..."></textarea>
    <button onclick="submitFeedback('${type}', ${id})">Submit</button>
    <button onclick="closeFeedbackPopup()">Close</button>

  `;
  document.body.appendChild(popup);
}

function closeFeedbackPopup() {
  const popup = document.getElementById('feedbackPopup');
  if (popup) {
    document.body.removeChild(popup);
  }
}

const submitFeedback = async(type, id) => {
  const feedbackText = document.getElementById('feedbackText').value;
  const botText = document.getElementById(`bot-text${id}`);
  const session = sessionStorage.getItem('session_id');

  if (!botText || !session) {
    console.error("Session ID missing or bot text not found.");
    closeFeedbackPopup();
    return;
  }

  const feedback = type === 'like' ? 'yes' : 'no';

  if (botText) {
    console.log(`${type === 'like' ? 'Positive' : 'Negative'} feedback for "${botText.innerText}": ${feedbackText}`);
    try {
      const response = await axios.post('http://127.0.0.1:8000/feedback', {
        session_id: session,
        feedback: feedback, // Send yes/no feedback
        feedback_text: feedbackText, //Include detailed feedback text
        bot_response: botText.innerText //Send bot response
      });
  
      if (response.status === 200) {
        console.log("Feedback submitted successfully:", response.data);
      } else {
        console.error("Feedback submission failed:", response.data);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }
    //Here you would send feedbackText and botText.innerText to your backend for storage/processing.
  closeFeedbackPopup();

}


const handleLike = (id) => {
  const botText = document.getElementById(`bot-text${id}`);
  if (botText) {
    console.log("Liked:", botText.innerText);
  } else {
    console.error(`Element bot-text${id} not found.`);
  }

  const like = document.getElementById(`like${id}`);
  like.classList.remove("fa-thumbs-o-up");
  like.classList.add("fa-thumbs-up");
  like.onclick = () => {
    handleNoLike(id);
  }
  showFeedbackPopup("like", botText.innerText, id);
};

const handleNoLike = (id) => {
  const botText = document.getElementById(`bot-text${id}`);
  if (botText) {
    console.log("No Liked:", botText.innerText);
    // Add your no like logic here, e.g., send data to backend
  } else {
    console.error(`Element bot-text${id} not found.`);
  }
  const like = document.getElementById(`like${id}`);
  like.classList.remove("fa-thumbs-up");
  like.classList.add("fa-thumbs-o-up");
  like.onclick = () => {
    handleLike(id);
  }
};

const handleDislike = (id) => {
  const botText = document.getElementById(`bot-text${id}`);
  if (botText) {
    console.log("Disliked:", botText.innerText);
    // Add your dislike logic here, e.g., send data to backend
  } else {
    console.error(`Element bot-text${id} not found.`);
  }
  const dlike = document.getElementById(`dislike${id}`);
  dlike.classList.remove("fa-thumbs-o-down");
  dlike.classList.add("fa-thumbs-down");
  dlike.onclick = () => {
    handleNoDislike(id);
  }
  showFeedbackPopup("dislike", botText.innerText, id);
};

const handleNoDislike = (id) => {
  const botText = document.getElementById(`bot-text${id}`);
  if (botText) {
    console.log("No Disliked:", botText.innerText);
    // Add your no dislike logic here, e.g., send data to backend
  } else {
    console.error(`Element bot-text${id} not found.`);
  }
  const dlike = document.getElementById(`dislike${id}`);
  dlike.classList.remove("fa-thumbs-down");
  dlike.classList.add("fa-thumbs-o-down");
  dlike.onclick = () => {
    handleDislike(id);
  }
};

const handleCopy = (id) => {
  const botText = document.getElementById(`bot-text${id}`);
  if (botText) {
    navigator.clipboard.writeText(botText.innerText)
      .then(() => {
        console.log("Copied:", botText.innerText);
        // Optionally, show a success message to the user
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        // Optionally, show an error message to the user
      });
  } else {
    console.error(`Element bot-text${id} not found.`);
  }

};


const handleSpeak = (id) => {
  const botText = document.getElementById(`bot-text${id}`);
  let lang = localStorage.getItem('language') || "en";
  if (lang === "mwr") {
    lang = "hi";
  }

  if (!botText) {
    console.error(`Element bot-text${id} not found.`);
    return;  // Exit early if the element is not found
  }

  const spk = document.getElementById(`speak${id}`);
  if (!spk) {
    console.error(`Element speak${id} not found.`);
    return; // Exit if the icon is not found
  }

  window.speechSynthesis.cancel(); // Stop any existing speech

  const utterance = speak(botText.innerText, lang); // Start speaking

  if (!utterance) { return; } // Exit if speak fails (e.g., browser incompatibility)

  spk.classList.remove("fa-volume-up");
  spk.classList.add("fa-volume-mute");  // Immediately switch to stop icon


  utterance.onend = () => { // Icon management *only* on natural end of speech
    spk.classList.remove("fa-volume-mute");
    spk.classList.add("fa-volume-up");
    spk.onclick = () => handleSpeak(id); // Reset click handler for next speak action
  };

  spk.onclick = () => { // Set stop action while speaking
    window.speechSynthesis.cancel(); //Immediately stop ongoing speech
    spk.classList.remove("fa-volume-mute");
    spk.classList.add("fa-volume-up");
    spk.onclick = () => handleSpeak(id);
  };
};