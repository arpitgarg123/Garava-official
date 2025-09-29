import React, { useMemo, useState } from "react";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineEye, AiFillStar } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import ProductDetails from "../../pages/products/ProductDetails";
// import { formatCurrency as _formatCurrency } from "../utils/format"; // small util (optional)

function formatCurrency(rupees) {
  return `₹${Number(rupees).toLocaleString("en-IN")}`;
}
function getStatusColor(status) {
  const colors = {
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-red-100 text-red-800",
    in_stock: "bg-green-100 text-green-800",
    low_stock: "bg-yellow-100 text-yellow-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export default function Products({ products = [], onDelete = () => {} }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate  = useNavigate()

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const s = searchTerm.trim().toLowerCase();
        const matchesSearch = !s || p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s);
        const matchesStatus = selectedStatus === "all" ? true : p.status === selectedStatus;
        return matchesSearch && matchesStatus;
      }),
    [products, searchTerm, selectedStatus]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between  h-12 items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button className="bg-black hover:bg-white hover:text-black hover:border text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <AiOutlinePlus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className=" p-4 rounded-lg shadow-sm border ">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {/* {product.name } */}
prods1
                      </div>
                      <div className="text-sm text-gray-500">{product.slug}  slug</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.category} categ</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.variants?.[0]?.stockStatus)}`}>
                      {product.variants?.[0]?.stock ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(product.variants?.[0]?.price ?? 0)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>{product.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <AiFillStar className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-500">{product.avgRating} ({product.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={
                      <ProductDetails />
                      } className="text-blue-600 hover:text-blue-900"><AiOutlineEye className="h-4 w-4" /></button>
                      <button className="text-indigo-600 hover:text-indigo-900"><FiEdit className="h-4 w-4" /></button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => onDelete(product._id)}><RiDeleteBin6Line className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
