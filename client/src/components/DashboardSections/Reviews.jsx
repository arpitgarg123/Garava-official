import React from "react";
import { AiFillStar } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdCheckCircle, MdCancel } from "react-icons/md";

export default function Reviews({ reviews = [], onApprove = () => {}, onReject = () => {} }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{review.user?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{review.product?.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">{Array.from({ length: 5 }).map((_, i) => <AiFillStar key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} />)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs"><div className="text-sm font-medium text-gray-900 truncate">{review.title}</div><div className="text-sm text-gray-500 truncate">{review.body}</div></div>
                  </td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${review.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{review.isApproved ? "Approved" : "Pending"}</span></td>
                  <td className="px-6 py-4">{review.verifiedPurchase && <BsCheckCircleFill className="h-4 w-4 text-green-500" />}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {!review.isApproved && <button className="text-green-600 hover:text-green-900" onClick={() => onApprove(review._id)}><MdCheckCircle className="h-4 w-4" /></button>}
                      <button className="text-red-600 hover:text-red-900" onClick={() => onReject(review._id)}><MdCancel className="h-4 w-4" /></button>
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
