import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigs } from "../store/slices/gigSlice";
import { Search, DollarSign, User, Clock } from "lucide-react";
import BidModal from "./BidModal";

const GigList = () => {
  const dispatch = useDispatch();
  const { gigs, loading } = useSelector((state) => state.gigs);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [selectedGig, setSelectedGig] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchGigs(search));
  };

  const handleBidClick = (gig) => {
    setSelectedGig(gig);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gigs by title or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>

      {/* Gigs Grid */}
      {gigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            No gigs found. Try adjusting your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {gig.title}
              </h3>
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
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{gig.ownerId?.name || "Anonymous"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {user?._id !== gig.ownerId?._id ? (
                <button
                  onClick={() => handleBidClick(gig)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Place Bid
                </button>
              ) : (
                <div className="w-full py-2 px-4 bg-gray-100 text-gray-500 rounded-md text-center text-sm">
                  Your Gig
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      {selectedGig && (
        <BidModal gig={selectedGig} onClose={() => setSelectedGig(null)} />
      )}
    </div>
  );
};

export default GigList;
