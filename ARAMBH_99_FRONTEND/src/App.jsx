import './App.css';
import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/footer';
import Header from './components/header';
import Loader from './components/loader';
import About from './pages/about';
import Help from './pages/help';
import Faq from './pages/faq';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/profile';
import ForgotPassword from './pages/forget_password';
import ResetPassword from './pages/reset_password';
import Ace from './pages/ace';
import PersonalGuide from './components/personal_guide';
import Home from './pages/home';
import Admin from './pages/admin';
import AdminLogin from './pages/admin_login';
import AdminSignup from './pages/admin_signup';
import AdminDashboard from './pages/admin_dashboard';
import AdminPortal from './pages/admin_portal';
import DteAdmin from './pages/dteadmin';
import DteDashboard from './pages/dtedashboard';
import DtePortal from './pages/dteportal';
import DTESignup from './pages/dte_signup';
import { LanguageProvider } from "./context/LanguageContext";

// Context for user state
export const UserContext = createContext();
export const AdminContext = createContext();
export const DTEContext = createContext();
export const CollegeContext = createContext();


function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [dte, setDte] = useState(null);
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check local storage for user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Simulate loading delay - replace with actual loading logic
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust delay as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  useEffect(() => {
    const savedDte = localStorage.getItem('dte');
    if (savedDte) {
      setDte(JSON.parse(savedDte));
    }
  }, []);

  useEffect(() => {
    const savedCollege = localStorage.getItem('college');
    if (savedCollege) {
      setCollege(JSON.parse(savedCollege));
    }
  }, []);


  // Route Protection Component
  const ProtectedRoute = ({ element, ...rest }) => {
    return (user || admin || dte) ? element : <Navigate to="/login" />;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <LanguageProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <AdminContext.Provider value={{ admin, setAdmin }}>
          <DTEContext.Provider value={{ dte, setDte }}>
            <CollegeContext.Provider value={{ college, setCollege }}>
              <Router>
                {/* <Header /> */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/ace" element={<Ace />} />
                  <Route path="/ace/personal" element={<PersonalGuide />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dte" element={<ProtectedRoute element={<DteAdmin />} />} />
                  <Route path="/dte/login" element={<Login />} />
                  <Route path="/dte/dashboard" element={<ProtectedRoute element={<DteDashboard />} />} />
                  <Route path="/dte/portal" element={<ProtectedRoute element={<DtePortal />} />} />
                  <Route path="/dte/signup" element={<DTESignup />} />
                  <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/signup" element={<AdminSignup />} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
                  <Route path="/admin/portal" element={<ProtectedRoute element={<AdminPortal />} />} />
                  <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
                {/* <Footer /> */}
              </Router>
            </CollegeContext.Provider>
          </DTEContext.Provider>
        </AdminContext.Provider>
      </UserContext.Provider>
    </LanguageProvider>
  );
}

export default App;
