import React from 'react';
import './style.scss';

// Sample data for demonstration
const sampleTableColumns = [
  { title: 'שם', field: 'name', typeof: 'string' },
  { title: 'גיל', field: 'age', typeof: 'number' },
  { title: 'פעיל', field: 'active', typeof: 'boolean' },
  { title: 'אתר', field: 'website', typeof: 'link' },
  { title: 'תאריך', field: 'date', typeof: 'date' },
  { title: 'סטטוס', field: 'status', typeof: 'badge' }
];

const sampleTableData = [
  {
    name: 'יוחנן כהן',
    age: 28,
    active: true,
    website: 'https://example.com',
    date: '2024-01-15',
    status: 'active'
  },
  {
    name: 'שרה לוי',
    age: 34,
    active: false,
    website: 'https://demo.com',
    date: '2024-02-20',
    status: 'inactive'
  },
  {
    name: 'דוד אברהם',
    age: 42,
    active: true,
    website: 'https://test.com',
    date: '2024-03-10',
    status: 'pending'
  },
  {
    name: 'רחל דוד',
    age: 29,
    active: true,
    website: 'https://sample.com',
    date: '2024-04-05',
    status: 'active'
  }
];

export default function Table({ 
  tableColumns = sampleTableColumns, 
  tableData = sampleTableData,
  loading = false,
  emptyMessage = 'אין נתונים להצגה',
  className = '',
  striped = true,
  hoverable = true,
  bordered = false
}) {
  
  // Format cell content based on type
  const formatCellContent = (value, type) => {
    if (value === null || value === undefined) {
      return '-';
    }

    switch (type) {
      case 'boolean':
        return (
          <span className={`boolean-indicator ${value ? 'true' : 'false'}`}>
            {value ? '✓' : '✗'}
          </span>
        );
      
      case 'number':
        return typeof value === 'number' ? value.toLocaleString('he-IL') : value;
      
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString('he-IL');
        }
        if (typeof value === 'string') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? value : date.toLocaleDateString('he-IL');
        }
        return value;
      
      case 'link':
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="table-link"
          >
            {value}
          </a>
        );
      
      case 'badge':
        return (
          <span className={`status-badge ${value}`}>
            {value === 'active' ? 'פעיל' : 
             value === 'inactive' ? 'לא פעיל' :
             value === 'pending' ? 'ממתין' : value}
          </span>
        );
      
      default:
        return value;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`table-container ${className}`}>
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p>טוען נתונים...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!tableData || tableData.length === 0) {
    return (
      <div className={`table-container ${className}`}>
        <div className="table-empty">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <div className="table-wrapper">
        <table className={`
          data-table 
          ${striped ? 'striped' : ''} 
          ${hoverable ? 'hoverable' : ''} 
          ${bordered ? 'bordered' : ''}
        `}>
          <thead>
            <tr>
              {tableColumns.map((col) => (
                <th key={col.field} className={`column-${col.typeof}`}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {tableColumns.map((col) => (
                  <td key={col.field} className={`column-${col.typeof}`}>
                    {formatCellContent(row[col.field], col.typeof)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}