import "./blog.css";
import { FiShare2 } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card bg-gray-50  overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          {blog.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
          <span>{blog.author}</span>
          <span>{blog.date}</span>
        </div>

        <h3 className="blog-title text-lg font-semibold text-gray-800 mb-2">
          {blog.title}
        </h3>
        <p className="blog-desc text-gray-600 text-sm mb-4">
          {blog.description}
        </p>

        <div className="flex items-center justify-between">
          <Link to='blog_details'>
                    <button className="blog-btn">Continue reading</button>

          </Link>

          <div className="flex items-center gap-3 text-gray-500">
            <FiShare2 className="cursor-pointer hover:text-blue-600" />
            <div className="flex items-center gap-1">
              <FaRegComment />
              <span>{blog.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
