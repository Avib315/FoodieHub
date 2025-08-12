import React, { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import './style.scss'
import useAdminAuth from '../../store/useAdminAuth';

export default function AdminPage() {
  const { data, loading, error } = useAxiosRequest({
    url: `/adminLog/getAll`,
    method: "GET",
    defaultValue: []
  });
  const { adminLogout } = useAdminAuth()
  const navigate = useNavigate();

  // Function to get Hebrew text and icon for each action
  const getLogDetails = (action) => {
    const logTypes = {
      recipe_approved: {
        text: 'מתכון אושר',
        icon: '✅',
        color: 'success'
      },
      recipe_rejected: {
        text: 'מתכון נדחה',
        icon: '❌',
        color: 'danger'
      },
      recipe_deleted: {
        text: 'מתכון נמחק',
        icon: '🗑️',
        color: 'danger'
      },
      user_blocked: {
        text: 'משתמש נחסם',
        icon: '🚫',
        color: 'warning'
      },
      user_unblocked: {
        text: 'משתמש שוחרר מחסימה',
        icon: '🔓',
        color: 'info'
      }
    };

    return logTypes[action] || {
      text: action,
      icon: '📝',
      color: 'default'
    };
  };

  // Format date to Hebrew
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Jerusalem'
    };

    return new Intl.DateTimeFormat('he-IL', options).format(date);
  };

  // Group logs by date for better organization
  const groupedLogs = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return {};

    return data.reduce((groups, log) => {
      const date = new Date(log.createdAt || log.date || Date.now());
      const dateKey = date.toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(log);
      return groups;
    }, {});
  }, [data]);

  const handleLogout = async () => {
    const res = await axiosRequest({
      url: '/user/logout',
      method: 'POST'
    });

    if (res.success === false) {
      alert("בעיה בהתנתקות")
    }
    else {
      adminLogout()
      navigate('/admin-login');
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>טוען נתוני מנהל...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>שגיאה בטעינת הנתונים</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <button onClick={handleLogout} className="logout-btn">
          🚪 התנתק
        </button>
        <div className="admin-title">   {/*הוספתי כאן div כדי לעזור לcss של הכתפור התנתקות, לא עשיתי css*/}
          <h1>פאנל ניהול</h1>
          <p>ברוך הבא למערכת ניהול האתר</p>
        </div>
      </div>
      <div className="admin-content">
        {/* Action Buttons */}
        <div className="admin-actions">
          <h2>פעולות ניהול</h2>
          <div className="actions-grid">
            <Link to="/admin-users-panel" className="action-card users">
              <div className="action-icon">👥</div>
              <div className="action-content">
                <h3>ניהול משתמשים</h3>
                <p>חסימה, ביטול חסימה ועריכת פרטי משתמשים</p>
              </div>
              <div className="action-arrow">←</div>
            </Link>

            <Link to="/admin-recipe-panel" className="action-card recipes">
              <div className="action-icon">🍳</div>
              <div className="action-content">
                <h3>ניהול מתכונים</h3>
                <p>אישור, דחיה ומחיקת מתכונים</p>
              </div>
              <div className="action-arrow">←</div>
            </Link>
          </div>
        </div>

        {/* Logs Section */}
        <div className="admin-logs">
          <div className="logs-header">
            <h2>יומן פעולות אחרונות</h2>
            <div className="logs-count">
              {Array.isArray(data) ? data.length : 0} פעולות
            </div>
          </div>

          <div className="logs-container">
            {!Array.isArray(data) || data.length === 0 ? (
              <div className="empty-logs">
                <div className="empty-icon">📝</div>
                <h3>אין פעולות מנהל</h3>
                <p>לא נמצאו פעולות ניהול במערכת</p>
              </div>
            ) : (
              Object.keys(groupedLogs).length > 0 ? (
                Object.entries(groupedLogs)
                  .sort((a, b) => {
                    const aDate = new Date(a[1][0]?.createdAt || a[1][0]?.date || 0);
                    const bDate = new Date(b[1][0]?.createdAt || b[1][0]?.date || 0);
                    return bDate - aDate;
                  })
                  .map(([dateKey, logs]) => (
                    <div key={dateKey} className="log-date-group">
                      <div className="date-header">
                        {formatDate(logs[0]?.createdAt || logs[0]?.date)}
                      </div>

                      <div className="logs-list">
                        {[...logs]
                          .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
                          .map((log, index) => {
                            const logDetails = getLogDetails(log.action);
                            return (
                              <div key={`${dateKey}-${index}`} className={`log-item ${logDetails.color}`}>
                                <div className="log-icon">{logDetails.icon}</div>
                                <div className="log-content">
                                  <div className="log-action">{logDetails.text}</div>
                                </div>

                                <div className="log-time">
                                  {new Date(log.createdAt || log.date || Date.now()).toLocaleTimeString('he-IL', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="empty-logs">
                  <div className="empty-icon">📝</div>
                  <h3>אין פעולות להצגה</h3>
                  <p>נתוני הלוג לא זמינים כרגע</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}