/**
 * Dashboard Controller - Business logic for dashboard
 */
import { dashboardAPI } from '../services/api';

/**
 * Dashboard Controller Class
 */
export class DashboardController {
  /**
   * Get dashboard statistics
   */
  static async getStats() {
    try {
      const stats = await dashboardAPI.getStats();
      
      // Ensure all numeric values are numbers
      const formattedStats = {
        totalCases: Number(stats.totalCases) || 0,
        openCases: Number(stats.openCases) || 0,
        criticalCases: Number(stats.criticalCases) || 0,
        resolvedToday: Number(stats.resolvedToday) || 0,
        totalTasks: Number(stats.totalTasks) || 0,
        completedTasks: Number(stats.completedTasks) || 0,
        pendingTasks: Number(stats.pendingTasks) || 0,
        inProgressTasks: Number(stats.inProgressTasks) || 0,
        totalPlaybooks: Number(stats.totalPlaybooks) || 0,
        activeExecutions: Number(stats.activeExecutions) || 0,
        totalUsers: Number(stats.totalUsers) || 0,
        resolvedTrend: stats.resolvedTrend || [],
        severityDistribution: stats.severityDistribution || [],
        statusDistribution: stats.statusDistribution || [],
        recentCases: stats.recentCases || [],
        criticalCasesList: stats.criticalCasesList || [],
        avgResolutionTime: Number(stats.avgResolutionTime) || 0
      };

      return {
        success: true,
        data: formattedStats,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch dashboard stats'
      };
    }
  }

  /**
   * Format chart data for severity distribution
   */
  static formatSeverityChartData(severityDistribution) {
    return (severityDistribution || []).map(item => ({
      label: item.severity?.toUpperCase() || 'N/A',
      count: item.count,
      severity: item.severity
    }));
  }

  /**
   * Format chart data for status distribution
   */
  static formatStatusChartData(statusDistribution) {
    return (statusDistribution || []).map(item => ({
      label: item.status?.replace('_', ' ').toUpperCase() || 'N/A',
      count: item.count,
      status: item.status
    }));
  }

  /**
   * Format chart data for resolution trend
   */
  static formatTrendChartData(resolvedTrend) {
    return (resolvedTrend || []).map(item => ({
      date: item.date,
      count: item.count,
      label: new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
    }));
  }

  /**
   * Calculate task completion rate
   */
  static calculateTaskCompletionRate(totalTasks, completedTasks) {
    if (totalTasks === 0) return 0;
    return ((completedTasks / totalTasks) * 100).toFixed(1);
  }
}
