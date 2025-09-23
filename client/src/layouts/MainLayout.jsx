import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Navbar from '../components/navbar/Navbar';

const MainLayout = ({children}) => {
      const location = useLocation();

        useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
   <>
   <Navbar />
    <main id="main-content" className="min-h-screen">
        <Outlet />
        {children}
      </main>
      <Footer />
   </>
  )
}

export default MainLayout