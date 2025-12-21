import React from 'react';

const StatCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="card">
      <Icon size={32} style={{ color, marginBottom: '12px' }} />
      <div 
        className="text-3xl font-bold mb-1" 
        style={{ 
          color, 
          fontFamily: 'Rajdhani, sans-serif' 
        }}
      >
        {value}
      </div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
};

export default StatCard;