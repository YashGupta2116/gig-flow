import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBidsForGig, hireBid } from "../store/slices/bidSlice";
import { X, DollarSign, User, MessageSquare } from "lucide-react";

const BidListModal = ({ gig, onClose }) => {
  const dispatch = useDispatch();
  const { bids } = useSelector((state) => state.bids);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBidsForGig(gig._id));
  }, [dispatch, gig._id]);

  const handleHire = async (bidId) => {
    if (window.confirm("Are you sure you want to hire this freelancer?")) {
      setLoading(true);
      try {
        await dispatch(hireBid(bidId)).unwrap();
        // Refresh the bids list to show updated status
        await dispatch(fetchBidsForGig(gig._id));
        alert("Freelancer hired successfully!");
        onClose();
      } catch (error) {
        const errorMessage =
          typeof error === "string"
            ? error
            : error?.message || error?.error || "Failed to hire freelancer";
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bids for: {gig.title}
        </h2>
        <p className="text-gray-600 mb-6">Budget: ${gig.budget}</p>
        {bids.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No bids received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className={`border rounded-lg p-4 ${
                  bid.status === "HIRED"
                    ? "border-green-500 bg-green-50"
                    : bid.status === "REJECTED"
                    ? "border-gray-300 bg-gray-50 opacity-60"
                    : "border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      {bid.freelancerId?.name || "Anonymous"}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      bid.status === "HIRED"
                        ? "bg-green-100 text-green-800"
                        : bid.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                  <span className="font-semibold text-green-600">
                    ${bid.price}
                  </span>
                </div>

                <div className="flex items-start text-sm text-gray-700 mb-4">
                  <MessageSquare className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{bid.message}</p>
                </div>

                {bid.status === "PENDING" && gig.status === "OPEN" && (
                  <button
                    onClick={() => handleHire(bid._id)}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
                  >
                    {loading ? "Hiring..." : "Hire This Freelancer"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default BidListModal;
