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
  <main className="w-full text-black py-8 sm:py-12 md:py-16 lg:py-20 flex flex-col items-center ">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <AboutHeading text={"Where Purpose-led Luxury Meets Prestige"} />
        <AboutText
          className="text-base sm:text-lg md:text-xl text-center mx-auto mt-4 sm:mt-6 md:mt-8 tracking-tight leading-6 sm:leading-7 md:leading-8 text-head-italic"
          paragraph={`Explore GARAVA Because when you know your worth, luxury becomes your story.`}
        />
        <Link to='/about' className="mt-6 sm:mt-8">
         <button
              className="btn w-full sm:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base"
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