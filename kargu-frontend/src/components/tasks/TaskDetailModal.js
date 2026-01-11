import React, { useState } from 'react';
import { CheckCircle, XCircle, Send } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const TaskDetailModal = ({ task, user, isCaseOwner, onClose, onUpdate }) => {
  const { isDark } = useTheme();
  const [comment, setComment] = useState('');
  const [result, setResult] = useState('');

  const isTaskAssignee = user && task.assigned_to === user.id;
  const canClose = (isTaskAssignee || isCaseOwner) && task.status !== 'completed' && task.status !== 'failed';

  const handleCloseTask = () => {
    if (!comment.trim()) {
      alert('Lütfen bir yorum ekleyin.');
      return;
    }
    if (!result) {
      alert('Lütfen sonucu seçin (Tamamlandı veya Başarısız).');
      return;
    }
    onUpdate(task.id, result === 'completed' ? 'completed' : 'failed', result, comment);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Task Info */}
      <div style={{ 
        background: isDark ? '#0F1115' : '#FFFFFF', 
        border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`, 
        borderRadius: '8px', 
        padding: '16px',
        boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            color: isDark ? '#9CA3AF' : '#404040', 
            fontSize: '12px',
            fontFamily: 'Rajdhani, sans-serif'
          }}>
            Durum
          </label>
          <span className={`badge badge-${task.status?.toLowerCase().replace(' ', '_') || 'pending'}`}>
            {task.status?.toUpperCase() || 'PENDING'}
          </span>
        </div>

        {task.description && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              color: isDark ? '#9CA3AF' : '#404040', 
              fontSize: '12px',
              fontFamily: 'Rajdhani, sans-serif'
            }}>
              Açıklama
            </label>
            <p style={{ 
              color: isDark ? '#E0E6ED' : '#0F172A', 
              fontSize: '13px',
              fontFamily: 'JetBrains Mono, monospace',
              margin: 0
            }}>
              {task.description}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {task.assigned_to_username && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: isDark ? '#9CA3AF' : '#404040', 
                fontSize: '12px',
                fontFamily: 'Rajdhani, sans-serif'
              }}>
                Atanan Kişi
              </label>
              <p style={{ 
                color: '#00C896', 
                fontSize: '13px',
                fontFamily: 'JetBrains Mono, monospace',
                margin: 0
              }}>
                {task.assigned_to_username}
              </p>
            </div>
          )}

          {task.priority && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: isDark ? '#9CA3AF' : '#404040', 
                fontSize: '12px',
                fontFamily: 'Rajdhani, sans-serif'
              }}>
                Öncelik
              </label>
              <span className={`badge badge-${task.priority?.toLowerCase() || 'medium'}`}>
                {task.priority?.toUpperCase() || 'MEDIUM'}
              </span>
            </div>
          )}

          {task.due_date && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: isDark ? '#9CA3AF' : '#404040', 
                fontSize: '12px',
                fontFamily: 'Rajdhani, sans-serif'
              }}>
                Bitiş Tarihi
              </label>
              <p style={{ 
                color: isDark ? '#E0E6ED' : '#0F172A', 
                fontSize: '13px',
                fontFamily: 'JetBrains Mono, monospace',
                margin: 0
              }}>
                {new Date(task.due_date).toLocaleDateString('tr-TR')}
              </p>
            </div>
          )}

          {task.created_at && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: isDark ? '#9CA3AF' : '#404040', 
                fontSize: '12px',
                fontFamily: 'Rajdhani, sans-serif'
              }}>
                Oluşturulma
              </label>
              <p style={{ 
                color: isDark ? '#E0E6ED' : '#0F172A', 
                fontSize: '13px',
                fontFamily: 'JetBrains Mono, monospace',
                margin: 0
              }}>
                {new Date(task.created_at).toLocaleString('tr-TR')}
              </p>
            </div>
          )}
        </div>

        {task.comment && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}` }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              color: isDark ? '#9CA3AF' : '#404040', 
              fontSize: '12px',
              fontFamily: 'Rajdhani, sans-serif'
            }}>
              Yorum
            </label>
            <p style={{ 
              color: isDark ? '#E0E6ED' : '#0F172A', 
              fontSize: '13px',
              fontFamily: 'JetBrains Mono, monospace',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>
              {task.comment}
            </p>
          </div>
        )}

        {task.result && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2A2F38' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              color: isDark ? '#9CA3AF' : '#1A1A1A', 
              fontSize: '12px',
              fontFamily: 'Rajdhani, sans-serif'
            }}>
              Sonuç
            </label>
            <span className={`badge badge-${task.result === 'completed' ? 'completed' : 'failed'}`}>
              {task.result === 'completed' ? 'TAMAMLANDI' : 'BAŞARISIZ'}
            </span>
          </div>
        )}
      </div>

      {/* Close Task Section - Only for task assignee */}
      {canClose && (
        <div style={{ 
          background: isDark ? '#0F1115' : '#FFFFFF', 
          border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`, 
          borderRadius: '8px', 
          padding: '16px',
          boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.08)'
        }}>
          <h4 style={{ 
            color: isDark ? '#E0E6ED' : '#0F172A', 
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            marginBottom: '12px'
          }}>
            Task'ı Kapat
          </h4>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: isDark ? '#E0E6ED' : '#0F172A', 
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '13px'
            }}>
              Sonuç *
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setResult('completed')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: result === 'completed' ? 'rgba(0, 200, 150, 0.2)' : 'transparent',
                  border: `1px solid ${result === 'completed' ? '#00C896' : (isDark ? '#2A2F38' : '#E2E8F0')}`,
                  borderRadius: '6px',
                  color: result === 'completed' ? '#00C896' : (isDark ? '#9CA3AF' : '#404040'),
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <CheckCircle size={18} />
                Tamamlandı
              </button>
              <button
                onClick={() => setResult('failed')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: result === 'failed' ? 'rgba(255, 77, 77, 0.2)' : 'transparent',
                  border: `1px solid ${result === 'failed' ? '#FF4D4D' : (isDark ? '#2A2F38' : '#E2E8F0')}`,
                  borderRadius: '6px',
                  color: result === 'failed' ? '#FF4D4D' : (isDark ? '#9CA3AF' : '#404040'),
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <XCircle size={18} />
                Başarısız
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: isDark ? '#E0E6ED' : '#0F172A', 
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '13px'
            }}>
              Yorum *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Task hakkında yorumunuzu yazın..."
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}
            />
          </div>

          <button
            onClick={handleCloseTask}
            disabled={!comment.trim() || !result}
            className="btn btn-primary flex items-center gap-2"
            style={{
              width: '100%',
              opacity: (!comment.trim() || !result) ? 0.5 : 1,
              cursor: (!comment.trim() || !result) ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={16} />
            Task'ı Kapat
          </button>
        </div>
      )}

      {!canClose && task.status === 'completed' && (
        <div style={{ 
          background: 'rgba(0, 200, 150, 0.1)', 
          border: '1px solid #00C896', 
          borderRadius: '4px', 
          padding: '12px',
          textAlign: 'center',
          color: '#00C896',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 600
        }}>
          Bu task tamamlanmış
        </div>
      )}

      {!canClose && task.status === 'failed' && (
        <div style={{ 
          background: 'rgba(255, 77, 77, 0.1)', 
          border: '1px solid #FF4D4D', 
          borderRadius: '4px', 
          padding: '12px',
          textAlign: 'center',
          color: '#FF4D4D',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 600
        }}>
          Bu task başarısız olarak işaretlenmiş
        </div>
      )}

      {!canClose && !isTaskAssignee && !isCaseOwner && (
        <div style={{ 
          background: 'rgba(107, 114, 128, 0.1)', 
          border: `1px solid ${isDark ? '#6B7280' : '#CBD5E0'}`, 
          borderRadius: '4px', 
          padding: '12px',
          textAlign: 'center',
          color: '#9CA3AF',
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '13px'
        }}>
          Bu task size atanmamış ve case'in sahibi değilsiniz. Sadece atanan kişi veya case sahibi task'ı kapatabilir.
        </div>
      )}
    </div>
  );
};

export default TaskDetailModal;

