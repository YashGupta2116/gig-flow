import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createBid } from "../store/slices/bidSlice";
import { X } from "lucide-react";

const BidModal = ({ gig, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    message: "",
    price: gig.budget,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await dispatch(
        createBid({
          gigId: gig._id,
          message: formData.message,
          price: formData.price,
        })
      ).unwrap();
      onClose();
    } catch (err) {
      setError(err?.message || err || "Failed to create bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Place a Bid</h2>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900">{gig.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Budget: ${gig.budget}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Proposal
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={4}
              placeholder="Explain why you're the best fit for this job..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Bid Amount ($)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Bid"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidModal;
