import BlogCard from "./BlogCard";

const blogs = [
  {
    id: 1,
    image: "/images/insta1.jpg",
    category: "Jewelry",
    date: "29 Jun 2025",
    author: "Garava",
    title: "How to Secretly Find Out Your Partner’s Ring Size for a Surprise Proposal",
    description:
      "Arranging a surprise proposal is a very romantic action which is quite lovely, but the successful execution requires subtle steps...",
    comments: 0,
  },
  {
    id: 2,
    image: "/images/blog2.jpg",
    category: "Fragrance",
    date: "15 Jul 2025",
    author: "Garava",
    title: "Top 5 Fragrances That Make the Perfect Gift",
    description:
      "Fragrance is more than just a scent—it’s an experience. Here are our top 5 picks for perfumes that make memorable gifts...",
    comments: 4,
  },
];

const BlogList = () => {
  return (
    <section className=" max-w-7xl mx-auto mt-26">
   <header className="head w-full">
          <div className="head-inner ">
            <h2 className="head-text text-3xl md:text-4xl">Blogs</h2>
            <div className="head-line "></div>
          </div>
        </header>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default BlogList;
