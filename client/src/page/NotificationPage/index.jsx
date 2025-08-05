import React, { useState } from 'react';
import './style.scss';
import useAxiosRequest from '../../services/useApiRequest';
export default function NotificationPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'likes',
      title: 'המתכון שלך קיבל לייקים!',
      message: 'המתכון "עוגת שוקולד עשירה" קיבל 15 לייקים חדשים',
      time: '2 דקות',
      isRead: false,
      recipeName: 'עוגת שוקולד עשירה',
      recipeStats: '15 לייקים • 3 תגובות'
    },
    {
      id: 2,
      type: 'follows',
      title: 'מישהו החל לעקוב אחריך',
      message: 'שרה כהן החלה לעקוב אחר המתכונים שלך',
      time: '10 דקות',
      isRead: false
    },
    {
      id: 3,
      type: 'recipes',
      title: 'מתכון חדש מרותם לוי',
      message: 'רותם לוי שאתה עוקב אחריה פרסמה מתכון חדש',
      time: '30 דקות',
      isRead: false,
      recipeName: 'סלט קיצי רענן',
      recipeStats: '8 לייקים • 2 תגובות'
    },
    {
      id: 4,
      type: 'comments',
      title: 'תגובה חדשה על המתכון שלך',
      message: 'דני מזרחי הגיב על המתכון "פסטה ברוטב עגבניות"',
      time: '1 שעה',
      isRead: true,
      recipeName: 'פסטה ברוטב עגבניות',
      recipeStats: '23 לייקים • 7 תגובות'
    },
    {
      id: 5,
      type: 'likes',
      title: 'המתכון שלך פופולרי!',
      message: 'המתכון "מרק עדשים חם" קיבל 42 לייקים ב-24 השעות האחרונות',
      time: '2 שעות',
      isRead: true,
      recipeName: 'מרק עדשים חם',
      recipeStats: '42 לייקים • 12 תגובות'
    },
    {
      id: 6,
      type: 'follows',
      title: 'עוקב חדש',
      message: 'אבי רוזן החל לעקוב אחר המתכונים שלך',
      time: '4 שעות',
      isRead: true
    },
    {
      id: 7,
      type: 'recipes',
      title: 'מתכון חדש מיעל דוד',
      message: 'יעל דוד שאתה עוקב אחריה פרסמה מתכון חדש',
      time: '6 שעות',
      isRead: true,
      recipeName: 'עוגיות שוקולד צ\'יפס',
      recipeStats: '31 לייקים • 9 תגובות'
    },
    {
      id: 8,
      type: 'likes',
      title: 'לייק חדש!',
      message: 'מיכל אברמס אהבה את המתכון "סלט אבוקדו"',
      time: '8 שעות',
      isRead: true,
      recipeName: 'סלט אבוקדו',
      recipeStats: '18 לייקים • 4 תגובות'
    }
  ];

  const filterCounts = {
    all: notifications.length,
    likes: notifications.filter(n => n.type === 'likes').length,
    follows: notifications.filter(n => n.type === 'follows').length,
    recipes: notifications.filter(n => n.type === 'recipes').length,
    comments: notifications.filter(n => n.type === 'comments').length
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const markAllAsRead = () => {
    // Handle mark all as read logic
    console.log('Mark all as read');
  };
  const {data , setData} = useAxiosRequest({url: '/notification/getAll', method: 'get', defaultValue: []});
  console.log(data);
  
  const handleNotificationClick = (notification) => {
    // Handle notification click
    console.log('Notification clicked:', notification);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      likes: '❤️',
      follows: '👤',
      recipes: '🍳',
      comments: '💬',
      system: '⚙️'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="notification-page">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>🔔 התראות</h1>
            <p>עדכונים ופעילות אחרונה</p>
          </div>
          <button className="mark-all-read" onClick={markAllAsRead}>
            סמן הכל כנקרא
          </button>
        </div>
      </div>


      {/* Notifications Container */}
      <div className="notifications-container">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>אין התראות</h3>
            <p>כל ההתראות שלך יופיעו כאן</p>
          </div>
        ) : (
          data.map((notification, index) => (
            <div 
              key={notification._id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="notification-header">
                <div className={`notification-icon ${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    {notification.title}
                  </div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-meta">
                    <div className="notification-time">
                      <span>🕒</span>
                      <span>{notification.time}</span>
                    </div>
                    {!isMobile && (
                      <div className="notification-actions">
                        <button className="action-btn" title="הצג">👁️</button>
                        <button className="action-btn" title="מחק">🗑️</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {notification.recipeName && (
                <div className="recipe-preview">
                  <div className="recipe-image">
                    🍳
                  </div>
                  <div className="recipe-info">
                    <div className="recipe-name">{notification.recipeName}</div>
                    <div className="recipe-stats">{notification.recipeStats}</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}