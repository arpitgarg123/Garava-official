import React, { useState, useMemo } from "react";

// AdminNewsletterDashboard.jsx
// Plain JavaScript React component for Newsletter Subscribers UI (UI-only, no fetching)
// TailwindCSS styling. Accepts props for data + handlers.

export default function Newsletter(props) {
  const {
    subscribers = [], // [{ _id, email, name, status, source, createdAt }]
    pagination = { page: 1, limit: 20, total: 0, totalPages: 0 },
    filters = { status: "" },
    onFilterChange = function () {}, // (newFilters) => void
    onClearFilters = function () {},
    onPageChange = function () {}, // (newPage) => void
    
  } = props;

  let [localFilters, setLocalFilters] = useState(filters);
  let [checked, setChecked] = useState([]); // selected subscriber IDs for bulk actions

  let statusOptions = useMemo(function () {
    return ["", "subscribed", "unsubscribed", "bounced" ];
  }, []);

  function applyFilters() {
    onFilterChange(localFilters);
  }

  function clearFilters() {
    let cleared = { status: "" };
    setLocalFilters(cleared);
    onClearFilters();
  }

  function formatDate(iso) {
    if (!iso) return "-";
    try { let d = new Date(iso); return d.toLocaleString(); } catch (e) { return iso; }
  }

  function allCheckedOnPage() {
    let idsOnPage = subscribers.map(function (s) { return s._id; }).filter(Boolean);
    return idsOnPage.length > 0 && idsOnPage.every(function (id) { return checked.indexOf(id) !== -1; });
  }

  function toggleAllOnPage() {
    let idsOnPage = subscribers.map(function (s) { return s._id; }).filter(Boolean);
    if (allCheckedOnPage()) {
      setChecked(function (prev) { return prev.filter(function (id) { return idsOnPage.indexOf(id) === -1; }); });
    } else {
      setChecked(function (prev) { return Array.from(new Set(prev.concat(idsOnPage))); });
    }
  }

  function toggleOne(id) {
    setChecked(function (prev) {
      if (prev.indexOf(id) !== -1) return prev.filter(function (x) { return x !== id; });
      return prev.concat(id);
    });
  }

  function goToPage(newPage) {
    if (newPage < 1 || newPage > (pagination.totalPages || 1)) return;
    onPageChange(newPage);
  }

  return (
    <div className="w-full h-full ">
      <div className="flex items-center justify-between mb-6">
        {/* <h2 className="text-xl font-semibold">All Newsletters</h2> */}

        <div className="flex items-center gap-2 mt-4">
          <label className="text-sm">Status</label>
          <select
            value={localFilters.status}
            onChange={function (e) { setLocalFilters(function (f) { return Object.assign({}, f, { status: e.target.value }); }); }}
            className="border rounded-md px-2 py-1 text-sm"
          >
            {statusOptions.map(function (s) { return (
              <option key={s || "all"} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}</option>
            ); })}
          </select>
          <button onClick={applyFilters} className="px-3 py-1 bg-black text-white rounded-md text-sm">Apply</button>
          <button onClick={clearFilters} className="px-3 py-1 border rounded-md text-sm">Clear</button>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">Selected: {checked.length}</div>
      
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              <th className="py-3 px-2">
                <input type="checkbox" checked={allCheckedOnPage()} onChange={toggleAllOnPage} />
              </th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">No subscribers found</td>
              </tr>
            )}

            {subscribers.map(function (s, idx) {
              return (
                <tr key={s._id || idx} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <input type="checkbox" checked={checked.indexOf(s._id) !== -1} onChange={function () { toggleOne(s._id); }} />
                  </td>
                  <td className="py-3 px-2 font-medium">{s.email || "—"}</td>
            
                  <td className="py-3 px-2">
                    <span className={("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium " + (s.status === "subscribed" ? "bg-green-100 text-green-800" : s.status === "bounced" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"))}>
                      {s.status || "subscribed"}
                    </span>
                  </td>
                  <td className="py-3 px-2">{formatDate(s.createdAt)}</td>
                
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing page {pagination.page} of {pagination.totalPages || 1} — {pagination.total || 0} subscribers</div>
        <div className="flex items-center gap-2">
          <button onClick={function () { goToPage(pagination.page - 1); }} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3 py-1 border rounded">{pagination.page}</div>
          <button onClick={function () { goToPage(pagination.page + 1); }} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
