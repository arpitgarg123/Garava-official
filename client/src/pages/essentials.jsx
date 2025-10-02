import Card from "../components/essentials/Card";
import jewelleryImg from "../assets/images/j-front.jpg";
import fragranceImg from "../assets/images/essential-f.png";

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
      subtitle: "Signature Collection", 
      img: jewelleryImg,
      hotspotSize: "42%",
      link: "/products/jewellery"
    },
    {
      id: 2,
      title: "Fragrance",
      subtitle: "Eau de Luxe",
      img: fragranceImg, 
      hotspotSize: "42%",
      link: "/products/fragrance"
    }
  ];

  const setCardRef = (el, idx) => {
    cardRefs.current[idx] = el;
  };



    
    
  return (
    <section 
    
      className="py-16 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="page-header">
          <PageHeader title="Essentials" />
        </div>

        <div className="flex -mx-4 gap-8 mt-12">
          {essentialItems.map((item, index) => (
            <Card
              key={item.id}
              ref={(el) => setCardRef(el, index)}
              title={item.title}
              subtitle={item.subtitle}
              img={item.img}
              hotspotSize={item.hotspotSize}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Essentials;