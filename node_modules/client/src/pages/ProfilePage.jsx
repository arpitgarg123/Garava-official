// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getMeApi, updateMeApi, changePasswordApi } from "../features/user/api.js";
// import { resendVerificationApi } from "../features/auth/api.js";
// import { setUser, doLogout } from "../features/auth/slice.js";
// import { fetchUserOrders } from "../features/order/slice.js";
// import { selectUserOrders, selectIsOrdersLoading } from "../features/order/selectors.js";
// import { fetchAddresses } from "../features/address/slice.js";
// import { selectAddresses, selectIsAddressLoading } from "../features/address/selectors.js";
// import { useNavigate } from "react-router-dom";
// import WishlistContent from "../components/WishlistContent.jsx";
// import AddressSelector from "../components/AddressSelector.jsx";
// import BackButton from "../components/BackButton.jsx";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const authUser = useSelector((s) => s.auth?.user);
//   const userOrders = useSelector(selectUserOrders);
//   const isOrdersLoading = useSelector(selectIsOrdersLoading);
//   const addresses = useSelector(selectAddresses);
//   const isAddressLoading = useSelector(selectIsAddressLoading);
//   const [activeTab, setActiveTab] = useState("profile");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [pwdSaving, setPwdSaving] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [pwdMsg, setPwdMsg] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [form, setForm] = useState({
//     name: authUser?.name || "",
//     email: authUser?.email || "",
//     phone: authUser?.phone || "",
//     isVerified: authUser?.isVerified || false,
//   });

//   const tabs = [
//     { id: "profile", label: "Profile", icon: "👤" },
//     { id: "orders", label: "Orders", icon: "📦" },
//     { id: "addresses", label: "Addresses", icon: "📍" },
//     { id: "wishlist", label: "Wishlist", icon: "❤️" },
//     { id: "security", label: "Security", icon: "🔒" },
//   ];

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const { data } = await getMeApi();
//         if (!mounted) return;
        
//         const userData = data?.user || data;
        
//         setForm({
//           name: userData?.name || "",
//           email: userData?.email || "",
//           phone: userData?.phone || "",
//           isVerified: !!userData?.isVerified,
//         });
//         dispatch(setUser(userData));
//       } catch (e) {
//         console.error("Failed to load profile:", e);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [dispatch]);

//   // Fetch orders and addresses when component mounts
//   useEffect(() => {
//     if (authUser) {
//       dispatch(fetchUserOrders());
//       dispatch(fetchAddresses());
//     }
//   }, [dispatch, authUser]);

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const onSave = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setMsg("");
//     try {
//       const payload = { name: form.name.trim(), phone: form.phone.trim() };
//       const { data } = await updateMeApi(payload);
      
//       const userData = data?.user || data;
      
//       dispatch(setUser(userData));
//       setMsg("Profile updated successfully.");
//     } catch (e) {
//       console.error("Failed to update profile:", e);
//       setMsg(e?.response?.data?.message || "Failed to update profile.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const onResend = async () => {
//     setMsg("");
//     try {
//       await resendVerificationApi({ email: form.email });
//       setMsg("Verification email sent successfully.");
//     } catch (e) {
//       setMsg(e?.response?.data?.message || "Failed to send verification email.");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await dispatch(doLogout()).unwrap();
//       navigate("/login");
//     } catch (e) {
//       console.error("Logout failed:", e);
//       // Still redirect even if logout API fails
//       navigate("/login");
//     }
//   };

//   const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
//   const onPwdChange = (e) => {
//     const { name, value } = e.target;
//     setPwdForm((f) => ({ ...f, [name]: value }));
//   };

//   const onChangePassword = async (e) => {
//     e.preventDefault();
//     setPwdMsg("");
//     if (pwdForm.newPassword !== pwdForm.confirm) {
//       setPwdMsg("Passwords do not match.");
//       return;
//     }
//     setPwdSaving(true);
//     try {
//       await changePasswordApi({ 
//         oldPassword: pwdForm.currentPassword, 
//         newPassword: pwdForm.newPassword 
//       });
//       setPwdMsg("Password changed successfully.");
//       setPwdForm({ currentPassword: "", newPassword: "", confirm: "" });
//     } catch (e) {
//       setPwdMsg(e?.response?.data?.message || "Failed to change password.");
//     } finally {
//       setPwdSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//      <div className="min-h-screen bg-gray-50 py-8 mt-30">
//         <div className="max-w-6xl mx-auto px-4">
//        <div className="space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white rounded-lg  p-6 animate-pulse">
//                 <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const renderContent = () => {
//     switch (activeTab) {
//       case "profile":
//         return (
//           <div className="bg-white rounded-lg  border h-fit border-gray-300 p-4 sm:p-6">
//             <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
//             <form onSubmit={onSave} className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                   <input
//                     name="name"
//                     type="text"
//                     value={form.name}
//                     onChange={onChange}
//                     className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
//                     placeholder="Enter your full name"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                   <input
//                     name="email"
//                     type="email"
//                     value={form.email}
//                     className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 cursor-not-allowed text-sm sm:text-base"
//                     placeholder="Email address"
//                     disabled
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                   <input
//                     name="phone"
//                     type="tel"
//                     value={form.phone}
//                     onChange={onChange}
//                     className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
//                     placeholder="Enter your phone number"
//                     pattern="^[0-9+\-\s()]{7,}$"
//                     title="Enter a valid phone number"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Email Verification</label>
//                   <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
//                       form.isVerified 
//                         ? "bg-green-100 text-green-800" 
//                         : "bg-orange-100 text-orange-800"
//                     }`}>
//                       {form.isVerified ? "✓ Verified" : "⚠ Not Verified"}
//                     </span>
//                     {!form.isVerified && (
//                       <button
//                         type="button"
//                         onClick={onResend}
//                         className="text-xs sm:text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50 transition w-fit"
//                       >
//                         Resend
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 text-sm sm:text-base"
//                   disabled={saving}
//                 >
//                   {saving ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>

//               {msg && (
//                 <div className={`p-4 rounded-lg text-sm ${
//                   msg.includes("Failed") || msg.includes("Failed") 
//                     ? "bg-red-50 text-red-800 border border-red-200" 
//                     : "bg-green-50 text-green-800 border border-green-200"
//                 }`}>
//                   {msg}
//                 </div>
//               )}
//             </form>
//           </div>
//         );

//       case "security":
//         return (
//           <div className="bg-white rounded-lg  border p-4 sm:p-6">
//             <h2 className="text-xl font-semibold mb-6">Change Password</h2>
//             <form onSubmit={onChangePassword} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
//                 <input
//                   name="currentPassword"
//                   type="password"
//                   value={pwdForm.currentPassword}
//                   onChange={onPwdChange}
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
//                   placeholder="Enter current password"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
//                   <input
//                     name="newPassword"
//                     type="password"
//                     value={pwdForm.newPassword}
//                     onChange={onPwdChange}
//                     className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
//                     placeholder="Enter new password"
//                     minLength={8}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
//                   <input
//                     name="confirm"
//                     type="password"
//                     value={pwdForm.confirm}
//                     onChange={onPwdChange}
//                     className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
//                     placeholder="Confirm new password"
//                     minLength={8}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 text-sm sm:text-base"
//                   disabled={pwdSaving}
//                 >
//                   {pwdSaving ? "Updating..." : "Update Password"}
//                 </button>
//               </div>
//               {pwdMsg && (
//                 <div className={`p-4 rounded-lg text-sm ${
//                   pwdMsg.includes("Failed") 
//                     ? "bg-red-50 text-red-800 border border-red-200" 
//                     : "bg-green-50 text-green-800 border border-green-200"
//                 }`}>
//                   {pwdMsg}
//                 </div>
//               )}
//             </form>
//           </div>
//         );

//       case "orders":
//         return (
//           <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
//             <h2 className="text-xl font-semibold mb-6">Order History</h2>
//             {isOrdersLoading ? (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
//                 <p className="mt-4 text-gray-500">Loading orders...</p>
//               </div>
//             ) : userOrders && userOrders.length > 0 ? (
//               <div className="space-y-4">
//                 {userOrders.map((order) => (
//                   <div key={order._id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <h3 className="font-medium">Order #{order.orderNumber}</h3>
//                         <p className="text-sm text-gray-500">
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-medium">
//                           ₹{(order.grandTotal || 0).toLocaleString('en-IN')}
//                         </p>
//                         <span className={`inline-block px-2 py-1 rounded-full text-xs ${
//                           order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                           order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
//                           order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
//                           order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {order.status}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="border-t pt-3">
//                       <p className="text-sm text-gray-600 mb-2">
//                         {order.items?.length || 0} item(s)
//                       </p>
//                       <div className="flex justify-between items-center">
//                         <div className="text-sm text-gray-600">
//                           Payment: {order.payment?.method || 'N/A'} • 
//                           Status: {order.payment?.status || 'N/A'}
//                         </div>
//                         <button 
//                           onClick={() => navigate(`/orders/${order._id}`)}
//                           className="text-sm text-blue-600 hover:text-blue-700"
//                         >
//                           View Details →
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-gray-500">
//                 <div className="text-4xl mb-4">📦</div>
//                 <p className="text-sm sm:text-base">No orders found. Start shopping to see your orders here.</p>
//               </div>
//             )}
//           </div>
//         );

//       case "addresses":
//         return (
//           <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
//             {isAddressLoading ? (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
//                 <p className="mt-4 text-gray-500">Loading addresses...</p>
//               </div>
//             ) : (
//               <AddressSelector 
//                 selectedAddressId={null}
//                 onAddressSelect={() => {}}
//                 onAddressChange={() => {}}
//                 showAsManagement={true}
//               />
//             )}
//           </div>
//         );

//       case "wishlist":
//         return (
//           <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">My Wishlist</h2>
//               <button 
            
//                 className="text-sm text-gray-600 hover:text-black"
//               >
//                 View Full Page →
//               </button>
//             </div>
//             <WishlistContent compact={true} maxItems={4} />
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//      <div className="sticky top-30 z-10 mb-3">
//         <BackButton />
//       </div>
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-30">

//       <div className="mb-6 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
//         <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your profile and preferences</p>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
//         {/* Mobile Menu Button */}
//         <div className="lg:hidden">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="w-full bg-white border rounded-lg p-4 flex items-center justify-between"
//           >
//             <span className="font-medium">
//               {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}
//             </span>
//             <span className="text-lg">{sidebarOpen ? "−" : "+"}</span>
//           </button>
//         </div>

//         {/* Sidebar - Hidden on mobile unless sidebarOpen */}
//         <div className={`w-full lg:w-64 lg:flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
//           <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
//             {/* User Info */}
//             <div className="text-center mb-6 pb-6 border-b">
//               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-semibold mx-auto mb-3">
//                 {form.name?.charAt(0)?.toUpperCase() || "U"}
//               </div>
//               <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{form.name || "User"}</h3>
//               <p className="text-xs sm:text-sm text-gray-600">{form.email}</p>
//             </div>

//             {/* Navigation */}
//             <nav className="space-y-2">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => {
//                     setActiveTab(tab.id);
//                     setSidebarOpen(false); // Close mobile menu after selection
//                   }}
//                   className={`w-full cursor-pointer flex items-center gap-3 p-3 rounded-lg text-left transition text-sm sm:text-base ${
//                     activeTab === tab.id
//                       ? "bg-black text-white"
//                       : "text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   <span className="text-base sm:text-lg">{tab.icon}</span>
//                   <span className="font-medium">{tab.label}</span>
//                 </button>
//               ))}
//             </nav>

//             {/* Logout Button */}
//             <div className="mt-6 pt-6 border-t">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer text-left transition text-sm sm:text-base text-red-600 hover:bg-red-50"
//               >
//                 <span className="text-base sm:text-lg">🚪</span>
//                 <span className="font-medium">Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 min-w-0 items-start justify-start">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default ProfilePage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMeApi, updateMeApi, changePasswordApi } from "../features/user/api.js";
import { resendVerificationApi } from "../features/auth/api.js";
import { setUser, doLogout } from "../features/auth/slice.js";
import { fetchUserOrders } from "../features/order/slice.js";
import { selectUserOrders, selectIsOrdersLoading } from "../features/order/selectors.js";
import { fetchAddresses } from "../features/address/slice.js";
import { selectAddresses, selectIsAddressLoading } from "../features/address/selectors.js";
import { useNavigate } from "react-router-dom";
import WishlistContent from "../components/WishlistContent.jsx";
import AddressSelector from "../components/AddressSelector.jsx";
import BackButton from "../components/BackButton.jsx";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((s) => s.auth?.user);
  const userOrders = useSelector(selectUserOrders);
  const isOrdersLoading = useSelector(selectIsOrdersLoading);
  const addresses = useSelector(selectAddresses);
  const isAddressLoading = useSelector(selectIsAddressLoading);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    isVerified: authUser?.isVerified || false,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "addresses", label: "Addresses", icon: "📍" },
    { id: "wishlist", label: "Wishlist", icon: "❤️" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await getMeApi();
        if (!mounted) return;
        
        const userData = data?.user || data;
        
        setForm({
          name: userData?.name || "",
          email: userData?.email || "",
          phone: userData?.phone || "",
          isVerified: !!userData?.isVerified,
        });
        dispatch(setUser(userData));
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [dispatch]);

  // Fetch orders and addresses when component mounts
  useEffect(() => {
    if (authUser) {
      dispatch(fetchUserOrders());
      dispatch(fetchAddresses());
    }
  }, [dispatch, authUser]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const payload = { name: form.name.trim(), phone: form.phone.trim() };
      const { data } = await updateMeApi(payload);
      
      const userData = data?.user || data;
      
      dispatch(setUser(userData));
      setMsg("Profile updated successfully.");
    } catch (e) {
      console.error("Failed to update profile:", e);
      setMsg(e?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const onResend = async () => {
    setMsg("");
    try {
      await resendVerificationApi({ email: form.email });
      setMsg("Verification email sent successfully.");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed to send verification email.");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(doLogout()).unwrap();
      navigate("/login");
    } catch (e) {
      console.error("Logout failed:", e);
      // Still redirect even if logout API fails
      navigate("/login");
    }
  };

  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const onPwdChange = (e) => {
    const { name, value } = e.target;
    setPwdForm((f) => ({ ...f, [name]: value }));
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    if (pwdForm.newPassword !== pwdForm.confirm) {
      setPwdMsg("Passwords do not match.");
      return;
    }
    setPwdSaving(true);
    try {
      await changePasswordApi({ 
        oldPassword: pwdForm.currentPassword, 
        newPassword: pwdForm.newPassword 
      });
      setPwdMsg("Password changed successfully.");
      setPwdForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e) {
      setPwdMsg(e?.response?.data?.message || "Failed to change password.");
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) {
    return (
     <div className="min-h-screen  py-8 mt-30">
        <div className="max-w-6xl mx-auto px-4">
       <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <form onSubmit={onSave} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 cursor-not-allowed text-sm sm:text-base"
                    placeholder="Email address"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter your phone number"
                    pattern="^[0-9+\-\s()]{7,}$"
                    title="Enter a valid phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Verification</label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      form.isVerified 
                        ? "bg-green-100 text-green-800" 
                        : "bg-orange-100 text-orange-800"
                    }`}>
                      {form.isVerified ? "✓ Verified" : "⚠ Not Verified"}
                    </span>
                    {!form.isVerified && (
                      <button
                        type="button"
                        onClick={onResend}
                        className="text-xs sm:text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50 transition w-fit"
                      >
                        Resend
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 text-sm sm:text-base"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {msg && (
                <div className={`p-4 rounded-lg text-sm ${
                  msg.includes("Failed") || msg.includes("Failed") 
                    ? "bg-red-50 text-red-800 border border-red-200" 
                    : "bg-green-50 text-green-800 border border-green-200"
                }`}>
                  {msg}
                </div>
              )}
            </form>
          </div>
        );

      case "security":
        return (
          <div className=" border border-gray-300 p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={onChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  name="currentPassword"
                  type="password"
                  value={pwdForm.currentPassword}
                  onChange={onPwdChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    name="newPassword"
                    type="password"
                    value={pwdForm.newPassword}
                    onChange={onPwdChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter new password"
                    minLength={8}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    name="confirm"
                    type="password"
                    value={pwdForm.confirm}
                    onChange={onPwdChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                    placeholder="Confirm new password"
                    minLength={8}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-black"
                  disabled={pwdSaving}
                >
                  {pwdSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
              {pwdMsg && (
                <div className={`p-4 rounded-lg text-sm ${
                  pwdMsg.includes("Failed") 
                    ? "bg-red-50 text-red-800 border border-red-200" 
                    : "bg-green-50 text-green-800 border border-green-200"
                }`}>
                  {pwdMsg}
                </div>
              )}
            </form>
          </div>
        );

      case "orders":
        return (
          <div className=" p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-6">Order History</h2>
            {isOrdersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-1 border-gray-100 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading orders...</p>
              </div>
            ) : userOrders && userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order._id} className="border border-gray-300 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{(order.grandTotal || 0).toLocaleString('en-IN')}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        {order.items?.length || 0} item(s)
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Payment: {order.payment?.method || 'N/A'} • 
                          Status: {order.payment?.status || 'N/A'}
                        </div>
                        <button 
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-sm sm:text-base">No orders found. Start shopping to see your orders here.</p>
              </div>
            )}
          </div>
        );

      case "addresses":
        return (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            {isAddressLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-1  border-gray-100 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading addresses...</p>
              </div>
            ) : (
              <AddressSelector 
                selectedAddressId={null}
                onAddressSelect={() => {}}
                onAddressChange={() => {}}
                showAsManagement={true}
              />
            )}
          </div>
        );

      case "wishlist":
        return (
          <div className="border border-gray-300 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Wishlist</h2>
              <button 
                onClick={() => navigate('/wishlist')}
                className="text-sm text-gray-600 hover:text-black"
              >
                View Full Page →
              </button>
            </div>
            <WishlistContent compact={true} maxItems={4} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen mt-26">
      <div className="sticky top-26 z-10 p">
          <BackButton />
       
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 pt-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your profile and preferences</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between "
            >
              <span className="font-medium">
                {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}
              </span>
              <span className="text-lg">{sidebarOpen ? "−" : "+"}</span>
            </button>
          </div>

          {/* Sidebar - Fixed width and self-start for proper alignment */}
          <div className={`lg:col-span-1 ${sidebarOpen ? 'block' : 'hidden lg:block'} mb-4 lg:mb-0`}>
            <div className="bg-white rounded-lg  border border-gray-300 p-4 sm:p-6 lg:sticky lg:top-24">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-semibold mx-auto mb-3">
                  {form.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{form.name || "User"}</h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{form.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false); // Close mobile menu after selection
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition text-sm sm:text-base ${
                      activeTab === tab.id
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base sm:text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition text-sm sm:text-base text-red-600 hover:bg-red-50"
                >
                  <span className="text-base sm:text-lg">🚪</span>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Takes remaining 3 columns */}
          <div className="lg:col-span-3 ">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;