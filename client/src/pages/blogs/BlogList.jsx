// import React from "react";
// import BlogListWithFilters from "../../components/blogs/BlogListWithFilters";
// import PageHeader from "../../components/header/PageHeader";
// import BackButton from "../../components/BackButton";

// const BlogList = () => {
//   return (
//     <>
//       <div className="sticky top-20 z-10 mb-3">
//         <BackButton />
//       </div>
//           <div className="flex flex-wrap justify-center gap-4 mb-12">
//           {categories.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => handleCategoryChange(category.id)}
//               className={`px-6 py-2 rounded-full transition-all duration-300 uppercase tracking-wider text-sm font-medium ${
//                 activeCategory === category.id
//                   ? 'bg-black text-white'
//                   : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               {category.label}
//             </button>
//           ))}
//         </div>
//       <section className="max-w-7xl mx-auto mt-4">
//         <PageHeader title="Blogs" />
//         <BlogListWithFilters />
//       </section>
//     </>
//   );
// };

// export default BlogList;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BlogListWithFilters from '../../components/blogs/BlogListWithFilters';
import { setFilters, selectBlogFilters } from '../../features/blogs/slice';
import BackButton from '../../components/BackButton';
import PageHeader from '../../components/header/PageHeader';

const BlogList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const filters = useSelector(selectBlogFilters);
  
  // Get category from URL params
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'all');

  // Categories matching your navbar structure
  const categories = [
    { id: 'all', label: 'All Blogs', value: '' },
    { id: 'jewellery', label: 'Jewellery', value: 'jewellery' },
    { id: 'fragrance', label: 'Fragrance', value: 'fragrance' },
    { id: 'garava', label: 'GARAVA', value: 'garava' }
  ];

  useEffect(() => {
    // Update filters when URL category changes
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
      const categoryValue = categoryFromUrl === 'all' ? '' : categoryFromUrl;
      dispatch(setFilters({ 
        ...filters, 
        category: categoryValue 
      }));
      setActiveCategory(categoryFromUrl);
    } else if (!categoryFromUrl && filters.category) {
      // Clear category filter if no category in URL
      dispatch(setFilters({ 
        ...filters, 
        category: '' 
      }));
      setActiveCategory('all');
    }
  }, [categoryFromUrl, dispatch, filters]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    
    const categoryValue = categoryId === 'all' ? '' : categoryId;
    
    // Update Redux filters
    dispatch(setFilters({ 
      ...filters, 
      category: categoryValue 
    }));

    // Update URL
    if (categoryId === 'all') {
      navigate('/blogs', { replace: true });
    } else {
      navigate(`/blogs?category=${categoryId}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen mt-2 max-sm:mt-0 max-md:mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 max-sm:py-0 max-md:py-0">
       <div className="sticky top-20 z-10 mb-3 max-sm:top-20 max-md:top-18">
        <BackButton />
       </div>
  <PageHeader title="Blogs" />
        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-2 rounded-full cursor-pointer max-sm:m-2 transition-all duration-300 uppercase tracking-wider text-sm font-medium ${
                activeCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Blog List with Filters Component */}
        <BlogListWithFilters 
          showHeader={false} // We're showing our own header
          limit={12}
        />
      </div>
    </div>
  );
};

export default BlogList;