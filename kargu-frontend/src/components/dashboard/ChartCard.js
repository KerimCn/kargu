import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

const ChartCard = ({ title, data = [], type = 'bar', color = '#FF4D4D' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-title">
            {type === 'line' ? <TrendingUp size={20} /> : <BarChart3 size={20} />}
            <span>{title}</span>
          </div>
        </div>
        <div className="chart-card-body">
          <div className="empty-state">
            <p className="text-muted">No data available</p>
          </div>
        </div>
      </div>
    );
  }
  
  const maxValue = Math.max(...data.map(d => Number(d.count) || 0), 1);
  
  const renderBarChart = () => (
    <div className="chart-container">
      {data.map((item, index) => (
        <div key={index} className="chart-item">
          <div className="chart-label">{item.label || item.severity || item.status}</div>
          <div className="chart-bar-wrapper">
            <div 
              className="chart-bar"
              style={{
                width: `${((Number(item.count) || 0) / maxValue) * 100}%`,
                background: `linear-gradient(90deg, ${color}, ${color}CC)`
              }}
            >
              <span className="chart-value">{Number(item.count) || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => {
    const points = data.map((item, index) => ({
      x: (index / (data.length - 1 || 1)) * 100,
      y: 100 - ((Number(item.count) || 0) / maxValue) * 100
    }));

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="line-chart-container">
        <svg viewBox="0 0 100 100" className="line-chart-svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#lineGradient)"
            className="line-chart-area"
          />
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="line-chart-line"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={color}
              className="line-chart-dot"
            />
          ))}
        </svg>
        <div className="line-chart-labels">
          {data.map((item, index) => (
            <div key={index} className="line-chart-label">
              <div className="line-chart-label-date">
                {item.date ? new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }) : item.label}
              </div>
              <div className="line-chart-label-value">{Number(item.count) || 0}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div className="chart-card-title">
          {type === 'line' ? <TrendingUp size={20} /> : <BarChart3 size={20} />}
          <span>{title}</span>
        </div>
      </div>
      <div className="chart-card-body">
        {type === 'line' ? renderLineChart() : renderBarChart()}
      </div>
    </div>
  );
};

export default ChartCard;
