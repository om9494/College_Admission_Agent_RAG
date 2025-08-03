import React, { useContext, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; // Import the context
import translations from '../context/translations.json';


export default function Home() {
    const navigate = useNavigate();

    const { language } = useLanguage();  // Access the language from context


    const translate = (key) => {
      return translations[language][key] || key; // Returns translated text or original key
    };


    useEffect(() => {
      // This effect will run whenever the language changes
    }, [language]);

    return (
        <div>
            <Header />
            <div className='content'>
                <div className='home-content'>
                    <h1 className=''>{translate("Admission Chat Engine")}</h1>
                    <h3 className=''>
              <p className=''>{translate("ACE is an AI chatbot offering real-time, multilingual support for admissions and college comparisons, integrated with Rajasthan's Department of Technical Education.")}</p>
                    </h3>
                </div>
                <div className='home-middle'>
                    <button className='start-ace' onClick={() => navigate("/ace")}>
                      <i className='fa-solid fa-comments text-2xl mr-2'></i> &nbsp;
                      {translate("Start a Chat")}
                    </button>

                    <img className="home-back-img" src="./assets/home page.svg" />

                    <div className='home-box' id="email-box"> {translate("Email Notification")} </div>
                    <div className='home-box' id="comp-box"> {translate("Specialized")}<br/>  {translate("College")}<br/> {translate("Comparison")} </div>
                    <div className='home-box' id="adm-box"> {translate("Admission")}<br/> {translate("Guidance")} </div>
                    <div className='home-box' id="personal-box"> {translate("One to One")}<br/> {translate("Personalized")}<br/> {translate("Assistance")} </div>
                    
                    <button className='ace-video' onClick={() => navigate("/ace")}>
                      <i className='fa-solid fa-video text-2xl mr-2'></i>   &nbsp;
                      {translate("Let's Demo")}
                    </button>

                    <button className='ace-feedback' onClick={() => navigate("/ace")}>
                      <i className='fa-solid fa-comment-dots text-2xl mr-2'></i>  &nbsp;
                      {translate("FeedBack")}
                    </button>
                </div>

            </div>
        </div>
    )
}
