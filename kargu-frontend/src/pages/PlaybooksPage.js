import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, PlusCircle, MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { playbookAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PlaybooksPage = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [playbooks, setPlaybooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPlaybooks, setExpandedPlaybooks] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    steps: []
  });

  // Admin kontrolü
  const isAdmin = user?.role === '3' || user?.role === '4';

  useEffect(() => {
    if (isAdmin) {
      fetchPlaybooks();
    }
  }, [isAdmin]);

  const fetchPlaybooks = async () => {
    try {
      const data = await playbookAPI.getAll();
      setPlaybooks(data);
    } catch (error) {
      console.error('Failed to fetch playbooks:', error);
      if (error.message.includes('Only admins')) {
        alert('Only admins can access playbooks');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      steps: []
    });
  };

  const handleCreateClick = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (playbook) => {
    setSelectedPlaybook(playbook);
    setFormData({
      name: playbook.name,
      steps: playbook.steps || []
    });
    setShowEditModal(true);
  };

  const handleCreatePlaybook = async () => {
    if (!formData.name.trim()) {
      alert('Playbook adı gereklidir');
      return;
    }

    try {
      await playbookAPI.create(formData);
      setShowModal(false);
      resetForm();
      fetchPlaybooks();
    } catch (error) {
      console.error('Failed to create playbook:', error);
      alert('Failed to create playbook');
    }
  };

  const handleUpdatePlaybook = async () => {
    if (!formData.name.trim()) {
      alert('Playbook adı gereklidir');
      return;
    }

    try {
      await playbookAPI.update(selectedPlaybook.id, formData);
      setShowEditModal(false);
      setSelectedPlaybook(null);
      resetForm();
      fetchPlaybooks();
    } catch (error) {
      console.error('Failed to update playbook:', error);
      alert('Failed to update playbook');
    }
  };

  const handleDeletePlaybook = async (id) => {
    if (!window.confirm('Bu playbook\'u silmek istediğinizden emin misiniz?')) return;
    
    try {
      await playbookAPI.delete(id);
      fetchPlaybooks();
    } catch (error) {
      console.error('Failed to delete playbook:', error);
      alert('Failed to delete playbook');
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { title: '', description: '', checklist: [] }]
    });
  };

  const removeStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const addChecklistItem = (stepIndex) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex].checklist = [...(newSteps[stepIndex].checklist || []), ''];
    setFormData({ ...formData, steps: newSteps });
  };

  const removeChecklistItem = (stepIndex, itemIndex) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex].checklist = newSteps[stepIndex].checklist.filter((_, i) => i !== itemIndex);
    setFormData({ ...formData, steps: newSteps });
  };

  const updateChecklistItem = (stepIndex, itemIndex, value) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex].checklist[itemIndex] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const togglePlaybook = (playbookId) => {
    const newExpanded = new Set(expandedPlaybooks);
    if (newExpanded.has(playbookId)) {
      newExpanded.delete(playbookId);
    } else {
      newExpanded.add(playbookId);
    }
    setExpandedPlaybooks(newExpanded);
  };

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Erişim Reddedildi
          </h2>
          <p className="text-muted">
            Bu sayfaya sadece admin kullanıcılar erişebilir.
          </p>
        </div>
      </div>
    );
  }

  const renderModal = (isEdit = false) => (
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
      onClick={() => {
        if (isEdit) {
          setShowEditModal(false);
        } else {
          setShowModal(false);
        }
        resetForm();
      }}
    >
      <div
        style={{
          background: '#1E2229',
          border: '1px solid #2A2F38',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '24px', fontWeight: 700, color: isDark ? '#E0E6ED' : '#000000' }}>
            {isEdit ? 'Playbook Düzenle' : 'Yeni Playbook Oluştur'}
          </h3>
          <button
            onClick={() => {
              if (isEdit) {
                setShowEditModal(false);
              } else {
                setShowModal(false);
              }
              resetForm();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDark ? '#9CA3AF' : '#1A1A1A',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: isDark ? '#E0E6ED' : '#000000', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
            Playbook Adı *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              background: '#0F1115',
              border: '1px solid #2A2F38',
              borderRadius: '4px',
              color: isDark ? '#E0E6ED' : '#000000',
              fontFamily: 'Rajdhani, sans-serif'
            }}
            placeholder="Playbook adını girin"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ color: isDark ? '#E0E6ED' : '#000000', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
              Adımlar
            </label>
            <button
              onClick={addStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
              <PlusCircle size={18} /> Adım Ekle
            </button>
          </div>

          {formData.steps.map((step, stepIndex) => (
            <div
              key={stepIndex}
              style={{
                background: '#0F1115',
                border: '1px solid #2A2F38',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ color: '#FF4D4D', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '16px' }}>
                  Adım {stepIndex + 1}
                </h4>
                <button
                  onClick={() => removeStep(stepIndex)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FF4D4D',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <MinusCircle size={20} />
                </button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}>
                  Başlık
                </label>
                <input
                  type="text"
                  value={step.title || ''}
                  onChange={(e) => updateStep(stepIndex, 'title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1E2229',
                    border: '1px solid #2A2F38',
                    borderRadius: '4px',
                    color: isDark ? '#E0E6ED' : '#000000',
                    fontFamily: 'Rajdhani, sans-serif'
                  }}
                  placeholder="Adım başlığı"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}>
                  Açıklama
                </label>
                <textarea
                  value={step.description || ''}
                  onChange={(e) => updateStep(stepIndex, 'description', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1E2229',
                    border: '1px solid #2A2F38',
                    borderRadius: '4px',
                    color: isDark ? '#E0E6ED' : '#000000',
                    fontFamily: 'Rajdhani, sans-serif',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Adım açıklaması"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ color: '#E0E6ED', fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}>
                    Checklist
                  </label>
                  <button
                    onClick={() => addChecklistItem(stepIndex)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      background: 'rgba(255, 77, 77, 0.1)',
                      border: '1px solid #FF4D4D',
                      borderRadius: '4px',
                      color: '#FF4D4D',
                      cursor: 'pointer',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    <Plus size={14} /> Ekle
                  </button>
                </div>
                {(step.checklist || []).map((item, itemIndex) => (
                  <div key={itemIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateChecklistItem(stepIndex, itemIndex, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        background: '#1E2229',
                        border: '1px solid #2A2F38',
                        borderRadius: '4px',
                        color: isDark ? '#E0E6ED' : '#000000',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '13px'
                      }}
                      placeholder="Checklist öğesi"
                    />
                    <button
                      onClick={() => removeChecklistItem(stepIndex, itemIndex)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#FF4D4D',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              if (isEdit) {
                setShowEditModal(false);
              } else {
                setShowModal(false);
              }
              resetForm();
            }}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid #2A2F38',
              borderRadius: '4px',
              color: isDark ? '#9CA3AF' : '#1A1A1A',
              cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600
            }}
          >
            İptal
          </button>
          <button
            onClick={isEdit ? handleUpdatePlaybook : handleCreatePlaybook}
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid #FF4D4D',
              borderRadius: '4px',
              color: '#FF4D4D',
              cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600
            }}
          >
            {isEdit ? 'Güncelle' : 'Oluştur'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 
            className="text-3xl font-bold" 
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            PLAYBOOKS
          </h2>
          <button
            onClick={handleCreateClick}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> NEW PLAYBOOK
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading playbooks...</p>
      ) : playbooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
          <p>Henüz playbook oluşturulmamış.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {playbooks.map((playbook) => {
            const isExpanded = expandedPlaybooks.has(playbook.id);
            return (
              <div
                key={playbook.id}
                style={{
                  background: '#1E2229',
                  border: '1px solid #2A2F38',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                {/* Header - Tıklanabilir */}
                <div
                  onClick={() => togglePlaybook(playbook.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    background: isExpanded ? 'rgba(255, 77, 77, 0.05)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.background = 'rgba(255, 77, 77, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      color: isExpanded ? '#FF4D4D' : '#9CA3AF',
                      transition: 'transform 0.3s, color 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      <ChevronDown size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontFamily: 'Rajdhani, sans-serif', 
                        fontSize: '18px', 
                        fontWeight: 700, 
                        color: isDark ? '#E0E6ED' : '#000000', 
                        marginBottom: '4px',
                        margin: 0
                      }}>
                        {playbook.name}
                      </h3>
                      <p style={{ 
                        color: isDark ? '#9CA3AF' : '#1A1A1A', 
                        fontSize: '13px', 
                        fontFamily: 'Rajdhani, sans-serif',
                        margin: 0
                      }}>
                        {playbook.steps?.length || 0} adım
                      </p>
                    </div>
                  </div>
                  <div 
                    style={{ display: 'flex', gap: '8px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleEditClick(playbook)}
                      style={{
                        padding: '8px',
                        background: 'rgba(255, 77, 77, 0.1)',
                        border: '1px solid #FF4D4D',
                        borderRadius: '4px',
                        color: '#FF4D4D',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 77, 77, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)';
                      }}
                      title="Düzenle"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeletePlaybook(playbook.id)}
                      style={{
                        padding: '8px',
                        background: 'rgba(255, 77, 77, 0.1)',
                        border: '1px solid #FF4D4D',
                        borderRadius: '4px',
                        color: '#FF4D4D',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 77, 77, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)';
                      }}
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Content - Açılır/Kapanır */}
                <div
                  style={{
                    maxHeight: isExpanded ? '5000px' : '0',
                    overflow: isExpanded ? 'auto' : 'hidden',
                    transition: 'max-height 0.3s ease-in-out',
                    borderTop: isExpanded ? '1px solid #2A2F38' : 'none'
                  }}
                >
                  <div style={{ padding: '20px', paddingBottom: '50px' }}>
                    {(playbook.steps || []).length > 0 ? (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {(playbook.steps || []).map((step, index) => (
                          <div
                            key={index}
                            style={{
                              background: '#0F1115',
                              border: '1px solid #2A2F38',
                              borderRadius: '4px',
                              padding: '16px'
                            }}
                          >
                            <h4 style={{ 
                              fontFamily: 'Rajdhani, sans-serif', 
                              fontSize: '16px', 
                              fontWeight: 600, 
                              color: '#FF4D4D', 
                              marginBottom: '12px'
                            }}>
                              {step.title || `Adım ${index + 1}`}
                            </h4>
                            {step.description && (
                              <p style={{ 
                                color: isDark ? '#9CA3AF' : '#1A1A1A', 
                                fontSize: '14px', 
                                marginBottom: step.checklist && step.checklist.length > 0 ? '12px' : '0',
                                fontFamily: 'Rajdhani, sans-serif',
                                lineHeight: '1.6'
                              }}>
                                {step.description}
                              </p>
                            )}
                            {step.checklist && step.checklist.length > 0 && (
                              <div style={{ marginTop: step.description ? '12px' : '0' }}>
                                <p style={{ 
                                  color: isDark ? '#E0E6ED' : '#000000', 
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
                                  color: isDark ? '#E0E6ED' : '#000000', 
                                  fontSize: '13px', 
                                  fontFamily: 'Rajdhani, sans-serif',
                                  lineHeight: '1.8'
                                }}>
                                  {step.checklist.map((item, itemIndex) => (
                                    <li key={itemIndex} style={{ marginBottom: '4px' }}>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ 
                        color: isDark ? '#9CA3AF' : '#1A1A1A', 
                        fontSize: '14px', 
                        fontFamily: 'Rajdhani, sans-serif',
                        textAlign: 'center',
                        padding: '20px'
                      }}>
                        Bu playbook'ta henüz adım bulunmuyor.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && renderModal(false)}
      {showEditModal && renderModal(true)}
    </div>
  );
};

export default PlaybooksPage;

