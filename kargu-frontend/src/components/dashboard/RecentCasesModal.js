import React from 'react';
import { X, AlertTriangle, Clock, User } from 'lucide-react';
import Modal from '../common/Modal';

const RecentCasesModal = ({ isOpen, onClose, cases, title = 'Recent Cases' }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#FF0000',
      high: '#FF4D4D',
      medium: '#FFA500',
      low: '#00C896'
    };
    return colors[severity] || '#6B7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#FF4D4D',
      in_progress: '#FFA500',
      resolved: '#00C896'
    };
    return colors[status] || '#6B7280';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="modal-header">
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif' }}>{title}</h2>
        <button onClick={onClose} className="modal-close-btn">
          <X size={20} />
        </button>
      </div>
      <div className="modal-body">
        {cases && cases.length > 0 ? (
          <div className="cases-list">
            {cases.map((caseItem) => (
              <div key={caseItem.id} className="case-item-card">
                <div className="case-item-header">
                  <h3 className="case-item-title">{caseItem.title}</h3>
                  <div className="case-item-badges">
                    <span 
                      className="badge"
                      style={{ 
                        background: getSeverityColor(caseItem.severity),
                        color: '#0F1115'
                      }}
                    >
                      {caseItem.severity}
                    </span>
                    <span 
                      className="badge"
                      style={{ 
                        background: getStatusColor(caseItem.status),
                        color: caseItem.status === 'resolved' ? '#0F1115' : '#FFFFFF'
                      }}
                    >
                      {caseItem.status}
                    </span>
                  </div>
                </div>
                {caseItem.description && (
                  <p className="case-item-description">{caseItem.description}</p>
                )}
                <div className="case-item-footer">
                  <div className="case-item-meta">
                    {caseItem.assigned_to_name && (
                      <div className="case-item-meta-item">
                        <User size={14} />
                        <span>{caseItem.assigned_to_name}</span>
                      </div>
                    )}
                    <div className="case-item-meta-item">
                      <Clock size={14} />
                      <span>{new Date(caseItem.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      onClose();
                      window.location.href = `/cases/${caseItem.id}`;
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <AlertTriangle size={48} className="text-muted" />
            <p className="text-muted">No cases found</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RecentCasesModal;
