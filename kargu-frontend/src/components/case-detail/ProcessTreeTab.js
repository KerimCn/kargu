import React, { useState, useEffect } from 'react';
import ProcessTreeNode from '../cases/ProcessTreeNode';
import { Clock, RefreshCw, Server } from 'lucide-react';
import { aiAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const ProcessTreeTab = ({ processTree, forensicFilesData = [], caseId }) => {
  const { isDark } = useTheme();
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  useEffect(() => {
    if (caseId) {
      fetchAISummary();
    }
  }, [caseId]);

  const fetchAISummary = async () => {
    if (!caseId) return;
    
    try {
      setLoadingSummary(true);
      const response = await aiAPI.getSummary(caseId);
      setAiSummary(response.summary);
    } catch (error) {
      console.error('Error fetching AI summary:', error);
      setAiSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Convert flat process array to tree structure
  const convertProcessArrayToTree = (processArray) => {
    if (!Array.isArray(processArray) || processArray.length === 0) {
      return [];
    }

    const processMap = new Map();
    const rootProcesses = [];

    // Normalize and map all processes
    processArray.forEach(proc => {
      const normalized = {
        pid: proc.pid,
        ppid: proc.ppid || proc.parent_pid || 0,
        name: proc.process_name || proc.name || 'Unknown',
        process_name: proc.process_name || proc.name,
        user: proc.user || proc.username || 'Unknown',
        startTime: proc.start_time || proc.startTime || null,
        status: proc.status || 'running',
        suspicious: proc.suspicious || false,
        path: proc.path || null,
        command_line: proc.command_line || proc.commandLine || null,
        session_id: proc.session_id || null,
        integrity_level: proc.integrity_level || null,
        children: []
      };
      processMap.set(proc.pid, normalized);
    });

    // Build parent-child relationships
    processArray.forEach(proc => {
      const current = processMap.get(proc.pid);
      if (!current) return;

      const parentPid = proc.ppid || proc.parent_pid || 0;
      
      if (!parentPid || parentPid === 0) {
        rootProcesses.push(current);
      } else {
        const parent = processMap.get(parentPid);
        if (parent) {
          parent.children.push(current);
        } else {
          rootProcesses.push(current);
        }
      }
    });

    // Sort children by PID
    const sortChildren = (process) => {
      if (process.children && process.children.length > 0) {
        process.children.sort((a, b) => (a.pid || 0) - (b.pid || 0));
        process.children.forEach(sortChildren);
      }
    };

    rootProcesses.forEach(sortChildren);
    rootProcesses.sort((a, b) => (a.pid || 0) - (b.pid || 0));

    return rootProcesses;
  };

  const handleAskAI = async () => {
    // Use the first available process tree for AI
    const firstProcessTree = processTree && processTree.length > 0 
      ? processTree 
      : (forensicFilesData.length > 0 && forensicFilesData[0].processTree 
          ? convertProcessArrayToTree(forensicFilesData[0].processTree) 
          : null);

    if (!caseId || !firstProcessTree) return;

    try {
      setLoadingGenerate(true);
      const response = await aiAPI.generateSummary(caseId, firstProcessTree);
      setAiSummary(response.summary);
    } catch (error) {
      console.error('Error generating AI summary:', error);
      alert('AI özeti oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleRefreshAI = async () => {
    const firstProcessTree = processTree && processTree.length > 0 
      ? processTree 
      : (forensicFilesData.length > 0 && forensicFilesData[0].processTree 
          ? convertProcessArrayToTree(forensicFilesData[0].processTree) 
          : null);

    if (!caseId || !firstProcessTree) return;

    const confirmMessage = "AI Özet güncellenecek, güncelleme sonrasında token tasarrufu için databse'den çekilen mevcut özeti görüntüleyemeyeceksiniz. Yeni GPT isteğinden emin misiniz ?";
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoadingGenerate(true);
        const response = await aiAPI.generateSummary(caseId, firstProcessTree, true);
        setAiSummary(response.summary);
      } catch (error) {
        console.error('Error refreshing AI summary:', error);
        alert('AI özeti güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoadingGenerate(false);
      }
    }
  };

  const renderProcessTree = (treeData, hostname, title) => {
    if (!treeData || treeData.length === 0) {
      return null;
    }

    return (
      <div 
        style={{ 
          background: '#0F1115',
          border: '1px solid #2A2F38',
          borderRadius: '4px',
          padding: '16px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          overflowX: 'auto',
          minHeight: '200px',
          marginBottom: '24px'
        }}
      >
        {/* Machine Header */}
        {hostname && (
          <div
            style={{
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #2A2F38',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Server size={16} color="#FF4D4D" />
            <span
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#FF4D4D'
              }}
            >
              {hostname}
            </span>
            <span
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '12px',
                color: '#9CA3AF',
                marginLeft: '8px'
              }}
            >
              ({treeData.length} root process{treeData.length !== 1 ? 'es' : ''})
            </span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {!hostname && (
            <div 
              style={{ 
                marginBottom: '16px', 
                paddingBottom: '12px',
                borderBottom: '1px solid #2A2F38',
                color: '#9CA3AF',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Process Tree ({treeData.length} root process{treeData.length !== 1 ? 'es' : ''})
            </div>
          )}
          {treeData.map((process, index) => (
            <ProcessTreeNode
              key={process.pid || process.process_name || index}
              process={process}
              level={0}
              isLast={index === treeData.length - 1}
              isRoot={true}
            />
          ))}
        </div>
      </div>
    );
  };

  // Get all process trees
  const databaseProcessTree = processTree && processTree.length > 0 ? processTree : null;
  const forensicProcessTrees = forensicFilesData
    .filter(file => file.processTree && file.processTree.length > 0)
    .map(file => ({
      ...file,
      treeData: convertProcessArrayToTree(file.processTree)
    }));

  const hasAnyProcessTree = databaseProcessTree || forensicProcessTrees.length > 0;

  return (
    <div>
      <div 
        className="card mb-6"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 77, 77, 0.1), rgba(0, 200, 150, 0.1))',
          border: '1px solid #2A2F38'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8" style={{ width: '100%' }}>
            <div className="flex items-center gap-3" style={{ width: '100%' }}>
              <Clock size={16} color="#FF4D4D" />
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">AI Özet</span>
                  {aiSummary && !loadingSummary && !loadingGenerate && (
                    <RefreshCw 
                      size={14} 
                      color="#4A9EFF" 
                      style={{ cursor: 'pointer' }}
                      onClick={handleRefreshAI}
                      title="AI Özeti Yenile"
                    />
                  )}
                </div>
                {loadingSummary || loadingGenerate ? (
                  <div 
                    className="font-semibold" 
                    style={{ 
                      fontFamily: 'JetBrains Mono, monospace', 
                      color: isDark ? '#E0E6ED' : '#000000',
                      fontSize: '13px',
                      lineHeight: '1.6',
                    }}
                  >
                    Yükleniyor...
                  </div>
                ) : aiSummary ? (
                  <div 
                    className="font-semibold" 
                    style={{ 
                      fontFamily: 'JetBrains Mono, monospace', 
                      color: isDark ? '#E0E6ED' : '#000000',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {aiSummary}
                  </div>
                ) : (
                  <div
                    onClick={handleAskAI}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      color: '#4A9EFF',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      userSelect: 'none'
                    }}
                  >
                    AI'ya Sor
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Process Tree */}
      {databaseProcessTree && renderProcessTree(databaseProcessTree, null, 'Database Process Tree')}

      {/* Forensic File Process Trees - One tree per machine */}
      {forensicProcessTrees.map(file => 
        renderProcessTree(file.treeData, file.hostname, `Forensic: ${file.filename}`)
      )}

      {/* Empty State */}
      {!hasAnyProcessTree && (
        <div className="text-center py-12">
          <p className="text-muted">No process data available</p>
        </div>
      )}
    </div>
  );
};

export default ProcessTreeTab;
