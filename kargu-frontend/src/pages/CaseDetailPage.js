import React, { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Clock, User, Server, Search } from 'lucide-react';
import { caseAPI } from '../services/api';

const CaseDetailPage = ({ caseId, onBack }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('data');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCaseDetail();
  }, [caseId]);

  const fetchCaseDetail = async () => {
    try {
      const data = await caseAPI.getDetail(caseId);
      setDetailData(data);
    } catch (error) {
      console.error('Failed to fetch case detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <p className="text-muted">Loading case details...</p>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="py-8">
        <p className="text-primary">Case not found</p>
      </div>
    );
  }

  const { case: caseInfo, machine, data, tasks, playbooks, comments, ioc } = detailData;

  const tabs = [
    { id: 'data', label: 'Data', icon: Server },
    { id: 'tasks', label: 'Tasks', icon: User },
    { id: 'playbooks', label: 'Playbooks', icon: Monitor },
    { id: 'comments', label: 'Comments', icon: Clock },
    { id: 'ioc', label: 'IOC', icon: Search },
    { id: 'process', label: 'Process Tree', icon: Monitor }
  ];

  const filterData = (items) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const renderTable = (columns, data) => {
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
              color: '#6B7280'
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
                        color: '#9CA3AF',
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'data':
        return renderTable(
          [
            { key: 'timestamp', label: 'Timestamp' },
            { key: 'event', label: 'Event' },
            { key: 'path', label: 'Path' },
            { key: 'status', label: 'Status', render: (val) => (
              <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
            )}
          ],
          data
        );

      case 'tasks':
        return renderTable(
          [
            { key: 'name', label: 'Task Name' },
            { key: 'assigned_to', label: 'Assigned To' },
            { key: 'status', label: 'Status', render: (val) => (
              <span className={`badge badge-${val.toLowerCase().replace(' ', '_')}`}>{val}</span>
            )},
            { key: 'priority', label: 'Priority' },
            { key: 'due_date', label: 'Due Date' }
          ],
          tasks
        );

      case 'playbooks':
        return renderTable(
          [
            { key: 'name', label: 'Playbook' },
            { key: 'version', label: 'Version' },
            { key: 'last_run', label: 'Last Run' },
            { key: 'status', label: 'Status', render: (val) => (
              <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
            )},
            { key: 'steps_completed', label: 'Progress' }
          ],
          playbooks
        );

      case 'comments':
        return renderTable(
          [
            { key: 'timestamp', label: 'Time' },
            { key: 'user', label: 'User' },
            { key: 'comment', label: 'Comment' }
          ],
          comments
        );

      case 'ioc':
        return renderTable(
          [
            { key: 'type', label: 'Type' },
            { key: 'value', label: 'Value' },
            { key: 'threat_level', label: 'Threat Level', render: (val) => (
              <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
            )},
            { key: 'first_seen', label: 'First Seen' },
            { key: 'source', label: 'Source' }
          ],
          ioc
        );

      case 'process':
        return (
          <div className="text-center py-12">
            <Monitor size={64} color="#6B7280" style={{ margin: '0 auto 24px' }} />
            <h3 
              className="text-xl font-bold mb-2" 
              style={{ fontFamily: 'Rajdhani, sans-serif', color: '#E0E6ED' }}
            >
              PROCESS TREE VIEW
            </h3>
            <p className="text-muted">Process tree visualization coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="btn btn-secondary flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={18} /> BACK TO CASES
      </button>

      {/* Case Header */}
      <div className="mb-6">
        <h2 
          className="text-3xl font-bold mb-2" 
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          {caseInfo.title}
        </h2>
        <p className="text-muted">{caseInfo.description}</p>
      </div>

      {/* Machine Info Card */}
      <div 
        className="card mb-6"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 77, 77, 0.1), rgba(0, 200, 150, 0.1))',
          border: '1px solid #2A2F38'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Monitor size={32} color="#FF4D4D" />
              <div>
                <div className="text-xs text-muted mb-1">Machine Name</div>
                <div 
                  className="font-bold" 
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
                >
                  {machine.name}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">Operating System</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
              >
                {machine.os}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">IP Address</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00C896' }}
              >
                {machine.ip}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">User</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
              >
                {machine.user}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">Domain</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
              >
                {machine.domain}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">Timestamp</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
              >
                {new Date(machine.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <div className="card">
        <div 
          className="flex gap-2 mb-6"
          style={{ borderBottom: '1px solid #2A2F38', paddingBottom: '12px' }}
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  background: activeTab === tab.id ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid #FF4D4D' : '1px solid transparent',
                  borderRadius: '2px',
                  color: activeTab === tab.id ? '#FF4D4D' : '#9CA3AF',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CaseDetailPage;