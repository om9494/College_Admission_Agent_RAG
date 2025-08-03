import React, { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const getVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };

        if (window.speechSynthesis) {
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = getVoices;
            } else {
                getVoices();
            }
        }
    }, []);

    const speak = (text, lang) => {
        if (!window.speechSynthesis) { // Check within the speak function
            console.error("Speech Synthesis not supported.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        const hindiLang = lang === 'mwr' ? 'hi-IN' : lang;  // Keep this correction
        utterance.lang = hindiLang;
        utterance.pitch = 2;
        utterance.rate = 1;
        utterance.volume = 1;

        // const voices = window.speechSynthesis.getVoices();
        // Find a female voice that matches the language (or just a female voice as fallback)
        const femaleVoice = voices.find(voice => voice.lang.startsWith(hindiLang)) ||
            voices.find(voice => voice.lang === hindiLang);



        if (femaleVoice) {
            utterance.voice = femaleVoice;
            console.log("Using female voice:", femaleVoice.name);
        } else {
            console.warn("No suitable female voice found. Using default.");
        }

        window.speechSynthesis.speak(utterance);
    };

    return { speak }; // Return the speak function
};



export default useSpeechSynthesis; // Export the hook
