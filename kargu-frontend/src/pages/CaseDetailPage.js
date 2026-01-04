import React, { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Clock, User, Server, Search, Edit2, Trash2, Send, X } from 'lucide-react';
import { caseAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProcessTreeNode from '../components/cases/ProcessTreeNode';

const CaseDetailPage = ({ caseId, onBack }) => {
  const { user } = useAuth();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('data');
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    fetchCaseDetail();
  }, [caseId]);

  useEffect(() => {
    if (activeTab === 'comments' && caseId) {
      fetchComments();
    }
  }, [activeTab, caseId]);

  const fetchCaseDetail = async () => {
    try {
      const data = await caseAPI.getDetail(caseId);
      setDetailData(data);
    } catch (error) {
      console.error('Failed to fetch case detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await commentAPI.getAll(caseId);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const createdComment = await commentAPI.create(caseId, newComment);
      setComments([createdComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert(error.message || 'Yorum eklenirken bir hata oluştu.');
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.comment);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentText.trim()) return;
    
    try {
      const updatedComment = await commentAPI.update(commentId, editingCommentText);
      setComments(comments.map(c => c.id === commentId ? updatedComment : c));
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert(error.message || 'Yorum güncellenirken bir hata oluştu.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    
    try {
      await commentAPI.delete(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert(error.message || 'Yorum silinirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <p className="text-muted">Loading case details...</p>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="py-8">
        <p className="text-primary">Case not found</p>
      </div>
    );
  }

  const { case: caseInfo, machine, data, tasks, playbooks, ioc, processTree } = detailData;

  const tabs = [
    { id: 'data', label: 'Data', icon: Server },
    { id: 'tasks', label: 'Tasks', icon: User },
    { id: 'playbooks', label: 'Playbooks', icon: Monitor },
    { id: 'comments', label: 'Comments', icon: Clock },
    { id: 'ioc', label: 'IOC', icon: Search },
    { id: 'process', label: 'Process Tree', icon: Monitor }
  ];

  const filterData = (items) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const renderTable = (columns, data) => {
    const filteredData = filterData(data);

    return (
      <div>
        {/* Search Bar */}
        <div className="mb-4 relative">
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#6B7280'
            }} 
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2F38' }}>
                {columns.map(col => (
                  <th 
                    key={col.key}
                    style={{ 
                      padding: '12px',
                      textAlign: 'left',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr 
                  key={idx}
                  style={{ 
                    borderBottom: '1px solid #2A2F38',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {columns.map(col => (
                    <td 
                      key={col.key}
                      style={{ 
                        padding: '12px',
                        color: '#9CA3AF',
                        fontSize: '13px',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {col.render ? col.render(row[col.key]) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted">No data found</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'data':
        return renderTable(
          [
            { key: 'timestamp', label: 'Timestamp' },
            { key: 'event', label: 'Event' },
            { key: 'path', label: 'Path' },
            { key: 'status', label: 'Status', render: (val) => (
              <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
            )}
          ],
          data
        );

      case 'tasks':
        return renderTable(
          [
            { key: 'name', label: 'Task Name' },
            { key: 'assigned_to', label: 'Assigned To' },
            { key: 'status', label: 'Status', render: (val) => (
              <span className={`badge badge-${val.toLowerCase().replace(' ', '_')}`}>{val}</span>
            )},
            { key: 'priority', label: 'Priority' },
            { key: 'due_date', label: 'Due Date' }
          ],
          tasks
        );

      case 'playbooks':
        return renderTable(
          [
            { key: 'name', label: 'Playbook' },
            { key: 'version', label: 'Version' },
            { key: 'last_run', label: 'Last Run' },
            { key: 'status', label: 'Status', render: (val) => (
              <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
            )},
            { key: 'steps_completed', label: 'Progress' }
          ],
          playbooks
        );

      case 'comments':
        return (
          <div>
            {/* Add Comment Form - Only for users with role !== '1' */}
            {user && user.role !== '1' && (
              <div 
                className="mb-6"
                style={{
                  background: '#0F1115',
                  border: '1px solid #2A2F38',
                  borderRadius: '4px',
                  padding: '16px'
                }}
              >
                <div className="mb-3">
                  <label 
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#E0E6ED',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    Yeni Yorum Ekle
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    rows={4}
                    style={{
                      width: '100%',
                      background: '#1A1D24',
                      border: '1px solid #2A2F38',
                      borderRadius: '4px',
                      padding: '12px',
                      color: '#E0E6ED',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '13px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="btn btn-primary flex items-center gap-2"
                  style={{
                    opacity: !newComment.trim() ? 0.5 : 1,
                    cursor: !newComment.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={16} />
                  Yorum Ekle
                </button>
              </div>
            )}

            {/* Comments List */}
            {loadingComments ? (
              <div className="text-center py-8">
                <p className="text-muted">Yorumlar yükleniyor...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted">Henüz yorum yok</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      background: '#0F1115',
                      border: '1px solid #2A2F38',
                      borderRadius: '4px',
                      padding: '16px',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FF4D4D'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2A2F38'}
                  >
                    {/* Comment Header */}
                    <div 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}
                    >
                      <div>
                        <div 
                          style={{
                            color: '#FF4D4D',
                            fontFamily: 'Rajdhani, sans-serif',
                            fontWeight: 700,
                            fontSize: '14px',
                            marginBottom: '4px'
                          }}
                        >
                          {comment.username}
                        </div>
                        <div 
                          style={{
                            color: '#9CA3AF',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px'
                          }}
                        >
                          {new Date(comment.created_at).toLocaleString('tr-TR')}
                          {comment.updated_at && comment.updated_at !== comment.created_at && (
                            <span style={{ marginLeft: '8px', fontStyle: 'italic' }}>
                              (düzenlendi)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Edit/Delete Buttons - Only for comment owner */}
                      {user && user.id === comment.user_id && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {editingCommentId === comment.id ? (
                            <button
                              onClick={handleCancelEdit}
                              style={{
                                background: 'transparent',
                                border: '1px solid #2A2F38',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                color: '#9CA3AF',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#9CA3AF';
                                e.currentTarget.style.color = '#E0E6ED';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#2A2F38';
                                e.currentTarget.style.color = '#9CA3AF';
                              }}
                            >
                              <X size={14} />
                              İptal
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(comment)}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid #2A2F38',
                                  borderRadius: '4px',
                                  padding: '6px 12px',
                                  color: '#9CA3AF',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '12px',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#00C896';
                                  e.currentTarget.style.color = '#00C896';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#2A2F38';
                                  e.currentTarget.style.color = '#9CA3AF';
                                }}
                              >
                                <Edit2 size={14} />
                                Düzenle
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid #2A2F38',
                                  borderRadius: '4px',
                                  padding: '6px 12px',
                                  color: '#9CA3AF',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '12px',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#FF4D4D';
                                  e.currentTarget.style.color = '#FF4D4D';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#2A2F38';
                                  e.currentTarget.style.color = '#9CA3AF';
                                }}
                              >
                                <Trash2 size={14} />
                                Sil
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Comment Content */}
                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          rows={4}
                          style={{
                            width: '100%',
                            background: '#1A1D24',
                            border: '1px solid #2A2F38',
                            borderRadius: '4px',
                            padding: '12px',
                            color: '#E0E6ED',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '13px',
                            resize: 'vertical',
                            marginBottom: '12px'
                          }}
                        />
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={!editingCommentText.trim()}
                          className="btn btn-primary flex items-center gap-2"
                          style={{
                            opacity: !editingCommentText.trim() ? 0.5 : 1,
                            cursor: !editingCommentText.trim() ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Send size={16} />
                          Güncelle
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          color: '#E0E6ED',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {comment.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'ioc':
        return renderTable(
          [
            { key: 'type', label: 'Type' },
            { key: 'value', label: 'Value' },
            { key: 'threat_level', label: 'Threat Level', render: (val) => (
              <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
            )},
            { key: 'first_seen', label: 'First Seen' },
            { key: 'source', label: 'Source' }
          ],
          ioc
        );

      case 'process':
        return (
          <div>
            {/* Process Tree Header */}
            <div className="mb-4 flex justify-between items-center">
              <h3 
                style={{ 
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#E0E6ED'
                }}
              >
                PROCESS TREE
              </h3>
            </div>

            {/* Process Tree View */}
            <div 
              style={{ 
                background: '#0F1115',
                border: '1px solid #2A2F38',
                borderRadius: '4px',
                padding: '16px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px',
                overflowX: 'auto'
              }}
            >
              {processTree && processTree.length > 0 ? (
                processTree.map((process, index) => (
                  <ProcessTreeNode
                    key={process.pid}
                    process={process}
                    level={0}
                    isLast={index === processTree.length - 1}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted">No process data available</p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div 
              className="mt-4"
              style={{ 
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                fontSize: '12px',
                color: '#9CA3AF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  background: '#FF4D4D',
                  borderRadius: '2px'
                }} />
                <span>Suspicious Process</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-running" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  RUNNING
                </span>
                <span>Active Process</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-terminated" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  TERMINATED
                </span>
                <span>Stopped Process</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="btn btn-secondary flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={18} /> BACK TO CASES
      </button>

      {/* Case Header */}
      <div className="mb-6">
        <h2 
          className="text-3xl font-bold mb-2" 
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          {caseInfo.title}
        </h2>
        <p className="text-muted">{caseInfo.description}</p>
      </div>

      {/* Machine Info Card */}
      <div 
        className="card mb-6"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 77, 77, 0.1), rgba(0, 200, 150, 0.1))',
          border: '1px solid #2A2F38'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Monitor size={32} color="#FF4D4D" />
              <div>
                <div className="text-xs text-muted mb-1">Machine Name</div>
                <div 
                  className="font-bold" 
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
                >
                  {machine.name}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">Operating System</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
              >
                {machine.os}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">IP Address</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00C896' }}
              >
                {machine.ip}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">User</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
              >
                {machine.user}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">Domain</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
              >
                {machine.domain}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted mb-1">Timestamp</div>
              <div 
                className="font-semibold" 
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E0E6ED' }}
              >
                {new Date(machine.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <div className="card">
        <div 
          className="flex gap-2 mb-6"
          style={{ borderBottom: '1px solid #2A2F38', paddingBottom: '12px' }}
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  background: activeTab === tab.id ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid #FF4D4D' : '1px solid transparent',
                  borderRadius: '2px',
                  color: activeTab === tab.id ? '#FF4D4D' : '#9CA3AF',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CaseDetailPage;