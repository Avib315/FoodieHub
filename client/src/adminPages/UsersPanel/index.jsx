import React, { useState, useEffect } from 'react';
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import Table from '../../component/Table';
import './style.scss';
import { MdFullscreen } from 'react-icons/md';

const userColumns = [
  { title: 'שם המשתמש', field: 'username', typeof: 'string' },
  { title: 'שם מלא', field: 'fullName', typeof: 'string' },
  { title: 'אימייל', field: 'email', typeof: 'string' },
  { title: 'סטטוס', field: 'status', typeof: 'badge' },
  { title: 'פעולות', field: 'actions', typeof: 'actions' }
];

export default function UserPanel() {

  //--------------------------מה שקורל עשתה---------------------------
  const { data } = useAxiosRequest({ url: `/admin/getAllUsers`, method: "GET" });

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deletedUsers, setDeletedUsers] = useState([]);

  useEffect(() => {
    if (data) {
      setUserData(data);
      setDeletedUsers(data.
        filter(user => user.status === 'inactive').
        map(user => user._id));
    }
  }, [data]);

  // Filter users based on search and filters
  const filteredUsers = userData.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Add action buttons to table data
  const tableDataWithActions = filteredUsers.map(user => ({
    ...user,
    fullName: user.firstName + ' ' + user.lastName,
    actions: (
      <div className="user-actions">
        <button
          className="action-btn status-btn"
          onClick={() => toggleUserStatus(user._id, user.status)}
          title={user.status === 'active' ? 'חסום משתמש' : 'הפעל משתמש'}
        >
          <span>{user.status === 'active' ? '⏸️' : '▶️'}</span>
        </button>
        {user.status !== 'inactive' && (
          <button
            className="action-btn delete-btn"
            onClick={() => deleteUser(user._id)}
            title="מחיקת משתמש"
          >
            <span>🗑️</span>
          </button>
        )}
      </div>
    )
  }));

  const toggleUserStatus = async (userId, status) => {
    const newStatus = status === 'active' ? 'blocked' : 'active';

    const res = await axiosRequest({
      url: `/admin/updateUserStatus`,
      body: { status: newStatus, id: userId },
      method: 'PUT'
    });

    if (!res.data.success) {
      alert('שגיאה בשינוי הסטטוס של המשתמש');
      return;
    }


    if (newStatus === 'active') {
      setDeletedUsers(prev => prev.filter(id => id !== userId));
    }

    setUserData(prevData =>
      prevData.map(user =>
        user._id === userId
          ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
          : user
      )
    );
  };

  const deleteUser = async (userId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) {

      const res = await axiosRequest({
        url: `/admin/updateUserStatus`,
        body: { status: 'inactive', id: userId },
        method: 'PUT'
      });

      if (!res.data.success) {
        alert('שגיאה במחיקת המשתמש');
        return;
      }

      setDeletedUsers(prev => [...prev, userId]);

      setUserData(prevData =>
        prevData.map(user =>
          user._id === userId
            ? { ...user, status: 'inactive' }
            : user
        )
      );
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  // Status translation helper
  const getStatusLabel = (status) => {
    const statusLabels = {
      active: 'פעיל',
      inactive: 'לא פעיל',
      blocked: 'חסום'
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
          <a className="back-btn" href="/admin-panel">
            חזור לפאנל
            <span>← </span>
          </a>
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="active">פעיל</option>
            <option value="inactive">לא פעיל</option>
            <option value="blocked">חסום</option>
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
        <div className="stat-card">
          <span className="stat-number">{filteredUsers.length}</span>
          <span className="stat-label">תוצאות מסוננות</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="panel-content">
        {/* Table Section */}
        <div className="table-section">
          <Table
            tableColumns={userColumns}
            tableData={tableDataWithActions}
            deletedUsers={deletedUsers}
            loading={loading}
            emptyMessage="לא נמצאו משתמשים"
            striped={true}
            hoverable={true}
          />
        </div>
      </div>
    </div>
  );
}