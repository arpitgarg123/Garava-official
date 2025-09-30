import React from "react";
import { MdOutlineStar } from "react-icons/md";
import PageHeader from "../components/header/PageHeader";

const reviews = [
  {
    id: 1,
    text:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam aut itaque nemo? Quam distinctio nisi fugiat. Hic quod iure eos?",
    author: "@Dammy",
    stars: 4,
  },
  {
    id: 2,
    text:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam aut itaque nemo? Quam distinctio nisi fugiat. Hic quod iure eos?",
    author: "@Dammy",
    stars: 4,
  },
  {
    id: 3,
    text:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam aut itaque nemo? Quam distinctio nisi fugiat. Hic quod iure eos?",
    author: "@Dammy",
    stars: 4,
  },
];

const Review = () => {
  return (
    <div className="w-full py-10 sm:py-12">
      <PageHeader title="Reviews" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} {...r} />
          ))}
        </div>
      </div>
    </div>
  );
};

function ReviewCard({ stars = 4, text, author }) {
  return (
    <div className="rounded-2xl bg-gray-100 px-5 py-6 sm:px-6 sm:py-8 flex flex-col items-center justify-between h-full">
      {/* Stars */}
      <div className="mb-4 flex items-center justify-center gap-1">
        {Array.from({ length: stars }).map((_, i) => (
          <MdOutlineStar key={i} size={26} color="#032c6a" aria-hidden="true" />
        ))}
      </div>

      {/* Text */}
      <p className="text-center text-sm sm:text-base italic leading-relaxed text-gray-800">
        {text}
      </p>

      {/* Author */}
      <h3 className="mt-4 text-sm sm:text-base font-semibold text-gray-900">
        {author}
      </h3>
    </div>
  );
}

export default Review;
