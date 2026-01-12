import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addNotification } from "../store/slices/notificationSlice";

let socket;

export const useSocket = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
        withCredentials: true,
      });

      socket.emit("join", user._id);

      socket.on("hired", (data) => {
        dispatch(
          addNotification({
            id: Date.now(),
            type: "success",
            message: data.message,
            gig: data.gig,
          })
        );

        if (Notification.permission === "granted") {
          new Notification("You've been hired!", {
            body: data.message,
            icon: "/logo.png",
          });
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, dispatch]);

  return socket;
};
