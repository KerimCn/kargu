import React from 'react';
import ProcessTreeNode from '../cases/ProcessTreeNode';

const ProcessTreeTab = ({ processTree }) => {
  return (
    <div>
      {/* Process Tree View */}
      <div 
        style={{ 
          background: '#0F1115',
          border: '1px solid #2A2F38',
          borderRadius: '4px',
          padding: '12px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          overflowX: 'auto'
        }}
      >
        {processTree && processTree.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {processTree.map((process, index) => (
              <ProcessTreeNode
                key={process.pid}
                process={process}
                level={0}
                isLast={index === processTree.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted">No process data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessTreeTab;

