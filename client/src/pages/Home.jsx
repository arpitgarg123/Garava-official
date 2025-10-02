import React, { useEffect, useRef } from "react";
import 'locomotive-scroll/dist/locomotive-scroll.css';

import HeroSection from '../components/hero/Herosection';
import About from './About';
import Jewellry from './Jewellry';
import Essentials from './essentials';
import Fragnance from './Fragnance';
import NewsletterInline from '../components/newsLatter/NewsletterInline';
import Review from './Review';
import Instagram from '../components/instagram/Instagram';
import InstaPost from "./InstaPost";
import { useLocation } from "react-router-dom";
import EnhancedChatbotWidget from "../components/chatbot/EnhancedChatbotWidget";
import { useLocomotiveScroll } from '../hooks/useLocomotiveScroll';

export default function HomePage() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  
  // Use Locomotive Scroll hook
  const { scrollRef, updateScroll } = useLocomotiveScroll(true);

  


  return (
    <div 
      ref={scrollRef} 
      id="scroll-container" 
      className="bg-secondary text-textColor min-h-screen overflow-x-hidden"
      data-scroll-container
    >
      <div data-scroll-section>
        <HeroSection />
      </div>
      
      <div data-scroll-section>
        <section id="about">
          <About />
        </section>
      </div>
      
      <div data-scroll-section>
        <section id="essentials">
          <Essentials />
        </section>
      </div>
      
       
      <div data-scroll-section>
        <section id="jewellery">
          <Jewellry />
        </section>
      </div>
      
    <div data-scroll-section>
        <section id="fragrance">
          <Fragnance />
        </section>
      </div>
      
      {isHome && <EnhancedChatbotWidget />}
      
      <div data-scroll-section>
        <InstaPost />
      </div>
      
      <div data-scroll-section>
      <section id="reviews">
          <Review />
        </section>
      </div>
      
      <div data-scroll-section>
      <section id="newsletter">
          <NewsletterInline />
        </section>
      </div>
    </div>
  );
}