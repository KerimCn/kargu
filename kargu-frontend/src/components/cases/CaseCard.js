import React from 'react';
import { Check, Trash2 } from 'lucide-react';

const CaseCard = ({ caseData, onUpdate, onDelete, isAdmin }) => {
 if(isAdmin === '1' && caseData.status !=='resolved'){
  return null;
 };


  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div style={{ flex: 1 }}>
          
         <div className="flex items-center gap-4 mb-2">
            <h3 
            className="text-xl font-bold"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
            {caseData.title}
            </h3>

            <div className="flex gap-2">
            <span className={`badge badge-${caseData.severity}`}>
                {caseData.severity?.toUpperCase()}
            </span>
            <span className={`badge badge-${caseData.status}`}>
                {caseData.status?.toUpperCase()}
            </span>
            </div>
            </div>
          <p className="text-sm mb-3 text-muted">
            {caseData.description}
          </p>
        </div>
               
        <div className="flex gap-2">
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