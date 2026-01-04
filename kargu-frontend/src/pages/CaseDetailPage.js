import React, { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Clock, User, Server, Search, Lock, Send } from 'lucide-react';
import { caseAPI, commentAPI, taskAPI, userAPI, playbookAPI, casePlaybookAPI, playbookExecutionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Modal from '../components/common/Modal';
import DataTab from '../components/case-detail/DataTab';
import TasksTab from '../components/case-detail/TasksTab';
import PlaybooksTab from '../components/case-detail/PlaybooksTab';
import CommentsTab from '../components/case-detail/CommentsTab';
import IOCTab from '../components/case-detail/IOCTab';
import ProcessTreeTab from '../components/case-detail/ProcessTreeTab';

const CaseDetailPage = ({ caseId, onBack, initialTab }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab || 'data');
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [users, setUsers] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showCloseCaseModal, setShowCloseCaseModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    assigned_to: '',
    priority: 'medium',
    due_date: ''
  });
  const [casePlaybooks, setCasePlaybooks] = useState([]);
  const [allPlaybooks, setAllPlaybooks] = useState([]);
  const [showAddPlaybookModal, setShowAddPlaybookModal] = useState(false);
  const [showPlaybookExecutionModal, setShowPlaybookExecutionModal] = useState(false);
  const [selectedCasePlaybook, setSelectedCasePlaybook] = useState(null);
  const [playbookExecution, setPlaybookExecution] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStates, setStepStates] = useState([]);
  const [stepComment, setStepComment] = useState('');
  const [playbookExecutions, setPlaybookExecutions] = useState({});
  const [expandedPlaybooks, setExpandedPlaybooks] = useState(new Set());

  useEffect(() => {
    fetchCaseDetail();
  }, [caseId]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'comments' && caseId) {
      fetchComments();
    }
    if (activeTab === 'tasks' && caseId) {
      fetchTasks();
      fetchUsers();
    }
    if (activeTab === 'playbooks' && caseId) {
      fetchCasePlaybooks();
      fetchAllPlaybooks();
    }
  }, [activeTab, caseId]);

  const fetchCaseDetail = async () => {
    try {
      const data = await caseAPI.getDetail(caseId);
      setDetailData(data);
      // Debug: Check if resolution_summary is in the data
      if (data.case) {
        console.log('Case data:', data.case);
        console.log('Resolution summary:', data.case.resolution_summary);
      }
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

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const data = await taskAPI.getAll(caseId);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchCasePlaybooks = async () => {
    try {
      const data = await casePlaybookAPI.getByCaseId(caseId);
      setCasePlaybooks(data);
      
      // Fetch executions for all playbooks
      const executions = {};
      for (const cp of data) {
        try {
          const exec = await playbookExecutionAPI.getByCasePlaybookId(cp.id);
          executions[cp.id] = exec;
        } catch (error) {
          console.error(`Failed to fetch execution for playbook ${cp.id}:`, error);
        }
      }
      setPlaybookExecutions(executions);
    } catch (error) {
      console.error('Failed to fetch case playbooks:', error);
    }
  };

  const fetchAllPlaybooks = async () => {
    try {
      const data = await playbookAPI.getAll();
      setAllPlaybooks(data);
    } catch (error) {
      console.error('Failed to fetch all playbooks:', error);
    }
  };

  const handleAddPlaybook = async (playbookId) => {
    try {
      await casePlaybookAPI.addToCase(caseId, playbookId);
      setShowAddPlaybookModal(false);
      fetchCasePlaybooks();
    } catch (error) {
      console.error('Failed to add playbook:', error);
      alert(error.message || 'Playbook eklenirken bir hata oluştu.');
    }
  };

  const handleRemovePlaybook = async (casePlaybookId) => {
    if (!window.confirm('Bu playbook\'u case\'den kaldırmak istediğinize emin misiniz?')) return;
    
    try {
      await casePlaybookAPI.removeFromCase(casePlaybookId);
      fetchCasePlaybooks();
    } catch (error) {
      console.error('Failed to remove playbook:', error);
      alert(error.message || 'Playbook kaldırılırken bir hata oluştu.');
    }
  };

  const handleOpenPlaybookExecution = async (casePlaybook) => {
    try {
      setSelectedCasePlaybook(casePlaybook);
      const execution = await playbookExecutionAPI.getByCasePlaybookId(casePlaybook.id);
      setPlaybookExecution(execution);
      setCurrentStepIndex(execution.current_step_index || 0);
      setStepStates(execution.step_states || []);
      
      // Load step comment if exists
      const currentStepState = (execution.step_states || [])[execution.current_step_index || 0];
      setStepComment(currentStepState?.comment || '');
      
      setShowPlaybookExecutionModal(true);
    } catch (error) {
      console.error('Failed to fetch execution:', error);
      alert('Playbook execution yüklenirken bir hata oluştu.');
    }
  };

  const handleUpdateExecution = async () => {
    try {
      const updatedStepStates = [...stepStates];
      if (!updatedStepStates[currentStepIndex]) {
        updatedStepStates[currentStepIndex] = { checklist: [], comment: '' };
      }
      updatedStepStates[currentStepIndex].comment = stepComment;
      
      await playbookExecutionAPI.update(playbookExecution.id, {
        current_step_index: currentStepIndex,
        step_states: updatedStepStates
      });
      
      setStepStates(updatedStepStates);
    } catch (error) {
      console.error('Failed to update execution:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleChecklistToggle = async (itemIndex) => {
    const updatedStepStates = [...stepStates];
    if (!updatedStepStates[currentStepIndex]) {
      updatedStepStates[currentStepIndex] = { checklist: [], comment: stepComment };
    }
    const checklist = [...(updatedStepStates[currentStepIndex].checklist || [])];
    const index = checklist.indexOf(itemIndex);
    if (index > -1) {
      checklist.splice(index, 1);
    } else {
      checklist.push(itemIndex);
    }
    updatedStepStates[currentStepIndex] = {
      ...updatedStepStates[currentStepIndex],
      checklist: checklist,
      comment: updatedStepStates[currentStepIndex].comment || stepComment
    };
    
    // State'i hemen güncelle (UI için)
    setStepStates(updatedStepStates);
    
    // Backend'e kaydet
    if (playbookExecution) {
      try {
        await playbookExecutionAPI.update(playbookExecution.id, {
          current_step_index: currentStepIndex,
          step_states: updatedStepStates
        });
      } catch (error) {
        console.error('Failed to update execution:', error);
      }
    }
  };

  const handleNextStep = async () => {
    if (currentStepIndex < (selectedCasePlaybook?.steps?.length || 0) - 1) {
      await handleUpdateExecution();
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      const nextStepState = stepStates[newIndex];
      setStepComment(nextStepState?.comment || '');
    }
  };

  const handlePrevStep = async () => {
    if (currentStepIndex > 0) {
      await handleUpdateExecution();
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      const prevStepState = stepStates[newIndex];
      setStepComment(prevStepState?.comment || '');
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.name.trim()) return;
    
    try {
      await taskAPI.create({
        case_id: caseId,
        ...newTask,
        assigned_to: newTask.assigned_to || null,
        due_date: newTask.due_date || null
      });
      setShowCreateTaskModal(false);
      setNewTask({ name: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      alert(error.message || 'Task oluşturulurken bir hata oluştu.');
    }
  };

  const handleTaskClick = async (task) => {
    try {
      const taskDetail = await taskAPI.getById(task.id);
      setSelectedTask(taskDetail);
      setShowTaskModal(true);
    } catch (error) {
      console.error('Failed to fetch task detail:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, status, result, comment) => {
    try {
      await taskAPI.update(taskId, { status, result, comment });
      setShowTaskModal(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      alert(error.message || 'Task güncellenirken bir hata oluştu.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditTaskModal(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask.name.trim()) return;
    
    try {
      await taskAPI.update(editingTask.id, {
        name: editingTask.name,
        description: editingTask.description,
        assigned_to: editingTask.assigned_to || null,
        priority: editingTask.priority,
        due_date: editingTask.due_date || null
      });
      setShowEditTaskModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      alert(error.message || 'Task güncellenirken bir hata oluştu.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Bu task\'ı silmek istediğinize emin misiniz?')) return;
    
    try {
      await taskAPI.delete(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert(error.message || 'Task silinirken bir hata oluştu.');
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

  const { case: caseInfo, machine, data, playbooks, ioc, processTree } = detailData;
  const isCaseOwner = user && caseInfo.assigned_to === user.id;
  const isCaseCreator = user && caseInfo.created_by === user.id;
  const isCaseResolved = caseInfo.status === 'resolved';
  const canReopenCase = isCaseOwner || isCaseCreator;

  const tabs = [
    { id: 'data', label: 'Data', icon: Server },
    { id: 'tasks', label: 'Tasks', icon: User },
    { id: 'playbooks', label: 'Playbooks', icon: Monitor },
    { id: 'comments', label: 'Comments', icon: Clock },
    { id: 'ioc', label: 'IOC', icon: Search },
    { id: 'process', label: 'Process Tree', icon: Monitor }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'data':
        return (
          <DataTab 
            data={data} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        );

      case 'tasks':
        return (
          <TasksTab
            isCaseOwner={isCaseOwner}
            isCaseResolved={isCaseResolved}
            tasks={tasks}
            loadingTasks={loadingTasks}
            users={users}
            user={user}
            newTask={newTask}
            setNewTask={setNewTask}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            showCreateTaskModal={showCreateTaskModal}
            setShowCreateTaskModal={setShowCreateTaskModal}
            showEditTaskModal={showEditTaskModal}
            setShowEditTaskModal={setShowEditTaskModal}
            showTaskModal={showTaskModal}
            setShowTaskModal={setShowTaskModal}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            handleCreateTask={handleCreateTask}
            handleTaskClick={handleTaskClick}
            handleEditTask={handleEditTask}
            handleUpdateTask={handleUpdateTask}
            handleDeleteTask={handleDeleteTask}
            handleUpdateTaskStatus={handleUpdateTaskStatus}
          />
        );

      case 'playbooks':
        return (
          <PlaybooksTab
            isCaseOwner={isCaseOwner}
            isCaseCreator={isCaseCreator}
            casePlaybooks={casePlaybooks}
            allPlaybooks={allPlaybooks}
            playbookExecutions={playbookExecutions}
            expandedPlaybooks={expandedPlaybooks}
            setExpandedPlaybooks={setExpandedPlaybooks}
            showAddPlaybookModal={showAddPlaybookModal}
            setShowAddPlaybookModal={setShowAddPlaybookModal}
            showPlaybookExecutionModal={showPlaybookExecutionModal}
            setShowPlaybookExecutionModal={setShowPlaybookExecutionModal}
            selectedCasePlaybook={selectedCasePlaybook}
            playbookExecution={playbookExecution}
            currentStepIndex={currentStepIndex}
            stepStates={stepStates}
            stepComment={stepComment}
            setStepComment={setStepComment}
            handleAddPlaybook={handleAddPlaybook}
            handleRemovePlaybook={handleRemovePlaybook}
            handleOpenPlaybookExecution={handleOpenPlaybookExecution}
            handleUpdateExecution={handleUpdateExecution}
            handleChecklistToggle={handleChecklistToggle}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            fetchCasePlaybooks={fetchCasePlaybooks}
          />
        );

      case 'comments':
        return (
          <CommentsTab
            user={user}
            isCaseResolved={isCaseResolved}
            comments={comments}
            loadingComments={loadingComments}
            newComment={newComment}
            setNewComment={setNewComment}
            editingCommentId={editingCommentId}
            editingCommentText={editingCommentText}
            setEditingCommentText={setEditingCommentText}
            handleAddComment={handleAddComment}
            handleStartEdit={handleStartEdit}
            handleCancelEdit={handleCancelEdit}
            handleUpdateComment={handleUpdateComment}
            handleDeleteComment={handleDeleteComment}
          />
        );

      case 'ioc':
        return (
          <IOCTab 
            ioc={ioc} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        );

      case 'process':
        return (
          <ProcessTreeTab processTree={processTree} />
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
        <div className="flex justify-between items-start">
          <div>
            <h2 
              className="text-3xl font-bold mb-2" 
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {caseInfo.title}
            </h2>
            <p className="text-muted">{caseInfo.description}</p>
          </div>
          {/* Case Action Buttons */}
          <div className="flex gap-2">
            {/* Close Case Button - Only for case creator or assignee when case is open */}
            {!isCaseResolved && canReopenCase && (
              <button
                onClick={() => setShowCloseCaseModal(true)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Lock size={16} />
                Case'i Kapat
              </button>
            )}
            {/* Reopen Case Button - Only for case creator or assignee when case is resolved */}
            {isCaseResolved && canReopenCase && (
              <button
                onClick={async () => {
                  if (!window.confirm('Bu case\'i tekrar açmak istediğinize emin misiniz?')) return;
                  try {
                    await caseAPI.update(caseId, { status: 'open' });
                    fetchCaseDetail();
                    alert('Case başarıyla tekrar açıldı.');
                  } catch (error) {
                    console.error('Failed to reopen case:', error);
                    alert(error.message || 'Case tekrar açılırken bir hata oluştu.');
                  }
                }}
                className="btn btn-primary flex items-center gap-2"
              >
                <Send size={16} />
                Case'i Tekrar Aç
              </button>
            )}
          </div>
        </div>
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

      {/* Resolution Summary Card - Only for resolved cases */}
      {isCaseResolved && caseInfo.resolution_summary && (
        <div 
          className="card mb-6"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 77, 77, 0.1), rgba(0, 200, 150, 0.1))',
            border: '1px solid #2A2F38'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8" style={{ width: '100%' }}>
              <div className="flex items-center gap-3">
                <Clock size={128} color="#FF4D4D" />
                <div>
                  <div className="text-xs text-muted mb-1">Kapanış Özeti</div>
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
                    {caseInfo.resolution_summary}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  color: activeTab === tab.id ? '#FF4D4D' : (isDark ? '#9CA3AF' : '#1A1F2E'),
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

      {/* Close Case Modal */}
      <Modal
        isOpen={showCloseCaseModal}
        onClose={() => {
          setShowCloseCaseModal(false);
          setResolutionSummary('');
        }}
        title="Case'i Kapat"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#E0E6ED', 
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              Kapanış Özeti *
            </label>
            <textarea
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              rows={6}
              className="input-field"
              placeholder="Case'in neden kapatıldığını ve yapılan işlemleri özetleyin..."
              style={{ 
                fontFamily: 'JetBrains Mono, monospace', 
                fontSize: '13px',
                resize: 'vertical'
              }}
            />
            <p style={{ 
              color: isDark ? '#9CA3AF' : '#2D3748', 
              fontSize: '12px', 
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              Bu özet case detay sayfasında görüntülenecektir.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={() => {
                setShowCloseCaseModal(false);
                setResolutionSummary('');
              }}
              className="btn btn-secondary"
            >
              İptal
            </button>
            <button
              onClick={async () => {
                if (!resolutionSummary.trim()) {
                  alert('Lütfen kapanış özeti girin.');
                  return;
                }
                try {
                  await caseAPI.update(caseId, { 
                    status: 'resolved',
                    resolution_summary: resolutionSummary.trim()
                  });
                  setShowCloseCaseModal(false);
                  setResolutionSummary('');
                  fetchCaseDetail();
                  alert('Case başarıyla kapatıldı.');
                } catch (error) {
                  console.error('Failed to close case:', error);
                  alert(error.message || 'Case kapatılırken bir hata oluştu.');
                }
              }}
              disabled={!resolutionSummary.trim()}
              className="btn btn-primary"
              style={{ opacity: !resolutionSummary.trim() ? 0.5 : 1 }}
            >
              Case'i Kapat
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CaseDetailPage;