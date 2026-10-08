import React from 'react';

const AdminTable = ({ columns = [], data = [], loading = false, emptyMessage = 'No records found' }) => {
  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#5c6e63', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8e4' }}>
        Loading data...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#5c6e63', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8e4' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8e4', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f9f6', borderBottom: '1px solid #e2e8e4', color: '#1b4332' }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{ padding: '0.85rem 1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={row._id || rIdx} style={{ borderBottom: rIdx === data.length - 1 ? 'none' : '1px solid #e2e8e4' }}>
              {columns.map((col, cIdx) => (
                <td key={cIdx} style={{ padding: '0.85rem 1rem', color: '#2d3748', verticalAlign: 'middle' }}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
