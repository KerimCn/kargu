import React from 'react';
import { Check, Trash2, Lock, Eye } from 'lucide-react';

const CaseCard = ({ caseData, onUpdate, onDelete, onViewDetail, isAdmin }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div style={{ flex: 1 }}>
          <h3 
            className="text-xl font-bold mb-2" 
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {caseData.title}
          </h3>
          <p className="text-sm mb-3 text-muted">
            {caseData.description}
          </p>
          <div className="flex gap-3">
            <span className={`badge badge-${caseData.severity}`}>
              {caseData.severity?.toUpperCase()}
            </span>
            <span className={`badge badge-${caseData.status}`}>
              {caseData.status?.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* View Detail Button - Herkes görebilir */}
          <button
            onClick={() => onViewDetail(caseData.id)}
            className="p-2"
            style={{ color: '#00C896', background: 'transparent' }}
            title="View Details"
          >
            <Eye size={20} />
          </button>

          {/* Admin Butonları */}
         {(isAdmin === '3' || isAdmin === '4') && (
          <>
          {caseData.status !== 'resolved' && (
            <button
              onClick={() => onUpdate(caseData.id, { status: 'resolved' })}
              className="p-2"
              style={{ color: '#00C896', background: 'transparent' }}
              title="Mark as Resolved"
            >
              <Check size={20} />
            </button>
          )}
          
          <button
            onClick={() => onDelete(caseData.id)}
            className="p-2"
            style={{ color: '#FF4D4D', background: 'transparent' }}
            title="Delete Case"
          >
            <Trash2 size={20} />
          </button>
          </>
        )}
        </div>
      </div>
      
      <div 
        className="text-xs mt-4 text-dim" 
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        Created by: {caseData.created_by_name} | Assigned: {caseData.assigned_to_name || 'Unassigned'}
      </div>
    </div>
  );
};

export default CaseCard;