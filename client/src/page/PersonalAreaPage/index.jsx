import React, { useState } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import FloatingElements from '../../component/FloatingElements';
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';

export default function PersonalAreaPage() {
 

 // מה שקורל עשתה ------------------------------------- 
 
 // הערה: מהערך המוחזר אפשר לשלוף גם את כמות המתכונים השמורים ואת כמות המתכונים שהמשתמש יצר

const { data, loading } = useAxiosRequest({ url: "/user/getUserData", defaultValue: [], method: "GET" })

  // מה שקורל עשתה ------------------------------------- 


 // Sample user data - this could come from context or API
  const userData = {
    name: 'שרה כהן',
    avatar: "ש",
    joinDate: 'ינואר 2024',
    email: 'sarah.cohen@example.com',
    stats: {
      myRecipes: 12,
      savedRecipes: 8,
      followers: 45,
      following: 23
    }
  };

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
      subtitle: `${userData.stats.savedRecipes} מתכונים`,
      color: 'secondary'
    },
    {
      to: '/my-recipes',
      icon: '📝',
      title: 'המתכונים שלי',
      subtitle: `${userData.stats.myRecipes} מתכונים`,
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

  const recentActivity = [
    {
      id: 1,
      type: 'recipe_added',
      title: 'הוספת מתכון חדש',
      description: 'פסטה ברוטב עגבניות',
      time: 'לפני יום',
      icon: '🍝'
    },
    {
      id: 2,
      type: 'recipe_rated',
      title: 'קיבלת דירוג חדש',
      description: 'המתכון "עוגת שוקולד" קיבל 5 כוכבים',
      time: 'לפני יומיים',
      icon: '⭐'
    },
    {
      id: 3,
      type: 'recipe_saved',
      title: 'שמרת מתכון',
      description: 'סלט קיסר קלאסי',
      time: 'לפני 3 ימים',
      icon: '💾'
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
              <span>{userData.avatar}</span>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-email">{userData.email}</p>
              <p className="profile-join-date">חבר מאז {userData.joinDate}</p>
            </div>
            <Link to="/settings" className="edit-profile-btn">
              ✏️ ערוך פרופיל
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-number">{userData.stats.myRecipes}</div>
              <div className="stat-label">המתכונים שלי</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-number">{userData.stats.savedRecipes}</div>
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