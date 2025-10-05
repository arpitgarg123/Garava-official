import React, { useState, useMemo } from "react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineUpload,
  AiOutlineDownload,
  AiOutlineDelete,
} from "react-icons/ai";
import BackButton from "../BackButton";
import { formatDate } from "../../utils/FormatDate";


export default function Blogs(props) {
  const {
    posts = [], // [{ _id, title, description, coverImageUrl, status, createdAt, author }]
    pagination = { page: 1, limit: 20, total: 0, totalPages: 0 },
    filters = { q: "", status: "" },
    onFilterChange = function () {}, // (newFilters) => void
    onClearFilters = function () {},
    onPageChange = function () {}, // (newPage) => void
    onOpen = function () {}, // (post) => void  // open details modal
    onAction = function () {}, // (actionName, post) => void  // "publish" | "unpublish" | "edit" | "delete"
  } = props;

  let [localFilters, setLocalFilters] = useState(filters);

  let statusOptions = useMemo(function () {
    return ["", "draft", "published"];
  }, []);

  function applyFilters() {
    onFilterChange(localFilters);
  }
  function clearFilters() {
    let cleared = { q: "", status: "" };
    setLocalFilters(cleared);
    onClearFilters();
  }
  function goToPage(newPage) {
    if (newPage < 1 || newPage > (pagination.totalPages || 1)) return;
    onPageChange(newPage);
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      {/* Header Section */}
      <div className=" rounded-xl border w-full border-gray-200 shadow-sm overflow-hidden">
        <header className="px-6 py-4 border-b w-full border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex flex-col sm:flex-row justify-between w-full  items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Blog Management</h3>
              <p className="text-sm text-gray-500 mt-1">{pagination.total || 0} total posts</p>
            </div>
            <button
              onClick={function () {
                onAction("create");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
            >
              New Post
            </button>
          </div>
        </header>
        
        {/* Filters Section */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search title/description..."
                value={localFilters.q}
                onChange={function (e) {
                  setLocalFilters(function (f) {
                    return Object.assign({}, f, { q: e.target.value });
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={localFilters.status}
                onChange={function (e) {
                  setLocalFilters(function (f) {
                    return Object.assign({}, f, { status: e.target.value });
                  });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {statusOptions.map(function (s) {
                  return (
                    <option key={s || "all"} value={s}>
                      {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All Status"}
                    </option>
                  );
                })}
              </select>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-h-80 overflow-y-auto p-6">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <div className="text-lg font-medium text-gray-900 mb-2">No blog posts found</div>
              <p className="text-gray-500">
                {localFilters.q || localFilters.status 
                  ? "Try adjusting your filters" 
                  : "Create your first blog post to get started"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(function (p) {
                return (
                  <article
                    key={p._id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <div className="aspect-[16/9] bg-gray-50 overflow-hidden">
                      {p.coverImageUrl ? (
                        <img
                          src={p.coverImageUrl}
                          alt={p.title || "Blog cover"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">
                          {p.title || "Untitled"}
                        </h3>
                        <span
                          className={
                            "ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium " +
                            (p.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800")
                          }
                        >
                          {p.status || "draft"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {p.description || "No description available"}
                      </p>
                      <div className="text-xs text-gray-500 mb-4">
                        {formatDate(p.createdAt)}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={function () {
                            onOpen(p);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                          title="View details"
                        >
                          <AiOutlineEye size={16} />
                        </button>
                        <button
                          onClick={function () {
                            onAction("edit", p);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                          title="Edit post"
                        >
                          <AiOutlineEdit size={16} />
                        </button>
                        {p.status === "published" ? (
                          <button
                            onClick={function () {
                              onAction("unpublish", p);
                            }}
                            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors duration-200"
                            title="Unpublish"
                          >
                            <AiOutlineDownload size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={function () {
                              onAction("publish", p);
                            }}
                            className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
                            title="Publish"
                          >
                            <AiOutlineUpload size={16} />
                          </button>
                        )}
                        <button
                          onClick={function () {
                            onAction("delete", p);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          title="Delete"
                        >
                          <AiOutlineDelete size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing page {pagination.page} of {pagination.totalPages || 1} — {pagination.total || 0} posts
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={function () {
                  goToPage(pagination.page - 1);
                }}
                disabled={pagination.page <= 1}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                {pagination.page}
              </span>
              <button
                onClick={function () {
                  goToPage(pagination.page + 1);
                }}
                disabled={pagination.page >= (pagination.totalPages || 1)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
