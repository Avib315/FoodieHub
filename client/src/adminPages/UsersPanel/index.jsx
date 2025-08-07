import React, { useState, useEffect } from 'react';
import useAxiosRequest from '../../services/useApiRequest';
import Table from '../../component/Table';
import './style.scss';

const userColumns = [
  { userName: 'שם המשתמש', field: 'userName', typeof: 'string' },
  { email: 'אימייל', field: 'email', typeof: 'string' },
  { role: 'תפקיד', field: 'role', typeof: 'string' },
  { status: 'סטטוס', field: 'status', typeof: 'badge' },
  { createdAt: 'תאריך יצירה', field: 'createdAt', typeof: 'date' },
  { actions: 'פעולות', field: 'actions', typeof: 'actions' }
];


export default function UserPanel() {

  //--------------------------מה שקורל עשתה---------------------------
   const { data } = useAxiosRequest({ url: `/admin/getAllUsers` , method:"GET" });

  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get unique roles for filter
  const roles = [...new Set(userData.map(user => user.role))];

 
  

  // Filter users based on search and filters
  const filteredUsers = userData.filter(user => {
    const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Add action buttons to table data
  const tableDataWithActions = filteredUsers.map(user => ({
    ...user,
    actions: (
      <div className="user-actions">
        <button 
          className="action-btn view-btn"
          onClick={() => viewUser(user.id)}
          title="צפייה במשתמש"
        >
          <span>👁️</span>
        </button>
        <button 
          className="action-btn edit-btn"
          onClick={() => editUser(user.id)}
          title="עריכת משתמש"
        >
          <span>✏️</span>
        </button>
        <button 
          className="action-btn status-btn"
          onClick={() => toggleUserStatus(user.id)}
          title={user.status === 'active' ? 'השבת משתמש' : 'הפעל משתמש'}
        >
          <span>{user.status === 'active' ? '⏸️' : '▶️'}</span>
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={() => deleteUser(user.id)}
          title="מחיקת משתמש"
        >
          <span>🗑️</span>
        </button>
      </div>
    )
  }));

  const viewUser = (userId) => {
    const user = userData.find(u => u.id === userId);
    setSelectedUser(user);
    console.log(`Viewing user with ID: ${userId}`);
  };

  const editUser = (userId) => {
    console.log(`Editing user with ID: ${userId}`);
    // Add your edit logic here
  };

  const toggleUserStatus = (userId) => {
    setUserData(prevData => 
      prevData.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  const deleteUser = (userId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) {
      setUserData(prevData => prevData.filter(user => user.id !== userId));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
    }
  };

  const addNewUser = () => {
    console.log('Adding new user');
    // Add your new user logic here
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  const sendPasswordReset = (userId) => {
    console.log(`Sending password reset for user ${userId}`);
    // Add password reset logic here
  };

  const exportUsers = () => {
    console.log('Exporting users data');
    // Add export logic here
  };

  // Role translation helper
  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: 'מנהל',
      moderator: 'מנהל תוכן',
      user: 'משתמש'
    };
    return roleLabels[role] || role;
  };

  // Status translation helper
  const getStatusLabel = (status) => {
    const statusLabels = {
      active: 'פעיל',
      inactive: 'לא פעיל',
      pending: 'ממתין לאישור'
    };
    return statusLabels[status] || status;
  };

  return (
    <div className="user-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="header-content">
          <h1>ניהול משתמשים</h1>
          <p>נהל את המשתמשים והרשאות המערכת</p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={exportUsers}>
            <span>📊</span>
            ייצוא נתונים
          </button>
          <button className="add-user-btn" onClick={addNewUser}>
            <span>👤</span>
            הוסף משתמש חדש
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="חפש משתמשים (שם או אימייל)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">כל התפקידים</option>
            <option value="admin">מנהל</option>
            <option value="moderator">מנהל תוכן</option>
            <option value="user">משתמש</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="active">פעיל</option>
            <option value="inactive">לא פעיל</option>
            <option value="pending">ממתין לאישור</option>
          </select>

          <button className="clear-filters-btn" onClick={clearFilters}>
            נקה סינון
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-row">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-number">{userData.length}</span>
            <span className="stat-label">סה״כ משתמשים</span>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-number">{userData.filter(u => u.status === 'active').length}</span>
            <span className="stat-label">פעילים</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-number">{userData.filter(u => u.status === 'pending').length}</span>
            <span className="stat-label">ממתינים</span>
          </div>
        </div>
        <div className="stat-card admins">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <span className="stat-number">{userData.filter(u => u.role === 'admin').length}</span>
            <span className="stat-label">מנהלים</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="panel-content">
        {/* Table Section */}
        <div className="table-section">
          <Table 
            tableColumns={userColumns} 
            tableData={data}
            loading={loading}
            emptyMessage="לא נמצאו משתמשים"
            striped={true}
            hoverable={true}
          />
        </div>

        {/* User Details Sidebar */}
        {selectedUser && (
          <div className="user-details">
            <div className="details-header">
              <div className="user-header-info">
                <img 
                  src={selectedUser.avatar} 
                  alt={selectedUser.userName}
                  className="user-avatar"
                />
                <div className="user-header-text">
                  <h2>{selectedUser.userName}</h2>
                  <span className="user-email">{selectedUser.email}</span>
                </div>
              </div>
              <button className="close-btn" onClick={closeUserDetails}>
                ✕
              </button>
            </div>
            
            <div className="details-content">
              <div className="user-info">
                <div className="info-section">
                  <h3>פרטים כלליים</h3>
                  <div className="info-item">
                    <strong>תפקיד:</strong> 
                    <span className={`role-badge ${selectedUser.role}`}>
                      {getRoleLabel(selectedUser.role)}
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <strong>סטטוס:</strong> 
                    <span className={`status-badge ${selectedUser.status}`}>
                      {getStatusLabel(selectedUser.status)}
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <strong>טלפון:</strong> 
                    <span>{selectedUser.phone}</span>
                  </div>
                  
                  <div className="info-item">
                    <strong>תאריך הצטרפות:</strong> 
                    <span>{new Date(selectedUser.createdAt).toLocaleDateString('he-IL')}</span>
                  </div>
                  
                  <div className="info-item">
                    <strong>כניסה אחרונה:</strong> 
                    <span>
                      {selectedUser.lastLogin 
                        ? new Date(selectedUser.lastLogin).toLocaleDateString('he-IL')
                        : 'אף פעם'
                      }
                    </span>
                  </div>
                </div>

                <div className="info-section">
                  <h3>הרשאות</h3>
                  <div className="permissions-list">
                    {selectedUser.permissions.map((permission, index) => (
                      <span key={index} className={`permission-badge ${permission}`}>
                        {permission === 'read' ? 'קריאה' :
                         permission === 'write' ? 'כתיבה' :
                         permission === 'delete' ? 'מחיקה' : permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="user-actions-full">
                <button 
                  className="edit-full-btn"
                  onClick={() => editUser(selectedUser.id)}
                >
                  ערוך פרטים
                </button>
                <button 
                  className="password-reset-btn"
                  onClick={() => sendPasswordReset(selectedUser.id)}
                >
                  שלח איפוס סיסמה
                </button>
                <button 
                  className={`status-toggle-btn ${selectedUser.status}`}
                  onClick={() => toggleUserStatus(selectedUser.id)}
                >
                  {selectedUser.status === 'active' ? 'השבת משתמש' : 'הפעל משתמש'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}