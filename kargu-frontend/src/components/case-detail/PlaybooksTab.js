import React from 'react';
import { Plus, Edit2, Trash2, X, Play, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { playbookExecutionAPI } from '../../services/api';

const PlaybooksTab = ({
  isCaseOwner,
  isCaseCreator,
  casePlaybooks,
  allPlaybooks,
  playbookExecutions,
  expandedPlaybooks,
  setExpandedPlaybooks,
  showAddPlaybookModal,
  setShowAddPlaybookModal,
  showPlaybookExecutionModal,
  setShowPlaybookExecutionModal,
  selectedCasePlaybook,
  playbookExecution,
  currentStepIndex,
  stepStates,
  stepComment,
  setStepComment,
  handleAddPlaybook,
  handleRemovePlaybook,
  handleOpenPlaybookExecution,
  handleUpdateExecution,
  handleChecklistToggle,
  handleNextStep,
  handlePrevStep,
  fetchCasePlaybooks
}) => {
  const canManagePlaybooks = isCaseOwner || isCaseCreator;

  return (
    <div>
      {canManagePlaybooks && (
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowAddPlaybookModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid #FF4D4D',
              borderRadius: '4px',
              color: '#FF4D4D',
              cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            <Plus size={18} /> Playbook Ekle
          </button>
        </div>
      )}
      
      {casePlaybooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
          <p>Bu case'e henüz playbook eklenmemiş.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {casePlaybooks.map((cp) => {
            const execution = playbookExecutions[cp.id] || null;
            const progress = execution 
              ? `${(execution.current_step_index + 1)} / ${cp.steps?.length || 0}`
              : '0 / 0';
            const isCompleted = execution?.completed_at !== null;
            const isExpanded = expandedPlaybooks.has(cp.id);
            
            return (
              <div key={cp.id}>
                <div
                  style={{
                    background: '#1E2229',
                    border: '1px solid #2A2F38',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontFamily: 'Rajdhani, sans-serif', 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      color: '#E0E6ED',
                      marginBottom: '4px'
                    }}>
                      {cp.name}
                      {isCompleted && (
                        <span style={{ 
                          marginLeft: '12px', 
                          color: '#4CAF50', 
                          fontSize: '14px',
                          fontWeight: 600
                        }}>
                          ✓ Tamamlandı
                        </span>
                      )}
                    </h3>
                    <p style={{ 
                      color: '#9CA3AF', 
                      fontSize: '13px',
                      fontFamily: 'Rajdhani, sans-serif',
                      margin: 0
                    }}>
                      {cp.steps?.length || 0} adım • İlerleme: {progress}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!isCompleted && (
                      <button
                        onClick={() => handleOpenPlaybookExecution(cp)}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(255, 77, 77, 0.1)',
                          border: '1px solid #FF4D4D',
                          borderRadius: '4px',
                          color: '#FF4D4D',
                          cursor: 'pointer',
                          fontFamily: 'Rajdhani, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Play size={16} /> Çalıştır
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const newExpanded = new Set(expandedPlaybooks);
                        if (newExpanded.has(cp.id)) {
                          newExpanded.delete(cp.id);
                        } else {
                          newExpanded.add(cp.id);
                        }
                        setExpandedPlaybooks(newExpanded);
                      }}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255, 77, 77, 0.1)',
                        border: '1px solid #FF4D4D',
                        borderRadius: '4px',
                        color: '#FF4D4D',
                        cursor: 'pointer',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px'
                      }}
                    >
                      {isExpanded ? 'Gizle' : 'Tüm Adımlar'}
                    </button>
                    {canManagePlaybooks && (
                      <>
                        {isCompleted && (
                          <button
                            onClick={() => handleOpenPlaybookExecution(cp)}
                            style={{
                              padding: '8px',
                              background: 'rgba(255, 77, 77, 0.1)',
                              border: '1px solid #FF4D4D',
                              borderRadius: '4px',
                              color: '#FF4D4D',
                              cursor: 'pointer'
                            }}
                            title="Düzenle"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemovePlaybook(cp.id)}
                          style={{
                            padding: '8px',
                            background: 'rgba(255, 77, 77, 0.1)',
                            border: '1px solid #FF4D4D',
                            borderRadius: '4px',
                            color: '#FF4D4D',
                            cursor: 'pointer'
                          }}
                          title="Kaldır"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {isExpanded && cp.steps && cp.steps.length > 0 && (
                  <div style={{ 
                    marginTop: '12px',
                    background: '#0F1115',
                    border: '1px solid #2A2F38',
                    borderRadius: '8px',
                    padding: '20px'
                  }}>
                    <h4 style={{ 
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#FF4D4D',
                      marginBottom: '16px'
                    }}>
                      Tüm Adımlar ve Yorumlar
                    </h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {cp.steps.map((step, stepIndex) => {
                        const stepState = execution?.step_states?.[stepIndex] || { checklist: [], comment: '' };
                        const isStepCompleted = stepState.checklist?.length === (step.checklist?.length || 0) && step.checklist?.length > 0;
                        
                        return (
                          <div
                            key={stepIndex}
                            style={{
                              background: '#1E2229',
                              border: '1px solid #2A2F38',
                              borderRadius: '4px',
                              padding: '16px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                              <h5 style={{ 
                                fontFamily: 'Rajdhani, sans-serif',
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#FF4D4D',
                                margin: 0
                              }}>
                                Adım {stepIndex + 1}: {step.title || `Adım ${stepIndex + 1}`}
                                {isStepCompleted && (
                                  <span style={{ marginLeft: '8px', color: '#4CAF50' }}>✓</span>
                                )}
                              </h5>
                            </div>
                            
                            {step.description && (
                              <p style={{ 
                                color: '#9CA3AF', 
                                fontSize: '14px', 
                                marginBottom: '12px',
                                fontFamily: 'Rajdhani, sans-serif',
                                lineHeight: '1.6'
                              }}>
                                {step.description}
                              </p>
                            )}
                            
                            {step.checklist && step.checklist.length > 0 && (
                              <div style={{ marginBottom: '12px' }}>
                                <p style={{ 
                                  color: '#E0E6ED', 
                                  fontSize: '13px', 
                                  fontFamily: 'Rajdhani, sans-serif',
                                  fontWeight: 600,
                                  marginBottom: '8px'
                                }}>
                                  Checklist:
                                </p>
                                <ul style={{ 
                                  margin: 0, 
                                  paddingLeft: '20px', 
                                  color: '#E0E6ED', 
                                  fontSize: '13px', 
                                  fontFamily: 'Rajdhani, sans-serif',
                                  lineHeight: '1.8'
                                }}>
                                  {step.checklist.map((item, itemIndex) => {
                                    const isChecked = stepState.checklist?.includes(itemIndex) || false;
                                    return (
                                      <li key={itemIndex} style={{ 
                                        textDecoration: isChecked ? 'line-through' : 'none',
                                        color: isChecked ? '#9CA3AF' : '#E0E6ED'
                                      }}>
                                        {isChecked && '✓ '}{item}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                            
                            {stepState.comment && (
                              <div style={{ 
                                marginTop: '12px',
                                padding: '12px',
                                background: '#0F1115',
                                border: '1px solid #2A2F38',
                                borderRadius: '4px'
                              }}>
                                <p style={{ 
                                  color: '#E0E6ED', 
                                  fontSize: '13px', 
                                  fontFamily: 'Rajdhani, sans-serif',
                                  fontWeight: 600,
                                  marginBottom: '6px'
                                }}>
                                  Yorum:
                                </p>
                                <p style={{ 
                                  color: '#9CA3AF', 
                                  fontSize: '13px', 
                                  fontFamily: 'Rajdhani, sans-serif',
                                  lineHeight: '1.6',
                                  margin: 0
                                }}>
                                  {stepState.comment}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Playbook Modal */}
      {showAddPlaybookModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowAddPlaybookModal(false)}
        >
          <div
            style={{
              background: '#1E2229',
              border: '1px solid #2A2F38',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '20px', fontWeight: 700, color: '#E0E6ED' }}>
                Playbook Ekle
              </h3>
              <button
                onClick={() => setShowAddPlaybookModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '8px', maxHeight: '400px', overflow: 'auto' }}>
              {allPlaybooks
                .filter(pb => !casePlaybooks.some(cp => cp.playbook_id === pb.id))
                .map((playbook) => (
                  <button
                    key={playbook.id}
                    onClick={() => handleAddPlaybook(playbook.id)}
                    style={{
                      padding: '12px',
                      background: '#0F1115',
                      border: '1px solid #2A2F38',
                      borderRadius: '4px',
                      color: '#E0E6ED',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'Rajdhani, sans-serif',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF4D4D';
                      e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#2A2F38';
                      e.currentTarget.style.background = '#0F1115';
                    }}
                  >
                    {playbook.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Playbook Execution Modal */}
      {showPlaybookExecutionModal && selectedCasePlaybook && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '20px'
          }}
          onClick={() => {
            handleUpdateExecution();
            setShowPlaybookExecutionModal(false);
          }}
        >
          <div
            style={{
              background: '#1E2229',
              border: '1px solid #2A2F38',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '24px', fontWeight: 700, color: '#E0E6ED' }}>
                {selectedCasePlaybook.name}
              </h3>
              <button
                onClick={() => {
                  handleUpdateExecution();
                  setShowPlaybookExecutionModal(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {selectedCasePlaybook.steps && selectedCasePlaybook.steps.length > 0 && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                      style={{
                        padding: '8px 16px',
                        background: currentStepIndex === 0 ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255, 77, 77, 0.2)',
                        border: '1px solid #FF4D4D',
                        borderRadius: '4px',
                        color: '#FF4D4D',
                        cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        opacity: currentStepIndex === 0 ? 0.5 : 1
                      }}
                    >
                      <ChevronLeft size={18} /> Geri
                    </button>
                    
                    <div style={{ 
                      color: '#FF4D4D', 
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px'
                    }}>
                      Adım {currentStepIndex + 1} / {selectedCasePlaybook.steps.length}
                    </div>
                    
                    {currentStepIndex >= selectedCasePlaybook.steps.length - 1 ? (
                      <button
                        onClick={async () => {
                          await handleUpdateExecution();
                          if (playbookExecution) {
                            try {
                              await playbookExecutionAPI.complete(playbookExecution.id);
                            } catch (error) {
                              console.error('Failed to complete execution:', error);
                            }
                          }
                          setShowPlaybookExecutionModal(false);
                          fetchCasePlaybooks();
                        }}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(255, 77, 77, 0.2)',
                          border: '1px solid #FF4D4D',
                          borderRadius: '4px',
                          color: '#FF4D4D',
                          cursor: 'pointer',
                          fontFamily: 'Rajdhani, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        Bitir <CheckCircle size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={handleNextStep}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(255, 77, 77, 0.2)',
                          border: '1px solid #FF4D4D',
                          borderRadius: '4px',
                          color: '#FF4D4D',
                          cursor: 'pointer',
                          fontFamily: 'Rajdhani, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        İleri <ChevronRight size={18} />
                      </button>
                    )}
                  </div>

                  <div style={{
                    background: '#0F1115',
                    border: '1px solid #2A2F38',
                    borderRadius: '4px',
                    padding: '20px'
                  }}>
                    <h4 style={{ 
                      fontFamily: 'Rajdhani, sans-serif', 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: '#FF4D4D',
                      marginBottom: '12px'
                    }}>
                      {selectedCasePlaybook.steps[currentStepIndex]?.title || `Adım ${currentStepIndex + 1}`}
                    </h4>
                    
                    {selectedCasePlaybook.steps[currentStepIndex]?.description && (
                      <p style={{ 
                        color: '#9CA3AF', 
                        fontSize: '14px', 
                        marginBottom: '16px',
                        fontFamily: 'Rajdhani, sans-serif',
                        lineHeight: '1.6'
                      }}>
                        {selectedCasePlaybook.steps[currentStepIndex].description}
                      </p>
                    )}

                    {selectedCasePlaybook.steps[currentStepIndex]?.checklist && 
                     selectedCasePlaybook.steps[currentStepIndex].checklist.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ 
                          color: '#E0E6ED', 
                          fontSize: '14px', 
                          fontFamily: 'Rajdhani, sans-serif',
                          fontWeight: 600,
                          marginBottom: '12px'
                        }}>
                          Checklist:
                        </p>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {selectedCasePlaybook.steps[currentStepIndex].checklist.map((item, itemIndex) => {
                            const currentStepState = stepStates[currentStepIndex] || { checklist: [] };
                            const isChecked = currentStepState.checklist?.includes(itemIndex) || false;
                            
                            return (
                              <label
                                key={itemIndex}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  padding: '10px',
                                  background: '#1E2229',
                                  border: '1px solid #2A2F38',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#FF4D4D';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#2A2F38';
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleChecklistToggle(itemIndex)}
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer',
                                    accentColor: '#FF4D4D'
                                  }}
                                />
                                <span style={{ 
                                  color: isChecked ? '#9CA3AF' : '#E0E6ED',
                                  fontSize: '14px',
                                  fontFamily: 'Rajdhani, sans-serif',
                                  textDecoration: isChecked ? 'line-through' : 'none'
                                }}>
                                  {item}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        color: '#E0E6ED', 
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px'
                      }}>
                        Yorum:
                      </label>
                      <textarea
                        value={stepComment}
                        onChange={(e) => {
                          setStepComment(e.target.value);
                          handleUpdateExecution();
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#0F1115',
                          border: '1px solid #2A2F38',
                          borderRadius: '4px',
                          color: '#E0E6ED',
                          fontFamily: 'Rajdhani, sans-serif',
                          minHeight: '100px',
                          resize: 'vertical'
                        }}
                        placeholder="Bu adım için yorum ekleyin..."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaybooksTab;

