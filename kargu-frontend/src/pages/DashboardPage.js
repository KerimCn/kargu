import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Check, 
  Users, 
  FileText, 
  PlayCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Info,
  BookOpen
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import RecentCasesModal from '../components/dashboard/RecentCasesModal';
import QuickStatsModal from '../components/dashboard/QuickStatsModal';
import { DashboardController } from '../controllers/dashboardController';
import { useTheme } from '../context/ThemeContext';

const DashboardPage = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    criticalCases: 0,
    resolvedToday: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    totalPlaybooks: 0,
    activeExecutions: 0,
    totalUsers: 0,
    resolvedTrend: [],
    severityDistribution: [],
    statusDistribution: [],
    recentCases: [],
    criticalCasesList: [],
    avgResolutionTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [showCriticalModal, setShowCriticalModal] = useState(false);
  const [showQuickStatsModal, setShowQuickStatsModal] = useState(false);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    const result = await DashboardController.getStats();
    if (result.success) {
      setStats(result.data);
    } else {
      console.error('Failed to fetch stats:', result.error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const severityChartData = DashboardController.formatSeverityChartData(stats.severityDistribution);
  const statusChartData = DashboardController.formatStatusChartData(stats.statusDistribution);
  const trendChartData = DashboardController.formatTrendChartData(stats.resolvedTrend);

  return (
    <div className="dashboard-page">
      <div className="container py-8">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 
              className="dashboard-title" 
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              SYSTEM OVERVIEW
            </h1>
            <p className="dashboard-subtitle">Real-time security operations dashboard</p>
          </div>
          <div className="dashboard-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowQuickStatsModal(true)}
            >
              <Info size={16} />
              Quick Stats
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="dashboard-stats-grid">
          <StatCard 
            icon={Activity} 
            label="Total Cases" 
            value={stats.totalCases} 
            color={isDark ? "#E0E6ED" : "#000000"}
            onClick={() => window.location.href = '/cases'}
          />
          <StatCard 
            icon={AlertTriangle} 
            label="Open Cases" 
            value={stats.openCases} 
            color="#FF4D4D"
            onClick={() => window.location.href = '/cases?status=open'}
          />
          <StatCard 
            icon={AlertTriangle} 
            label="Critical Cases" 
            value={stats.criticalCases} 
            color="#FF0000"
            onClick={() => setShowCriticalModal(true)}
          />
          <StatCard 
            icon={Users} 
            label="Total Users" 
            value={stats.totalUsers} 
            color="#9CA3AF"
          />
          <StatCard 
            icon={FileText} 
            label="Total Tasks" 
            value={stats.totalTasks} 
            color="#FFA500"
          />
          <StatCard 
            icon={Check} 
            label="Completed Tasks" 
            value={stats.completedTasks} 
            color="#00C896"
          />
          <StatCard 
            icon={PlayCircle} 
            label="Active Playbooks" 
            value={stats.activeExecutions} 
            color="#FF4D4D"
          />
          <StatCard 
            icon={BookOpen} 
            label="Total Playbooks" 
            value={stats.totalPlaybooks} 
            color="#6B7280"
          />
        </div>

        {/* Charts Section */}
        <div className="dashboard-charts-section">
          <div className="dashboard-charts-grid">
            {trendChartData.length > 0 && (
              <ChartCard
                title="Resolution Trend (Last 7 Days)"
                data={trendChartData}
                type="line"
                color="#00C896"
              />
            )}
            {severityChartData.length > 0 && (
              <ChartCard
                title="Severity Distribution"
                data={severityChartData}
                type="bar"
                color="#FF4D4D"
              />
            )}
            {statusChartData.length > 0 && (
              <ChartCard
                title="Status Distribution"
                data={statusChartData}
                type="bar"
                color="#FFA500"
              />
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="dashboard-actions-section">
          <div className="dashboard-quick-actions">
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', marginBottom: '16px' }}>
              Quick Actions
            </h3>
            <div className="quick-actions-grid">
              <button 
                className="quick-action-btn"
                onClick={() => window.location.href = '/cases/new'}
              >
                <FileText size={20} />
                <span>New Case</span>
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => window.location.href = '/playbooks'}
              >
                <PlayCircle size={20} />
                <span>Playbooks</span>
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => setShowRecentModal(true)}
              >
                <Clock size={20} />
                <span>Recent Cases</span>
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => window.location.href = '/users'}
              >
                <Users size={20} />
                <span>Users</span>
              </button>
            </div>
          </div>

          {stats.avgResolutionTime > 0 && (
            <div className="dashboard-metrics-card">
              <div className="metrics-card-header">
                <TrendingUp size={20} />
                <h3 style={{ fontFamily: 'Rajdhani, sans-serif' }}>Performance Metrics</h3>
              </div>
              <div className="metrics-card-content">
                <div className="metric-item">
                  <div className="metric-label">Average Resolution Time</div>
                  <div className="metric-value">{stats.avgResolutionTime} days</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Task Completion Rate</div>
                  <div className="metric-value">
                    {DashboardController.calculateTaskCompletionRate(stats.totalTasks, stats.completedTasks)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <RecentCasesModal
        isOpen={showRecentModal}
        onClose={() => setShowRecentModal(false)}
        cases={stats.recentCases}
        title="Recent Cases"
      />
      <RecentCasesModal
        isOpen={showCriticalModal}
        onClose={() => setShowCriticalModal(false)}
        cases={stats.criticalCasesList || []}
        title="Critical Cases"
      />
      <QuickStatsModal
        isOpen={showQuickStatsModal}
        onClose={() => setShowQuickStatsModal(false)}
        stats={stats}
      />
    </div>
  );
};

export default DashboardPage;