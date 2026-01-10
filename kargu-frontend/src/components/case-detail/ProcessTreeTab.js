import React, { useState, useEffect } from 'react';
import ProcessTreeNode from '../cases/ProcessTreeNode';
import { Clock, RefreshCw } from 'lucide-react';
import { aiAPI } from '../../services/api';

const ProcessTreeTab = ({ processTree, caseId }) => {
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

  const handleAskAI = async () => {
    if (!caseId || !processTree) return;

    try {
      setLoadingGenerate(true);
      const response = await aiAPI.generateSummary(caseId, processTree);
      setAiSummary(response.summary);
    } catch (error) {
      console.error('Error generating AI summary:', error);
      alert('AI özeti oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleRefreshAI = async () => {
    if (!caseId || !processTree) return;

    const confirmMessage = "AI Özet güncellenecek, güncelleme sonrasında token tasarrufu için databse'den çekilen mevcut özeti görüntüleyemeyeceksiniz. Yeni GPT isteğinden emin misiniz ?";
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoadingGenerate(true);
        const response = await aiAPI.generateSummary(caseId, processTree, true);
        setAiSummary(response.summary);
      } catch (error) {
        console.error('Error refreshing AI summary:', error);
        alert('AI özeti güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoadingGenerate(false);
      }
    }
  };

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
                        color: '#E0E6ED',
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
                        color: '#E0E6ED',
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
      {/* Process Tree View */}
      <div 
        style={{ 
          background: '#0F1115',
          border: '1px solid #2A2F38',
          borderRadius: '4px',
          padding: '12px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          overflowX: 'auto'
        }}
      >
        {processTree && processTree.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {processTree.map((process, index) => (
              <ProcessTreeNode
                key={process.pid}
                process={process}
                level={0}
                isLast={index === processTree.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted">No process data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessTreeTab;

