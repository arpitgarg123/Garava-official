import { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
// import 'locomotive-scroll/dist/locomotive-scroll.css';

import Navbar from '../components/navbar/Navbar';
import HeroSection from '../components/hero/Herosection';
import About from './About';
import Jewellry from './Jewellry';
import Essentials from './essentials';
import Fragnance from './Fragnance';
import NewsLater from './NewsLetter';
import Footer from '../components/footer/Footer';

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
      <About />
      <Essentials />
      <Jewellry />
      <Fragnance />
    <NewsLater />
      <Footer />
      {/* <div className='h-screen w-full'></div> */}
    </div>
  );
}

export default HomePage;