import React, { useEffect, useRef } from "react";
// import 'locomotive-scroll/dist/locomotive-scroll.css';

import HeroSection from '../components/hero/Herosection';
import About from './About';
import Jewellry from './Jewellry';
import Essentials from './essentials';
import Fragnance from './Fragnance';
// import NewsLater from './NewsLetter';
// import Jewellry from './products/Jewellry';
import NewsletterInline from '../components/newsLatter/NewsletterInline';
import Review from './Review';
import Instagram from '../components/instagram/Instagram';
import InstaPost from "./InstaPost";

export default function HomePage() {
  // Hold any 3rd‑party instance (Lenis/Swiper/etc.)
  const instanceRef = useRef(null);

  useEffect(() => {
    // initialize your lib instance here and assign to instanceRef.current
    // e.g.
    // const inst = new Lenis({ ... });
    // instanceRef.current = inst;

    return () => {
      // Guard in StrictMode (cleanup runs twice)
      instanceRef.current?.destroy?.();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div id="scroll-container" className="bg-secondary text-textColor min-h-screen overflow-x-hidden">
      {/* <Navbar /> */}
      <HeroSection />
      <About />
      <Essentials />
      <Jewellry />
      <Fragnance />
      {/* <Instagram /> */}
      <InstaPost />
      <Review/>
  <NewsletterInline />
      {/* <Footer /> */}
      {/* <div className='h-screen w-full'></div> */}
    </div>
  );
}