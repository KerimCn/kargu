import React, { useState } from 'react';
import { ChevronRight, ChevronDown, AlertTriangle } from 'lucide-react';

const ProcessTreeNode = ({ process, level = 0, isLast = false, parentPrefix = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = process.children && process.children.length > 0;

  // Tree çizim karakterleri
  const treePrefix = level === 0 ? '' : isLast ? '└─ ' : '├─ ';
  const childPrefix = level === 0 ? '' : isLast ? '   ' : '│  ';

  const toggleExpand = () => {
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
          padding: '8px 0',
          cursor: hasChildren ? 'pointer' : 'default',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = process.suspicious 
            ? 'rgba(255, 77, 77, 0.1)' 
            : 'rgba(255, 255, 255, 0.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        onClick={toggleExpand}
      >
        {/* Tree Lines */}
        <span
          style={{
            color: '#6B7280',
            marginRight: '8px',
            fontFamily: 'JetBrains Mono, monospace',
            whiteSpace: 'pre'
          }}
        >
          {parentPrefix}{treePrefix}
        </span>

        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <span style={{ marginRight: '8px', color: '#9CA3AF' }}>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}

        {/* Suspicious Indicator */}
        {process.suspicious && (
          <AlertTriangle 
            size={16} 
            style={{ color: '#FF4D4D', marginRight: '8px' }} 
            title="Suspicious Process"
          />
        )}

        {/* Process Name */}
        <span
          style={{
            fontWeight: 600,
            color: process.suspicious ? '#FF4D4D' : '#E0E6ED',
            marginRight: '12px',
            minWidth: '150px'
          }}
        >
          {process.name}
        </span>

        {/* PID */}
        <span
          style={{
            color: '#00C896',
            marginRight: '12px',
            minWidth: '60px',
            fontSize: '12px'
          }}
        >
          PID: {process.pid}
        </span>

        {/* User */}
        <span
          style={{
            color: '#9CA3AF',
            marginRight: '12px',
            fontSize: '12px',
            minWidth: '180px'
          }}
        >
          {process.user}
        </span>

        {/* Start Time */}
        <span
          style={{
            color: '#6B7280',
            marginRight: '12px',
            fontSize: '12px',
            minWidth: '100px'
          }}
        >
          {process.startTime}
        </span>

        {/* Status Badge */}
        <span
          className={`badge badge-${process.status}`}
          style={{
            fontSize: '11px',
            padding: '2px 8px'
          }}
        >
          {process.status.toUpperCase()}
        </span>
      </div>

      {/* Children (Recursive) */}
      {hasChildren && isExpanded && (
        <div>
          {process.children.map((child, index) => (
            <ProcessTreeNode
              key={child.pid}
              process={child}
              level={level + 1}
              isLast={index === process.children.length - 1}
              parentPrefix={parentPrefix + childPrefix}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProcessTreeNode;