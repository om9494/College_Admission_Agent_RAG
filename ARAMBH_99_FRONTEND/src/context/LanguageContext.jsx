import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const azureKey = import.meta.env.VITE_AZURE_KEY; // Replace with your Azure key
  const azureEndpoint = import.meta.env.VITE_AZURE_ENDPOINT; // Replace with your Azure endpoint
  
  const translateText = useCallback(async (text, targetLang) => {
    try {
      // console.log("Translating text:", text);
      // console.log("Target language:", targetLang);

      const adjustedTargetLang = targetLang === 'mwr' ? 'hi' : targetLang;
  
      const response = await axios({
        method: "post",
        url: `${azureEndpoint}/translate?api-version=3.0`,
        headers: {
          "Ocp-Apim-Subscription-Key": azureKey,
          "Ocp-Apim-Subscription-Region": "centralindia",
          "Content-type": "application/json",
        },
        data: [{ text }],
        params: { to: adjustedTargetLang },
      });
  
      setLanguage(targetLang);
      // console.log("Translation response:", response.data[0].translations[0].text);
      return response.data[0].translations[0].text;
    } catch (error) {
      console.error("Translation error:", error);
      console.error("Error details:", error.response ? error.response.data : error.message);
      return text; // Fallback
    }
  }, [language, azureKey, azureEndpoint]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
