 import { Link, useLocation } from "react-router-dom";
import AboutHeading from '../components/about/AboutHeading';
import AboutText from '../components/about/AboutText';
import { useEffect } from "react";

const About = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
  <main className="w-full h-fit text-black py-8 sm:py-10 md:py-8 lg:py-10 flex flex-col items-center ">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <AboutHeading text={"Worn by the Worthy"} />
        <AboutText
          className="text-[1.0625rem]  text-center w-full  tracking-tight leading-6 sm:leading-7 md:leading-8 text-head-italic"
          paragraph={`Where Purpose-led Luxury Meets Prestige`}
        />
        <Link to='/about' className="mt-2 sm:mt-0">
         <button
              className="btn w-full sm:w-auto px-6 sm:px-8 py-3 text-[1.0625rem] sm:text-base"
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