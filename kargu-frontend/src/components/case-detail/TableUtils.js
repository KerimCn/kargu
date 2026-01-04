import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const renderTable = (columns, data, searchTerm, setSearchTerm) => {
  const filterData = (items) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredData = filterData(data);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary, #6B7280)'
          }} 
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2F38' }}>
              {columns.map(col => (
                <th 
                  key={col.key}
                  style={{ 
                    padding: '12px',
                    textAlign: 'left',
                    color: '#E0E6ED',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr 
                key={idx}
                style={{ 
                  borderBottom: '1px solid #2A2F38',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {columns.map(col => (
                  <td 
                    key={col.key}
                    style={{ 
                      padding: '12px',
                      color: 'var(--text-tertiary, #9CA3AF)',
                      fontSize: '13px',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {col.render ? col.render(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted">No data found</p>
          </div>
        )}
      </div>
    </div>
  );
};

