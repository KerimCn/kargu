import React from 'react';
import { X, BarChart3, TrendingUp, Users, CheckCircle } from 'lucide-react';
import Modal from '../common/Modal';

const QuickStatsModal = ({ isOpen, onClose, stats }) => {
  const statItems = [
    {
      label: 'Total Cases',
      value: stats?.totalCases || 0,
      icon: BarChart3,
      color: '#E0E6ED'
    },
    {
      label: 'Open Cases',
      value: stats?.openCases || 0,
      icon: TrendingUp,
      color: '#FF4D4D'
    },
    {
      label: 'Resolved Today',
      value: stats?.resolvedToday || 0,
      icon: CheckCircle,
      color: '#00C896'
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: '#FFA500'
    },
    {
      label: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: CheckCircle,
      color: '#00C896'
    },
    {
      label: 'Active Playbooks',
      value: stats?.activeExecutions || 0,
      icon: TrendingUp,
      color: '#FF4D4D'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <div className="modal-header">
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif' }}>Quick Statistics</h2>
        <button onClick={onClose} className="modal-close-btn">
          <X size={20} />
        </button>
      </div>
      <div className="modal-body">
        <div className="quick-stats-grid">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="quick-stat-item">
                <div 
                  className="quick-stat-icon"
                  style={{ 
                    background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                    borderColor: `${item.color}40`
                  }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div className="quick-stat-content">
                  <div 
                    className="quick-stat-value"
                    style={{ color: item.color, fontFamily: 'Rajdhani, sans-serif' }}
                  >
                    {(item.value ?? 0).toLocaleString()}
                  </div>
                  <div className="quick-stat-label">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
        {stats?.avgResolutionTime && (
          <div className="avg-resolution-time">
            <div className="avg-resolution-label">Average Resolution Time</div>
            <div className="avg-resolution-value">
              {parseFloat(stats.avgResolutionTime).toFixed(1)} days
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuickStatsModal;
