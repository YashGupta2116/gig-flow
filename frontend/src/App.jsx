import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./store/slices/authSlice";
import { useSocket } from "./hooks/useSocket";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import NotificationToast from "./components/NotificationToast";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useSocket();

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    dispatch(getMe()).finally(() => setIsChecking(false));
  }, [dispatch]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <NotificationToast />
      {user ? <Dashboard /> : <Auth />}
    </div>
  );
}

export default App;
