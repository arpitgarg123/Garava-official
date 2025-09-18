import React, { useEffect } from 'react'
import { useLocation } from "react-router-dom";
import AboutHeading from '../components/about/AboutHeading';
import AboutText from '../components/about/AboutText';

const About = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
  <main className="w-full text-black py-20 flex flex-col items-center">
      <div className="w-full max-w-6xl px-6 flex flex-col ">
        <AboutHeading text={"''Worn by the Worthy''"} />
        <AboutText
          className="text-xl text-center mx-auto max-w-3xl tracking-tight leading-8 text-head-italic"
          paragraph={`Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa quibusdam labore sed vero.`}
        />
         <button
              className="btn mt-4"
              aria-label="View more products"
            >
              Explore..
            </button>
      </div>
    </main>
  )
}

export default About