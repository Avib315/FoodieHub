import React, { useEffect, useState } from 'react';
import './style.scss';
import { Link, useNavigate } from 'react-router-dom';
import FloatingElements from '../../component/FloatingElements';
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import useUserStore from '../../store/userStore';
import useAuth from '../../store/useAuth';

export default function PersonalAreaPage() {
  const { logout } = useAuth()

  const { user, clearUser, setUser } = useUserStore()
  const navigate = useNavigate();



  const handleLogout = async () => {
    // מחיקת הטוקן מהקוקי
    // שליחת בקשה לשרת למחיקת הטוקן
    const res = await axiosRequest({
      url: '/user/logout', // או כל endpoint שיש לך להתנתקות
      method: 'POST'
    });
    logout()

    clearUser();

    // מעבר לדף התחברות
    navigate('/login');
  };

  const getUserData = async () => {
    const res = await axiosRequest({ url: "user/getUserData", method: "GET" })
    if (!res) {
      nav("/login")
      return
    }
    console.log(res.data);
    
    setUser(res.data)
  }


  useEffect(() => {
    if (user == null) {
      getUserData()
    }
  }, [])

  const quickActions = [
    {
      to: '/new-recipe',
      icon: '➕',
      title: 'מתכון חדש',
      subtitle: 'הוסף מתכון',
      color: 'primary'
    },
    {
      to: '/favorites',
      icon: '❤️',
      title: 'מועדפים',
      subtitle: `${user?.savedRecipesCount} מתכונים`,
      color: 'secondary'
    },
    {
      to: '/my-recipes',
      icon: '📝',
      title: 'המתכונים שלי',
      subtitle: `${user?.createdRecipesCount} מתכונים`,
      color: 'success'
    },
    {
      to: '/settings',
      icon: '⚙️',
      title: 'הגדרות',
      subtitle: 'ערוך פרופיל',
      color: 'warning'
    }
  ];



  return (
    <>
      <div className="personal-area-page">
        <div className="container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-card">
              <div className="profile-avatar">
                <span>{user?.avatar}</span>
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{user?.name}</h1>
                <p className="profile-email">{user?.email}</p>
              </div>
              <Link to="/settings" className="edit-profile-btn">
                ✏️ ערוך פרופיל
              </Link>
              <button onClick={handleLogout} className="edit-profile-btn">
                🚪 התנתק
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-number">{user?.createdRecipesCount}</div>
                <div className="stat-label">המתכונים שלי</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-number">{user?.savedRecipesCount}</div>
                <div className="stat-label">מועדפים</div>
              </div>

            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2 className="section-title">פעולות מהירות</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className={`quick-action ${action.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="quick-action-icon">
                    <span>{action.icon}</span>
                  </div>
                  <div className="quick-action-content">
                    <div className="quick-action-title">{action.title}</div>
                    <div className="quick-action-subtitle">{action.subtitle}</div>
                  </div>
                  <div className="quick-action-arrow">←</div>
                </Link>
              ))}
            </div>
          </div>


        </div>
      </div>
    </>
  );
}