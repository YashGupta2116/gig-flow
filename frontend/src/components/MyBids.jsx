import React from "react";
import { useSelector } from "react-redux";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

const MyBids = () => {
  const { myBids } = useSelector((state) => state.bids);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "HIRED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "HIRED":
        return <CheckCircle className="h-5 w-5" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div>
      {myBids.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">You haven't placed any bids yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {bid.gigId?.title || "Gig Deleted"}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                      <span className="font-semibold text-green-600">
                        Your Bid: ${bid.price}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-600" />
                      <span>Budget: ${bid.gigId?.budget || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(
                    bid.status
                  )}`}
                >
                  {getStatusIcon(bid.status)}
                  <span className="text-sm font-semibold capitalize">
                    {bid.status}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4">{bid.message}</p>

              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  Submitted {new Date(bid.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;
