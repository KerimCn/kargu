import React from 'react';
import { Edit2, Trash2, Send, X } from 'lucide-react';

const CommentsTab = ({
  user,
  isCaseResolved,
  comments,
  loadingComments,
  newComment,
  setNewComment,
  editingCommentId,
  editingCommentText,
  setEditingCommentText,
  handleAddComment,
  handleStartEdit,
  handleCancelEdit,
  handleUpdateComment,
  handleDeleteComment
}) => {
  return (
    <div>
      {/* Add Comment Form - Only for users with role !== '1' and case is not resolved */}
      {user && user.role !== '1' && !isCaseResolved && (
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
};

export default CommentsTab;

