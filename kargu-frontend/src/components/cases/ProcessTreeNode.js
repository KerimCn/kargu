import React, { useState } from 'react';
import { ChevronRight, ChevronDown, AlertTriangle, User, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ProcessTreeNode = ({ process, level = 0, isLast = false, parentPrefix = '', isRoot = false }) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(level < 2); // İlk 2 seviyeyi açık tut
  const [showDetails, setShowDetails] = useState(false);
  
  // Process verilerini normalize et - farklı formatları destekle
  const processName = process.name || process.process_name || 'Unknown';
  const processPid = process.pid || 'N/A';
  const processPpid = process.ppid || null;
  const processStatus = process.status || 'running';
  const processSuspicious = process.suspicious || false;
  const processUser = process.user || 'Unknown';
  const processStartTime = process.startTime || process.start_time || null;
  const processPath = process.path || null;
  const processCommandLine = process.command_line || process.commandLine || null;
  const processChildren = process.children || [];
  const hasChildren = processChildren && processChildren.length > 0;

  // Tree çizim karakterleri - daha anlaşılır
  const treePrefix = level === 0 ? '' : isLast ? '└─ ' : '├─ ';
  const childPrefix = level === 0 ? '' : isLast ? '    ' : '│   ';

  // Tarih formatla
  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    try {
      const date = new Date(timeStr);
      return date.toLocaleString('tr-TR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return timeStr;
    }
  };

  const toggleExpand = (e) => {
    // Eğer expand icon'a tıklandıysa sadece expand/collapse yap
    if (e.target.closest('.expand-icon')) {
      if (hasChildren) {
        setIsExpanded(!isExpanded);
      }
      return;
    }
    
    // Process row'a tıklandığında detayları toggle et
    setShowDetails(!showDetails);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {/* Process Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 16px',
          paddingLeft: `${16 + level * 24}px`,
          cursor: 'pointer',
          transition: 'all 0.2s',
          borderRadius: '4px',
          marginBottom: '3px',
          background: showDetails 
            ? (level === 0 ? 'rgba(74, 158, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)')
            : (level === 0 ? 'rgba(74, 158, 255, 0.05)' : 'transparent'),
          borderLeft: level > 0 ? `3px solid ${level === 1 ? '#4A9EFF' : level === 2 ? '#00C896' : '#6B7280'}` : 'none',
          position: 'relative',
          border: level === 0 ? '1px solid rgba(74, 158, 255, 0.2)' : 'none'
        }}
        onMouseEnter={(e) => {
          if (!showDetails) {
            e.currentTarget.style.background = level === 0 
              ? 'rgba(74, 158, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!showDetails) {
            e.currentTarget.style.background = level === 0 
              ? 'rgba(74, 158, 255, 0.05)' 
              : 'transparent';
          }
        }}
        onClick={toggleExpand}
      >
        {/* Visual Indent Indicator */}
        {level > 0 && (
          <div
            style={{
              position: 'absolute',
              left: `${16 + (level - 1) * 24}px`,
              top: '50%',
              width: '12px',
              height: '2px',
              background: level === 1 ? '#4A9EFF' : '#6B7280',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <span 
            className="expand-icon"
            onClick={handleExpandClick}
            style={{ 
              marginRight: '8px', 
              color: isDark ? '#9CA3AF' : '#1A1A1A',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: '3px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        ) : (
          <span style={{ width: '24px', marginRight: '8px' }} />
        )}

        {/* Suspicious Indicator */}
        {processSuspicious && (
          <AlertTriangle 
            size={16} 
            style={{ color: '#FF4D4D', marginRight: '8px' }} 
            title="Suspicious Process"
          />
        )}

        {/* Process Name */}
        <span
          style={{
            fontWeight: processSuspicious ? 700 : level === 0 ? 600 : 500,
            color: processSuspicious ? '#FF4D4D' : level === 0 ? '#4A9EFF' : '#E0E6ED',
            marginRight: '12px',
            fontSize: level === 0 ? '13px' : '12px',
            fontFamily: 'JetBrains Mono, monospace'
          }}
        >
          {processName}
        </span>

        {/* PID */}
        <span
          style={{
            color: '#00C896',
            marginRight: '12px',
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 500
          }}
        >
          PID: {processPid}
        </span>

        {/* User Info */}
        {processUser && processUser !== 'Unknown' && (
          <span
            style={{
              color: '#9CA3AF',
              marginRight: '12px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <User size={12} />
            {processUser}
          </span>
        )}

        {/* Status Badge */}
        {processStatus && (
          <span
            className={`badge badge-${processStatus}`}
            style={{
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '4px',
              marginRight: '12px'
            }}
          >
            {processStatus.toUpperCase()}
          </span>
        )}

        {/* Start Time - Always visible when details are shown */}
        {processStartTime && showDetails && (
          <span
            style={{
              color: '#6B7280',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: 'auto'
            }}
          >
            <Clock size={12} />
            {formatTime(processStartTime)}
          </span>
        )}

        {/* Details Toggle Indicator */}
        {!showDetails && (processPath || processCommandLine || processPpid) && (
          <span
            style={{
              color: '#6B7280',
              fontSize: '10px',
              marginLeft: 'auto',
              fontStyle: 'italic'
            }}
          >
            Tıklayarak detayları göster
          </span>
        )}
      </div>

      {/* Process Details Panel - Click to show/hide */}
      {showDetails && (processPath || processCommandLine || processPpid || processStartTime) && (
        <div
          style={{
            marginLeft: `${16 + level * 24 + 32}px`,
            padding: '12px 16px',
            background: '#1A1F2E',
            border: '1px solid #2A2F38',
            borderRadius: '6px',
            marginBottom: '8px',
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#9CA3AF',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            zIndex: 10,
            animation: 'fadeIn 0.2s ease-in'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px',
            paddingBottom: '8px',
            borderBottom: '1px solid #2A2F38'
          }}>
            <strong style={{ color: '#E0E6ED', fontSize: '12px' }}>Process Detayları</strong>
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(false);
              }}
              style={{
                cursor: 'pointer',
                color: '#9CA3AF',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '3px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#E0E6ED';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
              }}
            >
              ✕ Kapat
            </span>
          </div>
          
          {processPpid && (
            <div style={{ marginBottom: '8px', color: '#4A9EFF' }}>
              <strong style={{ color: '#E0E6ED' }}>Parent PID:</strong> {processPpid}
            </div>
          )}
          {processStartTime && (
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} />
              <strong style={{ color: '#E0E6ED' }}>Start Time:</strong> 
              <span style={{ color: '#9CA3AF', marginLeft: '4px' }}>{formatTime(processStartTime)}</span>
            </div>
          )}
          {processPath && processPath !== 'N/A' && (
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#E0E6ED' }}>Path:</strong> 
              <div style={{ color: '#9CA3AF', marginTop: '4px', wordBreak: 'break-all' }}>{processPath}</div>
            </div>
          )}
          {processCommandLine && (
            <div>
              <strong style={{ color: '#E0E6ED' }}>Command Line:</strong>
              <div style={{ color: '#9CA3AF', marginTop: '4px', wordBreak: 'break-all' }}>{processCommandLine}</div>
            </div>
          )}
        </div>
      )}

      {/* Children (Recursive) */}
      {hasChildren && isExpanded && (
        <div style={{ position: 'relative' }}>
          {processChildren.map((child, index) => (
            <ProcessTreeNode
              key={child.pid || child.process_name || index}
              process={child}
              level={level + 1}
              isLast={index === processChildren.length - 1}
              parentPrefix={parentPrefix + childPrefix}
              isRoot={false}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProcessTreeNode;