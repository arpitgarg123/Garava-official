import React from "react";
import { MdTrendingUp } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { BiPackage } from "react-icons/bi";
import { AiOutlineStar } from "react-icons/ai";

// AdminOverview.jsx
// UI-only dashboard overview. No data fetching.
// Pass data via props (see prop shapes at bottom).

export default function Overview({
  stats = {
    revenueINR: 0,
    orders: 0,
    products: 0,
    avgRating: 0,
    conversionRatePct: 0,
  },
  revenueTrend = [], // numbers for the sparkline (last N days revenue in INR)
  topProducts = [], // [{ _id, name, image, salesINR, units }]
  recentOrders = [], // [{ _id, orderNumber, createdAt, status, totalINR }]
  recentReviews = [], // [{ _id, userName, rating, comment, createdAt }]
  upcomingAppointments = [], // [{ _id, customerName, serviceType, appointmentAt, status }]
  onOpenOrder = () => {},
  onOpenProduct = () => {},
  onOpenReview = () => {},
  onOpenAppointment = () => {},
}) {
  // formatters
  const fmtINR = (n) => {
    try { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0); } catch { return `₹${n||0}`; }
  };
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleString() : "-";

  // simple sparkline path generator from numbers (SVG 100x32)
  const sparkPath = (vals) => {
    const data = (vals && vals.length ? vals : [0]).map(Number);
    const max = Math.max(...data, 1);
    const w = 100, h = 32, step = data.length > 1 ? w / (data.length - 1) : w;
    return data.map((v, i) => `${i===0? 'M': 'L'} ${i*step},${h - (v/max)*h}`).join(" ");
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<MdTrendingUp className="text-xl" />} title="Revenue" value={fmtINR(stats.revenueINR)}>
          <Sparkline values={revenueTrend} />
        </KpiCard>
        <KpiCard icon={<BsCart3 className="text-xl" />} title="Orders" value={stats.orders} />
        <KpiCard icon={<BiPackage className="text-xl" />} title="Products" value={stats.products} />
        <KpiCard icon={<AiOutlineStar className="text-xl" />} title="Avg Rating" value={`${(stats.avgRating||0).toFixed(1)} / 5`} />
      </div>

      {/* Two-column: Top products + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-1 bg-white rounded-lg border border-gray-500 shadow-sm">
          <header className="px-4 py-3 border-b border-gray-500 font-semibold">Top Products</header>
          <ul className="divide-y divide-gray-400">
            {topProducts.length === 0 && <li className="p-4 text-sm text-gray-500">No data</li>}
            {topProducts.map((p) => (
              <li key={p._id} className="p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer" onClick={() => onOpenProduct(p)}>
                <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-gray-500 truncate">{p.units} units • {fmtINR(p.salesINR)}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-2 bg-white rounded-lg border border-gray-500 shadow-sm overflow-hidden">
          <header className="px-4 py-3 border-b border-gray-400 font-semibold">Recent Orders</header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && (
                  <tr><td colSpan="5" className="py-8 text-center text-gray-500">No recent orders</td></tr>
                )}
                {recentOrders.map((o) => (
                  <tr key={o._id} className=" border-b border-gray-400 hover:bg-gray-50 ">
                    <td className="py-2 px-4 font-medium">{o.orderNumber || o._id}</td>
                    <td className="py-2 px-4">{fmtDate(o.createdAt)}</td>
                    <td className="py-2 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badgeForStatus(o.status)}`}>{o.status}</span>
                    </td>
                    <td className="py-2 px-4">{fmtINR(o.totalINR)}</td>
                    <td className="py-2 px-4"><button onClick={() => onOpenOrder(o)} className="px-2 py-1 border rounded text-xs">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Two-column: Reviews + Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 bg-white rounded-lg border border-gray-500 shadow-sm">
          <header className="px-4 py-3 border-b border-gray-400 font-semibold">Latest Reviews</header>
          <ul className="divide-y divide-gray-400">
            {recentReviews.length === 0 && <li className="p-4 text-sm text-gray-500">No reviews</li>}
            {recentReviews.map((r) => (
              <li key={r._id} className="p-4 flex items-start gap-3 hover:bg-gray-50 cursor-pointer" onClick={() => onOpenReview(r)}>
                <div className="mt-0.5 text-yellow-500">{"★".repeat(Math.round(r.rating || 0))}{"☆".repeat(5 - Math.round(r.rating || 0))}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.userName}</div>
                  <p className="text-sm text-gray-600 line-clamp-2">{r.comment}</p>
                  <div className="text-xs text-gray-500">{fmtDate(r.createdAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-1 bg-white rounded-lg border border-gray-500 shadow-sm">
          <header className="px-4 py-3 border-b border-gray-400 font-semibold">Upcoming Appointments</header>
          <ul className="divide-y divide-gray-400">
            {upcomingAppointments.length === 0 && <li className="p-4 text-sm text-gray-500">No upcoming</li>}
            {upcomingAppointments.map((a) => (
              <li key={a._id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => onOpenAppointment(a)}>
                <div className="font-medium truncate">{a.customerName}</div>
                <div className="text-xs text-gray-500">{a.serviceType} • {fmtDate(a.appointmentAt)}</div>
                <div className="mt-1"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badgeForAppt(a.status)}`}>{a.status}</span></div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );

  function badgeForStatus(s) {
    switch ((s||"").toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  function badgeForAppt(s) {
    switch ((s||"").toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }
}

function KpiCard({ icon, title, value, children }) {
  return (
    <div className="bg-white rounded-lg border border-gray-500 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">{title}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">{icon}</div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

function Sparkline({ values }) {
  const path = (values && values.length) ? values : [0];
  // reuse generator from main component for simplicity
  const data = path.map(Number);
  const max = Math.max(...data, 1);
  const w = 100, h = 32, step = data.length > 1 ? w / (data.length - 1) : w;
  const d = data.map((v, i) => `${i===0? 'M': 'L'} ${i*step},${h - (v/max)*h}`).join(" ");
  return (
    <svg width={w} height={h} className="w-full h-8">
      <path d={d} fill="none" stroke="currentColor" className="text-black" strokeWidth="2" />
    </svg>
  );
}

/*
Prop shapes (example):

<AdminOverview
  stats={{ revenueINR: 1900000, orders: 245, products: 128, avgRating: 4.6 }}
  revenueTrend={[12_000, 18_000, 9_500, 25_000, 30_000, 28_500, 34_000]}
  topProducts=[
    { _id:'p1', name:'Diamond Ring', image:'/img/r1.jpg', salesINR:75000, units:12 },
    { _id:'p2', name:'Pearl Necklace', image:'/img/n1.jpg', salesINR:54000, units:7 }
  ]
  recentOrders=[
    { _id:'o1', orderNumber:'GRV1001', createdAt:'2025-09-24T06:22:00Z', status:'processing', totalINR:115000 },
  ]
  recentReviews=[
    { _id:'r1', userName:'Rahul', rating:5, comment:'Excellent quality!', createdAt:'2025-09-25T10:00:00Z' }
  ]
  upcomingAppointments=[
    { _id:'a1', customerName:'Sneha', serviceType:'consultation', appointmentAt:'2025-09-27T15:30:00Z', status:'confirmed' }
  ]
/>
*/
