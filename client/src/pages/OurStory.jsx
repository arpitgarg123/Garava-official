import React from "react";
import BackButton from "../components/BackButton";

const OurStory = () => {
  return (
    <section
      aria-labelledby="our-story-heading"
      className="w-full mt-30 max-md:mt-0 "
    >
       <div className="sticky top-44 z-10 mb-3 max-md:top-10">
          <BackButton />
        </div>
      <div className="mx-auto max-w-3xl lg:max-w-4xl px-4 sm:px-6  lg:px-8 py-12 sm:py-16 max-md:py-0">
        {/* Our Story Section */}
        <header className="mb-6 sm:mb-8 mt-2 max-md:mt-0">
          <h1
            id="our-story-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4"
          >
            OUR STORY
          </h1>
          <h2 className="text-lg sm:text-xl font-medium italic">
            The Making of Modern Luxury
          </h2>
        </header>
        <article className="space-y-5 sm:space-y-6 leading-relaxed text-[15px] sm:text-base">
            <p>
              GARAVA was not founded to follow trends but to redefine luxury with purpose. Created not to echo 
              what already exists but to reimagine what luxury could mean in a world that seeks depth over display.
            </p>
            
            <div className="text-center py-4 space-y-2 italic">
              <p>In our world, beauty is in stillness and not noise.</p>
              <p>Luxury is in intention and not abundance.</p>
              <p>And prestige is measured by purpose and not measured by price.</p>
            </div>
            
            <p>
              From the rarity of natural gemstones to the purity of vegan fragrances, every creation begins with 
              conscience and ends in refinement. Each line, texture, and note is shaped to evoke emotion that is 
              a quiet dialogue between craft and soul.
            </p>
            
            <p>
              GARAVA&apos;s essence lies in balance: Indian in philosophy, global in expression.
            </p>
            
            <p>
              We don&apos;t design for the trend. We design for the memory. Pieces that accompany lives of meaning, 
              marking moments of grace and transformation.
            </p>
            
            <p>
              Our creation - jewellery or perfume - reflects the world we wish to build: thoughtful, enduring, 
              and beautifully human.
            </p>
            
            <p className="font-medium">
              GARAVA is more than a name, it is a movement. A modern Maison that believes true luxury is found 
              where purpose meets prestige.
            </p>
        </article>
      </div>
    </section>
  );
};

export default OurStory;