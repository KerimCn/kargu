import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import TaskDetailModal from '../tasks/TaskDetailModal';

const TasksTab = ({
  isCaseOwner,
  isCaseResolved,
  tasks,
  loadingTasks,
  users,
  user,
  newTask,
  setNewTask,
  editingTask,
  setEditingTask,
  showCreateTaskModal,
  setShowCreateTaskModal,
  showEditTaskModal,
  setShowEditTaskModal,
  showTaskModal,
  setShowTaskModal,
  selectedTask,
  setSelectedTask,
  handleCreateTask,
  handleTaskClick,
  handleEditTask,
  handleUpdateTask,
  handleDeleteTask,
  handleUpdateTaskStatus
}) => {
  return (
    <div>
      {/* Create Task Button - Only for case owner and case is not resolved */}
      {isCaseOwner && !isCaseResolved && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowCreateTaskModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Yeni Task Ekle
          </button>
        </div>
      )}

      {/* Tasks List */}
      {loadingTasks ? (
        <div className="text-center py-8">
          <p className="text-muted">Tasks yükleniyor...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted">Henüz task yok</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                background: '#0F1115',
                border: '1px solid #2A2F38',
                borderRadius: '4px',
                padding: '16px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF4D4D';
                e.currentTarget.style.background = 'rgba(255, 77, 77, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2F38';
                e.currentTarget.style.background = '#0F1115';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div 
                  style={{ flex: 1, cursor: 'pointer' }}
                  onClick={() => handleTaskClick(task)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h4 style={{ 
                      color: '#E0E6ED', 
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      margin: 0
                    }}>
                      {task.name}
                    </h4>
                    <span className={`badge badge-${task.priority?.toLowerCase() || 'medium'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {task.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
                    <span className={`badge badge-${task.status?.toLowerCase().replace(' ', '_') || 'pending'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {task.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  {task.description && (
                    <p style={{ 
                      color: '#9CA3AF', 
                      fontSize: '13px',
                      margin: '8px 0',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6B7280' }}>
                    {task.assigned_to_username && (
                      <span>Atanan: <strong style={{ color: '#00C896' }}>{task.assigned_to_username}</strong></span>
                    )}
                    {task.due_date && (
                      <span>Bitiş: <strong>{new Date(task.due_date).toLocaleDateString('tr-TR')}</strong></span>
                    )}
                  </div>
                </div>
                {/* Edit and Delete Buttons - Only for case owner */}
                {isCaseOwner && (
                  <div 
                    style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleEditTask(task)}
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
                      onClick={() => handleDeleteTask(task.id)}
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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTaskModal}
        onClose={() => {
          setShowCreateTaskModal(false);
          setNewTask({ name: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
        }}
        title="Yeni Task Ekle"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
              Task Adı *
            </label>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="input-field"
              placeholder="Task adını girin"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
              Açıklama
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={4}
              className="input-field"
              placeholder="Task açıklaması"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
              Atanan Kişi
            </label>
            <select
              value={newTask.assigned_to}
              onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
              className="input-field"
            >
              <option value="">Seçiniz</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                Öncelik
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="input-field"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
                <option value="critical">Kritik</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={() => {
                setShowCreateTaskModal(false);
                setNewTask({ name: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
              }}
              className="btn btn-secondary"
            >
              İptal
            </button>
            <button
              onClick={handleCreateTask}
              disabled={!newTask.name.trim()}
              className="btn btn-primary"
              style={{ opacity: !newTask.name.trim() ? 0.5 : 1 }}
            >
              Oluştur
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditTaskModal}
        onClose={() => {
          setShowEditTaskModal(false);
          setEditingTask(null);
        }}
        title="Task Düzenle"
      >
        {editingTask && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                Task Adı *
              </label>
              <input
                type="text"
                value={editingTask.name}
                onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                className="input-field"
                placeholder="Task adını girin"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                Açıklama
              </label>
              <textarea
                value={editingTask.description || ''}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                rows={4}
                className="input-field"
                placeholder="Task açıklaması"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                Atanan Kişi
              </label>
              <select
                value={editingTask.assigned_to || ''}
                onChange={(e) => setEditingTask({ ...editingTask, assigned_to: e.target.value })}
                className="input-field"
              >
                <option value="">Seçiniz</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                  Öncelik
                </label>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                  <option value="critical">Kritik</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={editingTask.due_date ? editingTask.due_date.split('T')[0] : ''}
                  onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                onClick={() => {
                  setShowEditTaskModal(false);
                  setEditingTask(null);
                }}
                className="btn btn-secondary"
              >
                İptal
              </button>
              <button
                onClick={handleUpdateTask}
                disabled={!editingTask.name.trim()}
                className="btn btn-primary"
                style={{ opacity: !editingTask.name.trim() ? 0.5 : 1 }}
              >
                Güncelle
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        title={selectedTask?.name || 'Task Detayı'}
      >
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            user={user}
            isCaseOwner={isCaseOwner}
            onClose={() => {
              setShowTaskModal(false);
              setSelectedTask(null);
            }}
            onUpdate={handleUpdateTaskStatus}
          />
        )}
      </Modal>
    </div>
  );
};

export default TasksTab;

