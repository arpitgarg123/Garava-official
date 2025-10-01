import React from "react";
import BlogListWithFilters from "../../components/blogs/BlogListWithFilters";
import PageHeader from "../../components/header/PageHeader";
import BackButton from "../../components/BackButton";

const BlogList = () => {
  return (
    <>
      <div className="sticky top-34 z-10 mb-3">
        <BackButton />
      </div>
      
      <section className="max-w-7xl mx-auto mt-32">
        <PageHeader title="Blogs" />
        <BlogListWithFilters />
      </section>
    </>
  );
};

export default BlogList;