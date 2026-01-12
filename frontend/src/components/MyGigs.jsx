import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DollarSign, Clock, CheckCircle } from "lucide-react";
import BidListModal from "./BidListModal";

const MyGigs = () => {
  const { myGigs } = useSelector((state) => state.gigs);
  const [selectedGig, setSelectedGig] = useState(null);

  return (
    <div>
      {myGigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">You haven't posted any gigs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {gig.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    gig.status === "OPEN"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {gig.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {gig.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  <span className="font-semibold text-green-600">
                    ${gig.budget}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {gig.status === "OPEN" && (
                <button
                  onClick={() => setSelectedGig(gig)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  View Bids
                </button>
              )}

              {gig.status === "ASSIGNED" && (
                <div className="w-full py-2 px-4 bg-green-50 text-green-700 rounded-md text-center flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Assigned</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedGig && (
        <BidListModal gig={selectedGig} onClose={() => setSelectedGig(null)} />
      )}
    </div>
  );
};

export default MyGigs;
