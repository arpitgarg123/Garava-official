import BlogCard from "../../components/blogs/BlogCard";
import blogImage from '../../assets/images/insta2.webp'
import blogImage1 from '../../assets/images/insta3.webp'
import PageHeader from "../../components/header/PageHeader";
import BackButton from "../../components/BackButton";

const blogs = [
  {
    id: 1,
    image: blogImage,
    category: "Jewellery",
    date: "29 Jun 2025",
    author: "Garava",
    title: "How to Secretly Find Out Your Partner’s Ring ",
    description:
      "Arranging a surprise proposal is a very romantic action which is quite lovely, but the successful execution requires subtle steps...",
    comments: 0,
  },
  {
    id: 2,
    image: blogImage1,
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
    <>
     <div className="sticky top-20 z-10 mb-3">
        <BackButton />
      </div>
  
    <section className=" max-w-7xl mx-auto mt-4">
      
   <PageHeader title="Blogs" />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
      </>
  );
};

export default BlogList;
