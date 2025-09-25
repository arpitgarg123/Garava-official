import React, { useState, useMemo } from "react";

// AdminAppointmentsDashboard.jsx
// Plain JavaScript React component (no TypeScript). UI-only — accepts data/handlers via props.
// TailwindCSS for styling. Does not perform any network calls.

export default function Appointment(props) {
  const {
    appointments = [],
    pagination = { page: 1, limit: 20, total: 0, totalPages: 0 },
    filters = { status: "", serviceType: "", fromDate: "", toDate: "" },
    onFilterChange = function () {},
    onClearFilters = function () {},
    onPageChange = function () {},
    onOpen = function () {},
    onAction = function () {},
  } = props;

  let [localFilters, setLocalFilters] = useState(filters);

  let statusOptions = useMemo(function () {
    return ["", "pending", "confirmed", "completed", "cancelled"];
  }, []);

  let serviceOptions = useMemo(function () {
    return ["", "consultation", "repair", "custom-order", "other"];
  }, []);

  function applyFilters() {
    onFilterChange(localFilters);
  }

  function clearFilters() {
    let cleared = { status: "", serviceType: "", fromDate: "", toDate: "" };
    setLocalFilters(cleared);
    onClearFilters();
  }

  function formatDate(iso) {
    if (!iso) return "-";
    try {
      let d = new Date(iso);
      return d.toLocaleString();
    } catch (e) { return iso; }
  }

  function goToPage(newPage) {
    if (newPage < 1 || newPage > (pagination.totalPages || 1)) return;
    onPageChange(newPage);
  }

  return (
    <div className=" w-full h-full">
      <div className="flex items-center justify-between mb-6">

        <div className="flex gap-3 items-center mt-4a">
          <div className="flex items-center gap-2">
            <label className="text-sm">Status</label>
            <select
              value={localFilters.status}
              onChange={function (e) { setLocalFilters(function (f) { return Object.assign({}, f, { status: e.target.value }); }); }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              {statusOptions.map(function (s) { return (
                <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}</option>
              ); })}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Service</label>
            <select
              value={localFilters.serviceType}
              onChange={function (e) { setLocalFilters(function (f) { return Object.assign({}, f, { serviceType: e.target.value }); }); }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              {serviceOptions.map(function (s) { return (
                <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ") : "All"}</option>
              ); })}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">From</label>
            <input type="date" value={localFilters.fromDate} onChange={function (e) { setLocalFilters(function (f) { return Object.assign({}, f, { fromDate: e.target.value }); }); }} className="border rounded-md px-2 py-1 text-sm" />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">To</label>
            <input type="date" value={localFilters.toDate} onChange={function (e) { setLocalFilters(function (f) { return Object.assign({}, f, { toDate: e.target.value }); }); }} className="border rounded-md px-2 py-1 text-sm" />
          </div>

          <button onClick={applyFilters} className="px-3 py-1 bg-black text-white rounded-md text-sm">Apply</button>
          <button onClick={clearFilters} className="px-3 py-1 border rounded-md text-sm">Clear</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              <th className="py-3 px-2">#</th>
              <th className="py-3 px-2">Customer</th>
              <th className="py-3 px-2">Service</th>
              <th className="py-3 px-2">When</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Notes</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">No bookings found</td>
              </tr>
            )}

            {appointments.map(function (a, idx) {
              return (
                <tr key={a._id || idx} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                  <td className="py-3 px-2">
                    <div className="font-medium">{a.customerName || (a.customer && a.customer.name) || "—"}</div>
                    <div className="text-xs text-gray-500">{a.customerEmail || (a.customer && a.customer.email) || ""}</div>
                  </td>
                  <td className="py-3 px-2">{a.serviceType || "—"}</td>
                  <td className="py-3 px-2">{formatDate(a.appointmentAt || a.createdAt)}</td>
                  <td className="py-3 px-2">
                    <span className={("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium " + (a.status === "confirmed" ? "bg-green-100 text-green-800" : a.status === "completed" ? "bg-blue-100 text-blue-800" : a.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"))}>{a.status || "pending"}</span>
                  </td>
                  <td className="py-3 px-2 max-w-xs truncate">{a.adminNotes || a.notes || "—"}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button onClick={function () { onOpen(a); }} className="px-2 py-1 border rounded text-sm">View</button>
                      {a.status !== "confirmed" && a.status !== "completed" && (
                        <button onClick={function () { onAction("confirm", a); }} className="px-2 py-1 bg-black text-white rounded text-sm">Confirm</button>
                      )}
                      {a.status !== "cancelled" && (
                        <button onClick={function () { onAction("cancel", a); }} className="px-2 py-1 border rounded text-sm">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing page {pagination.page} of {pagination.totalPages || 1} — {pagination.total || 0} bookings</div>
        <div className="flex items-center gap-2">
          <button onClick={function () { goToPage(pagination.page - 1); }} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3 py-1 border rounded">{pagination.page}</div>
          <button onClick={function () { goToPage(pagination.page + 1); }} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
