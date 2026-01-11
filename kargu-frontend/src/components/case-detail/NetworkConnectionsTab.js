import React, { useState } from 'react';
import { Network, Globe, ExternalLink, Server } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NetworkConnectionsTab = ({ networkConnections = [], forensicFilesData = [], caseId }) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, established, listening

  // Combine database network connections with forensic file connections
  const allNetworkConnections = [
    ...networkConnections.map(conn => ({ ...conn, source: 'database' })),
    ...forensicFilesData.flatMap(file => 
      file.networkConnections.map(conn => ({ 
        ...conn, 
        source: 'forensic',
        hostname: file.hostname,
        fileId: file.id
      }))
    )
  ];

  // Filter connections based on search and type
  const filterConnections = (connections) => {
    return connections.filter(conn => {
      const matchesSearch = 
        !searchTerm || 
        conn.localAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.remoteAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.protocol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.processName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = 
        filterType === 'all' ||
        (filterType === 'established' && conn.state?.toLowerCase() === 'established') ||
        (filterType === 'listening' && conn.state?.toLowerCase() === 'listening');

      return matchesSearch && matchesType;
    });
  };

  const getStateColor = (state) => {
    const stateLower = state?.toLowerCase();
    if (stateLower === 'established') return '#00C896';
    if (stateLower === 'listening') return '#4A9EFF';
    if (stateLower === 'time_wait' || stateLower === 'close_wait') return '#FFA500';
    if (stateLower === 'syn_sent' || stateLower === 'syn_received') return '#FFD700';
    return '#9CA3AF';
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    // Handle IPv6 addresses
    if (address.includes('::')) {
      return address;
    }
    // Handle IPv4 with port
    if (address.includes(':')) {
      const [ip, port] = address.split(':');
      return (
        <span>
          <span style={{ color: isDark ? '#E0E6ED' : '#000000' }}>{ip}</span>
          <span style={{ color: '#9CA3AF', marginLeft: '4px' }}>:{port}</span>
        </span>
      );
    }
    return address;
  };

  const renderConnectionsTable = (connections, title, hostname) => {
    const filteredConnections = filterConnections(connections);

    if (filteredConnections.length === 0 && connections.length === 0) {
      return null;
    }

    return (
      <div 
        style={{ 
          background: '#0F1115',
          border: '1px solid #2A2F38',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '24px'
        }}
      >
        {/* Machine Header */}
        {hostname && (
          <div
            style={{
              padding: '12px 16px',
              background: '#1A1F2E',
              borderBottom: '1px solid #2A2F38',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Server size={16} color="#4A9EFF" />
            <span
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#4A9EFF'
              }}
            >
              {hostname}
            </span>
            <span
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '12px',
                color: '#9CA3AF',
                marginLeft: '8px'
              }}
            >
              ({connections.length} connections)
            </span>
          </div>
        )}

        {filteredConnections.length > 0 ? (
          <div>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 100px 120px 100px 80px',
                gap: '16px',
                padding: '12px 16px',
                background: '#1A1F2E',
                borderBottom: '1px solid #2A2F38',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                color: '#9CA3AF',
                textTransform: 'uppercase'
              }}
            >
              <div>Local Address</div>
              <div>Remote Address</div>
              <div>Protocol</div>
              <div>State</div>
              <div>Process</div>
              <div>PID</div>
            </div>

            {/* Table Rows */}
            {filteredConnections.map((conn, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 100px 120px 100px 80px',
                  gap: '16px',
                  padding: '12px 16px',
                  borderBottom: index < filteredConnections.length - 1 ? '1px solid #2A2F38' : 'none',
                  background: 'transparent',
                  transition: 'background 0.2s',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1A1F2E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ color: isDark ? '#E0E6ED' : '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {formatAddress(conn.localAddress)}
                </div>
                <div style={{ color: isDark ? '#E0E6ED' : '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {conn.remoteAddress ? (
                    <>
                      {formatAddress(conn.remoteAddress)}
                      {conn.remoteAddress && !conn.remoteAddress.includes('0.0.0.0') && (
                        <ExternalLink size={12} color="#4A9EFF" style={{ cursor: 'pointer' }} />
                      )}
                    </>
                  ) : (
                    <span style={{ color: '#9CA3AF' }}>N/A</span>
                  )}
                </div>
                <div style={{ color: '#4A9EFF', fontWeight: 600 }}>
                  {conn.protocol?.toUpperCase() || 'N/A'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getStateColor(conn.state)
                    }}
                  />
                  <span style={{ color: getStateColor(conn.state), fontWeight: 600 }}>
                    {conn.state?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                <div style={{ color: isDark ? '#E0E6ED' : '#000000', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {conn.processName || 'N/A'}
                </div>
                <div style={{ color: '#9CA3AF' }}>
                  {conn.pid || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        ) : connections.length > 0 ? (
          <div className="text-center py-8">
            <p className="text-muted" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              No connections match your filters
            </p>
          </div>
        ) : null}
      </div>
    );
  };

  // Group connections by source (database vs forensic files)
  const databaseConnections = networkConnections;
  const forensicFileConnections = forensicFilesData.filter(file => 
    file.networkConnections && file.networkConnections.length > 0
  );

  const totalConnections = allNetworkConnections.length;
  const establishedConnections = allNetworkConnections.filter(c => c.state?.toLowerCase() === 'established').length;

  return (
    <div>
      {/* Header Card with Stats */}
      <div 
        className="card mb-6"
        style={{ 
          background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(0, 200, 150, 0.1))',
          border: '1px solid #2A2F38'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8" style={{ width: '100%' }}>
            <div className="flex items-center gap-3">
              <Network size={16} color="#4A9EFF" />
              <div>
                <div className="text-xs text-muted mb-1">Total Connections</div>
                <div 
                  className="font-bold" 
                  style={{ 
                    fontFamily: 'JetBrains Mono, monospace', 
                    color: isDark ? '#E0E6ED' : '#000000',
                    fontSize: '18px'
                  }}
                >
                  {totalConnections}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe size={16} color="#00C896" />
              <div>
                <div className="text-xs text-muted mb-1">Established</div>
                <div 
                  className="font-bold" 
                  style={{ 
                    fontFamily: 'JetBrains Mono, monospace', 
                    color: '#00C896',
                    fontSize: '18px'
                  }}
                >
                  {establishedConnections}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-4" style={{ padding: '12px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search by IP, port, protocol, state, or process..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0F1115',
                border: '1px solid #2A2F38',
                borderRadius: '4px',
                color: '#E0E6ED',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px'
              }}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'established', 'listening'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: '8px 16px',
                  background: filterType === type ? 'rgba(74, 158, 255, 0.2)' : 'transparent',
                  border: filterType === type ? '1px solid #4A9EFF' : '1px solid #2A2F38',
                  borderRadius: '4px',
                  color: filterType === type ? '#4A9EFF' : '#9CA3AF',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Database Network Connections */}
      {databaseConnections.length > 0 && renderConnectionsTable(databaseConnections, 'Database Connections', null)}

      {/* Forensic File Network Connections - One table per machine */}
      {forensicFileConnections.map(file => 
        renderConnectionsTable(file.networkConnections, `Forensic: ${file.filename}`, file.hostname)
      )}

      {/* Empty State */}
      {totalConnections === 0 && (
        <div className="text-center py-12">
          <Network size={48} color="#9CA3AF" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p className="text-muted" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            No network connections available
          </p>
        </div>
      )}
    </div>
  );
};

export default NetworkConnectionsTab;
