import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearNotifications } from "../store/slices/notificationSlice";
import { CheckCircle, X } from "lucide-react";

const NotificationToast = () => {
  const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const latestNotification = notifications[0];

  useEffect(() => {
    if (latestNotification) {
      const timer = setTimeout(() => {
        dispatch(clearNotifications());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [latestNotification, dispatch]);

  if (!latestNotification) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-lg shadow-2xl p-4 max-w-md border-l-4 border-green-500">
        <div className="flex items-start">
          <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 mb-1">
              🎉 Congratulations!
            </p>
            <p className="text-sm text-gray-700">
              {latestNotification.message}
            </p>
            {latestNotification.gig && (
              <p className="text-xs text-gray-500 mt-1">
                Budget: ${latestNotification.gig.budget}
              </p>
            )}
          </div>
          <button
            onClick={() => dispatch(clearNotifications())}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
