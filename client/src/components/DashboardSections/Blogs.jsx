import React, { useState, useMemo } from "react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineUpload,
  AiOutlineDownload,
  AiOutlineDelete,
} from "react-icons/ai";
import BackButton from "../BackButton";

// AdminBlogsDashboard.jsx
// UI-only React component for managing blog posts
// - Plain JavaScript, TailwindCSS styling
// - Accepts data/handlers via props; NO fetching here

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
  function formatDate(iso) {
    if (!iso) return "-";
    try {
      let d = new Date(iso);
      return d.toLocaleString();
    } catch (e) {
      return iso;
    }
  }

  return (
    <div className="w-full h-full ">
    
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center justify-between w-full mt-4">
          <input
            type="text"
            placeholder="Search title/description"
            value={localFilters.q}
            onChange={function (e) {
              setLocalFilters(function (f) {
                return Object.assign({}, f, { q: e.target.value });
              });
            }}
            className="border rounded-md px-3 py-1 text-sm w-56"
          />
          <div className="flex items-center justify-between w-[40%]">
            <select
              value={localFilters.status}
              onChange={function (e) {
                setLocalFilters(function (f) {
                  return Object.assign({}, f, { status: e.target.value });
                });
              }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              {statusOptions.map(function (s) {
                return (
                  <option key={s || "all"} value={s}>
                    {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
                  </option>
                );
              })}
            </select>
            <button
              onClick={applyFilters}
              className="px-3 py-1 bg-black text-white rounded-md text-sm"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="px-3 py-1 border rounded-md text-sm"
            >
              Clear
            </button>
            <button
              onClick={function () {
                onAction("create");
              }}
              className="px-3 py-1 bg-black text-white rounded-md text-sm"
            >
              New Post
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10 border rounded-lg">
            No blog posts found
          </div>
        )}

        {posts.map(function (p) {
          return (
            <article
              key={p._id}
              className="overflow-hidden shadow-sm hover:shadow-md transition mt-4"
            >
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
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
              <div className="p-4 flex flex-col items-start justify-start h-full ">
                <div className="flex items-start justify-between self-start  ">
                  <h3 className="font-semibold line-clamp-1">
                    {p.title || "Untitled"}
                  </h3>
                  <span
                    className={
                      "ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium " +
                      (p.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800")
                    }
                  >
                    {p.status || "draft"}
                  </span>
                </div>
                <div>
                  <p className="text-md text-gray-600 line-clamp-2">
                    {p.description || "—"}
                  </p>
                  <span className="text-xs mt-3 text-gray-500">
                    {formatDate(p.createdAt)}
                  </span>
                </div>

                <div className=" flex items-start w-full gap-2">
                  <button
                    onClick={function () {
                      onOpen(p);
                    }}
                    className="p-2 "
                  >
                    <AiOutlineEye size={16} />
                  </button>
                  <button
                    onClick={function () {
                      onAction("edit", p);
                    }}
                    className="p-2 "
                  >
                    <AiOutlineEdit size={16} />
                  </button>
                  {p.status === "published" ? (
                    <button
                      onClick={function () {
                        onAction("unpublish", p);
                      }}
                      className="p-2 "
                    >
                      <AiOutlineDownload size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={function () {
                        onAction("publish", p);
                      }}
                      className="p-2 bg-black text-white rounded"
                    >
                      <AiOutlineUpload size={16} />
                    </button>
                  )}
                  <button
                    onClick={function () {
                      onAction("delete", p);
                    }}
                    className="p-2 "
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing page {pagination.page} of {pagination.totalPages || 1} —{" "}
          {pagination.total || 0} posts
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={function () {
              goToPage(pagination.page - 1);
            }}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <div className="px-3 py-1 border rounded">{pagination.page}</div>
          <button
            onClick={function () {
              goToPage(pagination.page + 1);
            }}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
