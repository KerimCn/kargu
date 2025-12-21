import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Check } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { dashboardAPI } from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    criticalCases: 0,
    resolvedToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <h2 
          className="text-3xl font-bold mb-6" 
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          SYSTEM OVERVIEW
        </h2>
        <p className="text-muted">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h2 
        className="text-3xl font-bold mb-6" 
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        SYSTEM OVERVIEW
      </h2>
      <div className="uploadFormCard">
  <div className="upload-form-header">
    <h3
      style={{
        fontFamily: 'Rajdhani, sans-serif',
        color: '#E0E6ED',
        fontSize: '18px',
        fontWeight: 600
      }}
    >
      FILE UPLOAD
    </h3>
    <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
      Upload evidence or related files
    </p>
  </div>

  <div className="upload-form-body">
    <label className="upload-dropzone">
      <span className="upload-icon">⬆</span>
      <span className="upload-text">
        Click to select a file
      </span>
      <input type="file" hidden />
    </label>
  </div>

  <div className="upload-form-footer">
    <button className="upload-btn-cancel">
      Cancel
    </button>
    <button className="upload-btn-submit">
      Upload
    </button>
  </div>
</div>
    </div>
  );
};

export default DashboardPage;