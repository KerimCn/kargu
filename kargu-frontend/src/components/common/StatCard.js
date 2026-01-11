import React from 'react';

const StatCard = ({ icon: Icon, label, value, color, trend, onClick }) => {
  return (
    <div 
      className="stat-card" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-header">
        <div 
          className="stat-icon-wrapper"
          style={{ 
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            borderColor: `${color}40`
          }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        {trend && (
          <div className={`stat-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div 
        className="stat-value" 
        style={{ 
          color, 
          fontFamily: 'Rajdhani, sans-serif' 
        }}
      >
        {(value ?? 0).toLocaleString()}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-card-glow" style={{ background: `${color}20` }}></div>
    </div>
  );
};

export default StatCard;