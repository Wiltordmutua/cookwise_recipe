import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Notifications() {
  const notifications = useQuery(api.users.getNotifications);
  const markAsRead = useMutation(api.users.markNotificationRead);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ notificationId: notificationId as any });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text hover:text-primary transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v3.5" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-container shadow-lg border border-accent z-50">
          <div className="p-4 border-b border-accent">
            <h3 className="font-semibold text-text">Notifications</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications === undefined ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-text/70">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-accent last:border-b-0 cursor-pointer hover:bg-secondary/20 ${
                    !notification.isRead ? "bg-secondary/10" : ""
                  }`}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <p className="text-sm text-text">{notification.message}</p>
                  <p className="text-xs text-text/50 mt-1">
                    {new Date(notification._creationTime).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
