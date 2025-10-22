import React from "react";
import BackButton from "../components/BackButton";

const DetailedAbout = () => {
  return (
    <section
      aria-labelledby="about-heading"
      className="w-full h-fit  mt-30 max-md:mt-0"
    >
      <div className="sticky top-44 z-10 mb-3 max-md:top-10">
        <BackButton />
      </div>
      <div className="mx-auto max-w-3xl lg:max-w-4xl px-4 sm:px-6  lg:px-8 py-12 sm:py-16 max-md:py-0 max-xl:py-0">
        {/* About GARAVA Section */}
        <header className="mb-6 sm:mb-8 mt-2 max-md:mt-0">
          <h1
            id="about-heading"
            className="text-3xl sm:text-3xl font-semibold tracking-tight"
          >
            ABOUT GARAVA
          </h1>
        </header>

        <article className="space-y-5 sm:space-y-6 leading-relaxed text-[15px] sm:text-base">
          <p>
            GARAVA is a modern luxury Maison born from purpose and shaped by precision.
          </p>
          
          <p>
            Each creation from sculpted jewels to fragrances of quiet power carries a sense of ceremony, 
            a devotion to conscience, and a reverence for timeless form.
          </p>
          
          <p>
            Our world is one where refinement meets responsibility.
          </p>
          
          <p>
            Where every detail is designed not to impress, but to endure.
          </p>
          
          <p>
            Guided by a belief that luxury must hold meaning, GARAVA crafts with care, ensuring every piece 
            becomes a lasting symbol of grace, integrity, and individuality.
          </p>
          
          <p>
            Rooted in mindful creation and elevated by global sensibility, GARAVA embodies purpose-led prestige. 
            A new expression of modern luxury.
          </p>
          
          <p>
            It is not defined by heritage or inheritance, but by the quiet confidence of those who know who they are.
          </p>

          <div className="text-center py-6 sm:py-8">
            <h2 className="text-xl sm:text-3xl font-semibold mb-2">GARAVA</h2>
            <p className="text-lg sm:text-xl font-medium italic">&quot;Worn by the Worthy&quot;</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default DetailedAbout;