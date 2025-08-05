import React, { useState } from 'react';
import './style.scss';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: 'שרה כהן',
    email: 'sarah.cohen@example.com',
    avatar: 'ש'
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Form validation states
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileForm.name.trim()) {
      errors.name = 'שם הוא שדה חובה';
    } else if (profileForm.name.trim().length < 2) {
      errors.name = 'שם חייב להכיל לפחות 2 תווים';
    }
    
    if (!profileForm.email.trim()) {
      errors.email = 'אימייל הוא שדה חובה';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'פורמט אימייל לא תקין';
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'סיסמה נוכחית נדרשת';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'סיסמה חדשה נדרשת';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'סיסמה חדשה חייבת להכיל לפחות 6 תווים';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'אישור סיסמה נדרש';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'הסיסמאות אינן תואמות';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update avatar initial if name changed
      const newAvatar = profileForm.name.trim().charAt(0).toUpperCase();
      setProfileForm(prev => ({ ...prev, avatar: newAvatar }));
      
      setSuccessMessage('הפרופיל עודכן בהצלחה!');
      console.log('Profile updated:', profileForm);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccessMessage('הסיסמה שונתה בהצלחה!');
      console.log('Password updated');
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'פרופיל', icon: '👤' },
    { id: 'security', label: 'אבטחה', icon: '🔒' },
    { id: 'notifications', label: 'התראות', icon: '🔔' },
    { id: 'privacy', label: 'פרטיות', icon: '🛡️' }
  ];

  return (
    <div className="settings-page">
      <div className="container">
        {/* Header */}
        <div className="settings-header">
          <h1>⚙️ הגדרות</h1>
          <p>נהל את החשבון והעדפות שלך</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {successMessage}
          </div>
        )}

        {/* Settings Content */}
        <div className="settings-content">
          {/* Navigation Tabs */}
          <div className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="settings-main">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>פרטי פרופיל</h2>
                  <p>עדכן את המידע האישי שלך</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="settings-form">
                  <div className="form-group">
                    <label htmlFor="name">שם מלא</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className={profileErrors.name ? 'error' : ''}
                      placeholder="הכנס את שמך המלא"
                    />
                    {profileErrors.name && (
                      <span className="error-message">{profileErrors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">כתובת אימייל</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className={profileErrors.email ? 'error' : ''}
                      placeholder="הכנס את כתובת האימייל שלך"
                    />
                    {profileErrors.email && (
                      <span className="error-message">{profileErrors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>תמונת פרופיל</label>
                    <div className="avatar-section">
                      <div className="current-avatar">
                        <span>{profileForm.avatar}</span>
                      </div>
                      <div className="avatar-info">
                        <p>האות הראשונה מהשם שלך תשמש כתמונת פרופיל</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        מעדכן...
                      </>
                    ) : (
                      'שמור שינויים'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>אבטחת חשבון</h2>
                  <p>שנה את הסיסמה שלך לאבטחה מיטבית</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="settings-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">סיסמה נוכחית</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className={passwordErrors.currentPassword ? 'error' : ''}
                      placeholder="הכנס את הסיסמה הנוכחית"
                    />
                    {passwordErrors.currentPassword && (
                      <span className="error-message">{passwordErrors.currentPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">סיסמה חדשה</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={passwordErrors.newPassword ? 'error' : ''}
                      placeholder="הכנס סיסמה חדשה (לפחות 6 תווים)"
                    />
                    {passwordErrors.newPassword && (
                      <span className="error-message">{passwordErrors.newPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">אישור סיסמה חדשה</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={passwordErrors.confirmPassword ? 'error' : ''}
                      placeholder="הכנס שוב את הסיסמה החדשה"
                    />
                    {passwordErrors.confirmPassword && (
                      <span className="error-message">{passwordErrors.confirmPassword}</span>
                    )}
                  </div>

                  <div className="password-requirements">
                    <h4>דרישות סיסמה:</h4>
                    <ul>
                      <li className={passwordForm.newPassword.length >= 6 ? 'valid' : ''}>
                        לפחות 6 תווים
                      </li>
                      <li className={/[A-Za-z]/.test(passwordForm.newPassword) ? 'valid' : ''}>
                        לפחות אות אחת
                      </li>
                      <li className={/\d/.test(passwordForm.newPassword) ? 'valid' : ''}>
                        לפחות ספרה אחת
                      </li>
                    </ul>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn warning"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        משנה סיסמה...
                      </>
                    ) : (
                      'שנה סיסמה'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Other Tabs Placeholders */}
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>הגדרות התראות</h2>
                  <p>בקרוב...</p>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>הגדרות פרטיות</h2>
                  <p>בקרוב...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}