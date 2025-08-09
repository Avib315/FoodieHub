import React, { useState } from 'react';
import './style.scss';
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import { notificationTypes } from '../../data/notificationTypes';
import useUserStore from '../../store/userStore';
export default function NotificationPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user, setUser } = useUserStore()
  const { data, setData } = useAxiosRequest({
    url: '/notification/getAll',
    method: 'get',
    defaultValue: []
  });

  // מה שקורל עשתה -------------------------------------
  async function markAsRead(ids) {
    const body = { notificationIds: ids }
    const res = await axiosRequest({ url: "/notification/markAsRead", method: "PUT", body: body })
    console.log(res)
  }

  async function removeNotification(id) {
    const res = await axiosRequest({ url: `/notification/delete/${id}`, method: "DELETE" })
    console.log(res)
  }
  // מה שקורל עשתה -------------------------------------




  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create dynamic filter counts based on notificationTypes
  const filterCounts = {
    all: data.length,
    ...notificationTypes.reduce((acc, type) => {
      acc[type.serverName] = data.filter(n => n.type === type.serverName).length;
      return acc;
    }, {})
  };

  const filteredNotifications = activeFilter === 'all'
    ? data
    : data.filter(n => n.type === activeFilter);

  const markAllAsRead = async () => {
    try {
      // Update local state immediately for better UX
      const updatedData = data.map(notification => ({
        ...notification,
        isRead: true
      }));
      setData(updatedData);
      setUser({ ...user, notification: 0 })
      const allIds = data.map(notification => notification._id);
      await markAsRead(allIds);

      console.log('Mark all as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead([notification._id]);
      
      setUser({ ...user, notification: user.notification - 1 })
      const updatedData = data.map(n =>
        n._id === notification._id ? { ...n, isRead: true } : n
      );
      setData(updatedData);
    }


  };

  const deleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    await removeNotification(notificationId);
    console.log('Notification deleted:');
    const updatedData = data.filter(n => n._id !== notificationId);
    setData(updatedData);
  };


  const getNotificationIcon = (type) => {
    const icons = {
      recipe_rated: '⭐',
      recipe_commented: '💬',
      recipe_approved: '✅',
      recipe_rejected: '❌',
      system: '🔔'
    };
    return icons[type] || '🔔';
  };

  const getTypeDisplayName = (type) => {
    const typeConfig = notificationTypes.find(t => t.serverName === type);
    return typeConfig ? typeConfig.title : type;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'עכשיו' : `לפני ${diffInMinutes} דקות`;
    } else if (diffInHours < 24) {
      return `לפני ${diffInHours} שעות`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `לפני ${diffInDays} ימים`;
    }
  };

  const unreadCount = data.filter(n => !n.isRead).length;

  return (
    <div className="notification-page">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>
              🔔 התראות
              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </h1>
            <p>עדכונים ופעילות אחרונה</p>
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-read" onClick={markAllAsRead}>
              סמן הכל כנקרא
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          הכל ({filterCounts.all})
        </button>
        {Object.entries(filterCounts).map(([type, count]) => {
          if (type === 'all' || count === 0) return null;
          return (
            <button
              key={type}
              className={`filter-tab ${activeFilter === type ? 'active' : ''}`}
              onClick={() => setActiveFilter(type)}
            >
              {getTypeDisplayName(type)} ({count})
            </button>
          );
        })}
      </div>

      {/* Notifications Container */}
      <div className="notifications-container">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>אין התראות</h3>
            <p>
              {activeFilter === 'all'
                ? 'כל ההתראות שלך יופיעו כאן'
                : `אין התראות מסוג ${getTypeDisplayName(activeFilter)}`
              }
            </p>
          </div>
        ) : (
          filteredNotifications?.reverse()?.map((notification, index) => (
            <div
              key={notification._id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="notification-header">
                <div className={`notification-icon ${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    {notification.title}
                    {!notification.isRead && <span className="new-badge">חדש</span>}
                  </div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-meta">
                    <div className="notification-time">
                      <span className="time-icon">🕒</span>
                      <span>{formatTime(notification.createdAt)}</span>
                    </div>
                    <div className="notification-type-badge">
                      {getTypeDisplayName(notification.type)}
                    </div>
                  </div>
                </div>
                <div className="notification-actions">
                  <button
                    className="action-btn delete-btn"
                    onClick={(e) => deleteNotification(notification._id, e)}
                    title="מחק התראה"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}