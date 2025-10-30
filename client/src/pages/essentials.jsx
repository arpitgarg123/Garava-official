import Card from "../components/essentials/Card";
import jewelleryImg from "../assets/images/display-banner.webp";
import fragranceImg from "../assets/images/essential-f.webp";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import PageHeader from "../components/header/PageHeader";

gsap.registerPlugin(ScrollTrigger);

const Essentials = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  // Essential items configuration with navigation links
  const essentialItems = [
    {
      id: 1,
      title: "Jewellery", 
      img: jewelleryImg,
      hotspotSize: "42%",
      link: "/products/jewellery"
    },
    {
      id: 2,
      title: "Fragrance",
      img: fragranceImg, 
      hotspotSize: "42%",
      link: "/products/fragrance"
    }
  ];

  const setCardRef = (el, idx) => {
    cardRefs.current[idx] = el;
  };

  // GSAP Animation for cards
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    
    if (cards.length > 0) {
      // Reset any previous animations
      gsap.killTweensOf(cards);
      
      // Set initial state
      gsap.set(cards, {
        opacity: 0,
        y: 60,
        scale: 0.95
      });

      // Create scroll trigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate cards with stagger
      tl.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);
    
  return (
    <section 
      ref={sectionRef}
      className="py-8 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="page-header mb-8 sm:mb-12 lg:mb-16">
          <PageHeader title="Essentials" />
        </div>

        {/* Cards Container - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2  items-center justify-center mx-auto gap-6 sm:gap-2 lg:gap-10 xl:gap-10">
          {essentialItems.map((item, index) => (
            <div key={item.id} className="w-full flex items-center justify-center">
              <Card
                ref={(el) => setCardRef(el, index)}
                title={item.title}
                img={item.img}
                hotspotSize={item.hotspotSize}
                link={item.link}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Essentials;