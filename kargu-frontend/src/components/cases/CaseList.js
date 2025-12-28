import React from 'react';
import CaseCard from './CaseCard';  // CaseCard.js dosyası

const CaseList = ({ cases, onUpdate, onDelete, onViewDetail, isAdmin }) => {

  if (cases.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted"> 
          No cases found. {(isAdmin === '3' || isAdmin === '4')
          ? 'Create your first case!'
          : 'No cases available.'}</p>
      </div>
    );
  }

  return (
    <div className="flex-col gap-4">
      {cases.map(c => (
        <div key={c.id} style={{ marginBottom: '16px' }}>
          <CaseCard 
            caseData={c} 
            onUpdate={onUpdate} 
            onDelete={onDelete} 
            onViewDetail={onViewDetail}
            isAdmin={isAdmin}
          />
        </div>
      ))}
    </div>
  );
};

export default CaseList;

