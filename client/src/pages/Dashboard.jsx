import React, { useEffect, useState } from "react";

import { MdTrendingUp } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { BsCart3 } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
import TabsNav from "../components/admin/TabsNav";
import Overview from "../components/DashboardSections/Overview";
import Products from "../components/DashboardSections/Products";
import Orders from "../components/DashboardSections/Orders";
import Reviews from "../components/DashboardSections/Reviews";

/**
 * This page wires everything:
 * - Replace mock endpoints with your real ones.
 * - The example uses useFetch for initial loads and sets state into local arrays.
 */

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
//   const { data: pData, loading: pLoading, refetch: refetchProducts } = useFetch(() => api.get("/products"), []);
//   const { data: oData, loading: oLoading, refetch: refetchOrders } = useFetch(() => api.get("/orders"), []);
//   const { data: rData, loading: rLoading, refetch: refetchReviews } = useFetch(() => api.get("/reviews"), []);

//   useEffect(() => {
//     // If backend not ready yet, fallback to local mock data
//     if (pData?.data) setProducts(pData.data);
//     if (oData?.data) setOrders(oData.data);
//     if (rData?.data) setReviews(rData.data);

//     // fallback: if your API returns directly the array (res.data vs res)
//     if (Array.isArray(pData)) setProducts(pData);
//     if (Array.isArray(oData)) setOrders(oData);
//     if (Array.isArray(rData)) setReviews(rData);
//   }, [pData, oData, rData]);

  // handlers call APIs then update local state
//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       await api.patch(`/orders/${orderId}`, { status: newStatus });
//       setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
//     } catch (err) {
//       console.error(err);
//       // show toast
//     }
//   };

//   const handleProductDelete = async (productId) => {
//     if (!window.confirm("Archive this product?")) return;
//     try {
//       await api.delete(`/products/${productId}`);
//       setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, status: "archived" } : p)));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleReviewApproval = async (reviewId, approve) => {
//     try {
//       await api.patch(`/reviews/${reviewId}`, { isApproved: approve });
//       setReviews((prev) => prev.map((r) => (r._id === reviewId ? { ...r, isApproved: approve } : r)));
//     } catch (err) {
//       console.error(err);
//     }
//   };

  const tabs = [
    { id: "overview", label: "Overview", icon: MdTrendingUp, component: <Overview products={products} orders={orders} reviews={reviews} /> },
    { id: "products", label: "Products", icon: BiPackage, component: <Products products={products} 
    // onDelete={handleProductDelete} 
    /> 
},
    { id: "orders", label: "Orders", icon: BsCart3, component: <Orders orders={orders}
    //  onStatusChange={handleStatusChange}
      /> },
    { id: "reviews", label: "Reviews", icon: AiOutlineStar, component: <Reviews reviews={reviews}
    //  onApprove={(id) => handleReviewApproval(id, true)} onReject={(id) => handleReviewApproval(id, false)}
      />
     },
  ];

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component ?? null;

//   const loading = pLoading || oLoading || rLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your e-commerce store</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* <main>{loading ? <div>Loading...</div> : ActiveComponent}</main> */}
      </div>
    </div>
  );
}
