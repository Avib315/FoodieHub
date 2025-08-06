import React, { useState } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import FloatingElements from '../../component/FloatingElements';
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';

export default function PersonalAreaPage() {
 

 // מה שקורל עשתה ------------------------------------- 
 
 // הערה: מהערך המוחזר אפשר לשלוף גם את כמות המתכונים השמורים ואת כמות המתכונים שהמשתמש יצר

const { data, loading } = useAxiosRequest({ url: "/user/getUserData", defaultValue: {}, method: "GET" })

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
      subtitle: `${data.savedRecipesCount} מתכונים`,
      color: 'secondary'
    },
    {
      to: '/my-recipes',
      icon: '📝',
      title: 'המתכונים שלי',
      subtitle: `${data.createdRecipesCount} מתכונים`,
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
              <span>{data.avatar}</span>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{data.name}</h1>
              <p className="profile-email">{data.email}</p>
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
              <div className="stat-number">{data.createdRecipesCount}</div>
              <div className="stat-label">המתכונים שלי</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-number">{data.savedRecipesCount}</div>
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