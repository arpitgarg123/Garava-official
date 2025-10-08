import React, { useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import AboutHeading from '../components/about/AboutHeading';
import AboutText from '../components/about/AboutText';

const About = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
  <main  className="w-full text-black py-20 flex flex-col items-center">
      <div className="w-full max-w-6xl px-6 flex flex-col ">
        <AboutHeading text={"Where Purpose-led Luxury Meets Prestige"} />
        <AboutText
          className="text-xl text-center mx-auto max-w-3xl mt-2 tracking-tight leading-8 text-head-italic"
          paragraph={`Explore GARAVA Because when you know your worth, luxury becomes your story.`}
        />
        <Link to='/about'>
         <button
              className="btn mt-4"
              aria-label="View more products"
            >
              Explore..
            </button>
        </Link>
        
      </div>
    </main>
  )
}

export default About