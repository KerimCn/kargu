import React from 'react';
import ProcessTreeNode from '../cases/ProcessTreeNode';
import { Clock } from 'lucide-react';

const ProcessTreeTab = ({ processTree }) => {

  return (
    
    <div>
       <div 
          className="card mb-6"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 77, 77, 0.1), rgba(0, 200, 150, 0.1))',
            border: '1px solid #2A2F38'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8" style={{ width: '100%' }}>
              <div className="flex items-center gap-3">
                <Clock size={16} color="#FF4D4D" />
                <div>
                  <div className="text-xs text-muted mb-1">AI Özet</div>
                  <div 
                    className="font-semibold" 
                    style={{ 
                      fontFamily: 'JetBrains Mono, monospace', 
                      color: '#E0E6ED',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  > AI için test class - burada ai'ya post edilen process tree'deki veri ai'ya incelettirilerek process tree'deki anomali tespiti sağlanacak.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

