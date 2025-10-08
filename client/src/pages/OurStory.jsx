import React from "react";
import BackButton from "../components/BackButton";

const OurStory = () => {
  return (
    <section
      aria-labelledby="our-story-heading"
      className="w-full bg-white "
    >
       <div className="sticky top-34 z-10 mb-3 max-md:top-10">
          <BackButton />
        </div>
      <div className="mx-auto max-w-3xl lg:max-w-4xl px-4 sm:px-6  lg:px-8 py-12 sm:py-16 max-md:py-0">
        {/* Headings */}
        <header className="mb-6 sm:mb-8 mt-20 max-md:mt-0">
          <h1
            id="our-story-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight"
          >
            OUR STORY
          </h1>
          <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-medium">
            History of GARAVA
          </h2>
        </header>

        {/* Body */}
        <article className="space-y-5 sm:space-y-6 leading-relaxed text-[15px] sm:text-base">
          <p>
            GARAVA&apos;s ideology is straightforward: true luxury isn&apos;t about following
            trends, it&apos;s about value. With passion as our brand for fragrances and diamonds,
            our mission is to uphold refinement, elegance, and integrity for those who appreciate
            the rare.
          </p>

          <p>
            Our philosophy is simple: if you feel worthy, GARAVA is for you. We&apos;re for all who
            want more than beauty — for all who live their lives with confidence, drive, and grace.
          </p>

          <p>
            From luxury diamonds that shine with timeless brilliance to fragrances that define
            character, every GARAVA creation is made to uplift and inspire. We blend heritage with
            creativity to shape experiences that bring new meaning to fine jewelry and perfumes.
          </p>

          <p>
            For us, luxury isn’t about excess; it’s about self-worth. That’s why every detail, from
            design to delivery, reflects our professionalism, passion, and forward-thinking spirit.
          </p>

          <p>
            GARAVA is more than a brand. It’s a declaration of identity, a celebration of those who
            are worthy, and a doorway to the timeless and extraordinary.
          </p>

          <h3 className="pt-2 text-lg sm:text-xl font-medium">
            New Age Luxury, Worn by the Worthy.
          </h3>

          <h4 className="text-xl sm:text-2xl font-semibold">This is GARAVA.</h4>
        </article>
      </div>
    </section>
  );
};

export default OurStory;
