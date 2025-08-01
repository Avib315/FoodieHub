import React, { useState } from 'react';
import './style.scss';

export default function PersonalAreaPage() {
  const [activeModal, setActiveModal] = useState(null);

  // Sample user data
  const userData = {
    name: 'שרה כהן',
    avatar: 'ש',
    joinDate: 'ינואר 2024',
    stats: {
      recipes: 12,
      lists: 5,
      likes: 84
    }
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'newRecipe':
        // Navigate to new recipe page
        console.log('Navigate to new recipe');
        break;
      case 'newList':
        openModal('newList');
        break;
      case 'favorites':
        openModal('favorites');
        break;
      case 'achievements':
        openModal('achievements');
        break;
      default:
        break;
    }
  };

  const handleMenuClick = (menuType) => {
    switch (menuType) {
      case 'myRecipes':
        openModal('myRecipes');
        break;
      case 'myLists':
        openModal('myLists');
        break;
      case 'profile':
        openModal('profile');
        break;
      case 'settings':
        openModal('settings');
        break;
      case 'help':
        openModal('help');
        break;
      default:
        break;
    }
  };

  const renderModal = () => {
    if (!activeModal) return null;

    const modalContent = {
      newList: {
        icon: 'fas fa-list-ul',
        title: 'רשימה חדשה',
        subtitle: 'צור רשימת קניות חדשה'
      },
      favorites: {
        icon: 'fas fa-heart',
        title: 'מועדפים',
        subtitle: '15 מתכונים שמורים'
      },
      achievements: {
        icon: 'fas fa-trophy',
        title: 'הישגים',
        subtitle: '8 תגים שנצברו'
      },
      myRecipes: {
        icon: 'fas fa-book-open',
        title: 'המתכונים שלי',
        subtitle: '12 מתכונים פעילים'
      },
      myLists: {
        icon: 'fas fa-shopping-bag',
        title: 'רשימות הקניות שלי',
        subtitle: '5 רשימות שמורות'
      },
      profile: {
        icon: 'fas fa-user-edit',
        title: 'פרטים אישיים',
        subtitle: 'עדכון פרופיל ופרטי קשר'
      },
      settings: {
        icon: 'fas fa-cog',
        title: 'הגדרות',
        subtitle: 'התראות, פרטיות ועוד'
      },
      help: {
        icon: 'fas fa-question-circle',
        title: 'עזרה ותמיכה',
        subtitle: 'שאלות נפוצות וצור קשר'
      }
    };

    const content = modalContent[activeModal];

    return (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </button>
          <div className="modal-header">
            <div className="modal-icon">
              <i className={content.icon}></i>
            </div>
            <div className="modal-title">{content.title}</div>
            <div className="modal-subtitle">{content.subtitle}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="personal-area-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">{userData.avatar}</div>
          <div className="profile-name">{userData.name}</div>
          <div className="profile-subtitle">חברה מאז {userData.joinDate}</div>
          
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">{userData.stats.recipes}</span>
              <span className="stat-label">מתכונים</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userData.stats.lists}</span>
              <span className="stat-label">רשימות</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userData.stats.likes}</span>
              <span className="stat-label">לייקים</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="quick-actions-grid">
            <div className="quick-action" onClick={() => handleQuickAction('newRecipe')}>
              <div className="quick-action-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <div className="quick-action-title">מתכון חדש</div>
              <div className="quick-action-subtitle">הוסף מתכון</div>
            </div>
            
            <div className="quick-action" onClick={() => handleQuickAction('newList')}>
              <div className="quick-action-icon">
                <i className="fas fa-list-ul"></i>
              </div>
              <div className="quick-action-title">רשימה חדשה</div>
              <div className="quick-action-subtitle">צור רשימת קניות</div>
            </div>

            <div className="quick-action" onClick={() => handleQuickAction('favorites')}>
              <div className="quick-action-icon">
                <i className="fas fa-heart"></i>
              </div>
              <div className="quick-action-title">מועדפים</div>
              <div className="quick-action-subtitle">15 מתכונים</div>
            </div>

            <div className="quick-action" onClick={() => handleQuickAction('achievements')}>
              <div className="quick-action-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="quick-action-title">הישגים</div>
              <div className="quick-action-subtitle">8 תגים</div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="menu-section">
          <div className="section-title">
            <i className="fas fa-user-circle"></i>
            התפריט שלי
          </div>

          <div className="menu-item recipes" onClick={() => handleMenuClick('myRecipes')}>
            <div className="menu-item-left">
              <div className="menu-item-icon">
                <i className="fas fa-book-open"></i>
              </div>
              <div className="menu-item-info">
                <div className="menu-item-title">המתכונים שלי</div>
                <div className="menu-item-subtitle">12 מתכונים פעילים</div>
              </div>
            </div>
            <div className="menu-item-badge">חדש</div>
            <div className="menu-item-arrow">
              <i className="fas fa-chevron-left"></i>
            </div>
          </div>

          <div className="menu-item shopping" onClick={() => handleMenuClick('myLists')}>
            <div className="menu-item-left">
              <div className="menu-item-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div className="menu-item-info">
                <div className="menu-item-title">רשימות הקניות שלי</div>
                <div className="menu-item-subtitle">5 רשימות שמורות</div>
              </div>
            </div>
            <div className="menu-item-arrow">
              <i className="fas fa-chevron-left"></i>
            </div>
          </div>

          <div className="menu-item" onClick={() => handleMenuClick('profile')}>
            <div className="menu-item-left">
              <div className="menu-item-icon">
                <i className="fas fa-user-edit"></i>
              </div>
              <div className="menu-item-info">
                <div className="menu-item-title">פרטים אישיים</div>
                <div className="menu-item-subtitle">עדכון פרופיל ופרטי קשר</div>
              </div>
            </div>
            <div className="menu-item-arrow">
              <i className="fas fa-chevron-left"></i>
            </div>
          </div>

          <div className="menu-item settings" onClick={() => handleMenuClick('settings')}>
            <div className="menu-item-left">
              <div className="menu-item-icon">
                <i className="fas fa-cog"></i>
              </div>
              <div className="menu-item-info">
                <div className="menu-item-title">הגדרות</div>
                <div className="menu-item-subtitle">התראות, פרטיות ועוד</div>
              </div>
            </div>
            <div className="menu-item-arrow">
              <i className="fas fa-chevron-left"></i>
            </div>
          </div>

          <div className="menu-item" onClick={() => handleMenuClick('help')}>
            <div className="menu-item-left">
              <div className="menu-item-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <div className="menu-item-info">
                <div className="menu-item-title">עזרה ותמיכה</div>
                <div className="menu-item-subtitle">שאלות נפוצות וצור קשר</div>
              </div>
            </div>
            <div className="menu-item-arrow">
              <i className="fas fa-chevron-left"></i>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button className="floating-edit" onClick={() => handleMenuClick('profile')}>
          <i className="fas fa-edit"></i>
        </button>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
}