import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchGigs, fetchMyGigs } from "../store/slices/gigSlice";
import { fetchMyBids } from "../store/slices/bidSlice";
import GigList from "./GigList";
import MyGigs from "./MyGigs";
import MyBids from "./MyBids";
import CreateGig from "./CreateGig";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGigs());
    dispatch(fetchMyGigs());
    dispatch(fetchMyBids());
  }, [dispatch]);

  const tabs = [
    { id: "browse", label: "Browse Gigs", component: GigList },
    { id: "my-gigs", label: "My Posted Gigs", component: MyGigs },
    { id: "my-bids", label: "My Bids", component: MyBids },
    { id: "create", label: "Post a Gig", component: CreateGig },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Component */}
      <div>{ActiveComponent && <ActiveComponent />}</div>
    </div>
  );
};

export default Dashboard;
