import "./blog.css";
import { FiShare2 } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/FormatDate";

const BlogCard = ({ blog }) => {

  const getImageUrl = () => {
    if (blog.coverImage?.url) {
      return blog.coverImage.url;
    }
    // Fallback image
    return 'https://via.placeholder.com/600x400?text=Blog+Image';
  };

  return (
    <div className="blog-card bg-gray-50  overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img
          src={getImageUrl()}
          alt={blog.coverImage?.alt || blog.title}
          className="w-full h-56 object-cover"
        />
        {blog.category && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {blog.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between text-gray-500 text-md mb-2">
          <span>{blog.author?.name || 'Garava'}</span>
          <span>{formatDate(blog.publishAt || blog.createdAt)}</span>
        </div>

        <h3 className="blog-title text-lg font-semibold text-gray-800 mb-2">
          {blog.title}
        </h3>
        <p className="blog-desc text-gray-600 text-md mb-4">
          {blog.excerpt || blog.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between ">
          <Link to={`/blogs/${blog.slug}`}>
            <button className="blog-btn">Continue reading</button>
          </Link>

          <div className="flex items-center gap-3 text-gray-500">
            <FiShare2 className="cursor-pointer hover:text-blue-600" />
            <div className="flex items-center gap-1">
              <FaRegComment />
              <span>{blog.comments || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
