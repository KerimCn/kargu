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
      <div className="grid grid-4">
        <StatCard 
          icon={Activity} 
          label="Total Cases" 
          value={stats.totalCases} 
          color="#E0E6ED" 
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Open Cases" 
          value={stats.openCases} 
          color="#FF4D4D" 
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Critical" 
          value={stats.criticalCases} 
          color="#FF4D4D" 
        />
        <StatCard 
          icon={Check} 
          label="Resolved Today" 
          value={stats.resolvedToday} 
          color="#00C896" 
        />
      </div>
    </div>
  );
};

export default DashboardPage;