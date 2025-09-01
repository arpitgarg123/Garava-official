import { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
// import 'locomotive-scroll/dist/locomotive-scroll.css';

import Navbar from '../components/navbar/Navbar';
import HeroSection from '../components/hero/Herosection';

const  HomePage = () =>{
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector('#scroll-container'),
      smooth: true,
      lerp: 0.08,
    });
    return () => scroll.destroy();
  }, []);

  return (
    <div id="scroll-container" className="bg-secondary text-textColor min-h-screen">
      <Navbar />
      <HeroSection />
    </div>
  );
}

export default HomePage;