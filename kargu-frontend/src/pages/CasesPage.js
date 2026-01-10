import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CaseList from '../components/cases/CaseList';
import CreateCaseModal from '../components/cases/CreateCaseModal';
import CaseDetailPage from './CaseDetailPage';
import { CaseController } from '../controllers/caseController';
import { UserController } from '../controllers/userController';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const CasesPage = ({ initialCaseId, onCaseViewChange, initialTab }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId || null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'open', 'resolved'

  // Kullanıcının admin olup olmadığını kontrol et
  const adminControl = UserController.checkIsAdmin(user);
  

  useEffect(() => {
    if (initialCaseId && initialCaseId !== selectedCaseId) {
      setSelectedCaseId(initialCaseId);
    }
  }, [initialCaseId, selectedCaseId]);

  useEffect(() => {
    if (!selectedCaseId) {
      fetchData();
    }
  }, [selectedCaseId]);

  const fetchData = async () => {
    setLoading(true);
    const [casesResult, usersResult] = await Promise.all([
      CaseController.getAllCases(),
      UserController.getAllUsers()
    ]);
    
    if (casesResult.success) {
      setCases(casesResult.data);
    } else {
      console.error('Failed to fetch cases:', casesResult.error);
      alert(casesResult.error || 'Failed to fetch cases');
    }
    
    if (usersResult.success) {
      setUsers(usersResult.data);
    } else {
      console.error('Failed to fetch users:', usersResult.error);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    const filtered = CaseController.filterCasesByStatus(cases, statusFilter);
    setFilteredCases(filtered);
  }, [statusFilter, cases]);

  const handleViewDetail = (caseId) => {
    setSelectedCaseId(caseId);
    if (onCaseViewChange) {
      onCaseViewChange(caseId);
    }
  };

  const handleBackToCases = () => {
    setSelectedCaseId(null);
    if (onCaseViewChange) {
      onCaseViewChange(null);
    }
    fetchData();
  };

  const handleCreateCase = async (formData, file) => {
    if (!adminControl) {
      alert('Only admins can create cases');
      return;
    }

    const result = await CaseController.createCase(formData, file);
    if (result.success) {
      setShowModal(false);
      fetchData();
    } else {
      alert(result.error || 'Failed to create case');
    }
  };

  const handleUpdateCase = async (id, updates) => {
    const result = await CaseController.updateCase(id, updates);
    if (result.success) {
      fetchData();
    } else {
      alert(result.error || 'Failed to update case');
    }
  };

  const handleDeleteCase = async (id) => {
    if (!adminControl) {
      alert('Only admins can delete cases');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this case?')) return;
    
    const result = await CaseController.deleteCase(id);
    if (result.success) {
      fetchData();
    } else {
      alert(result.error || 'Failed to delete case');
    }
  };

  // Detay sayfası gösteriliyorsa
  if (selectedCaseId) {
    return <CaseDetailPage caseId={selectedCaseId} onBack={handleBackToCases} initialTab={initialTab} />;
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 
              className="text-3xl font-bold" 
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              INCIDENT CASES
            </h2>
            {!adminControl && (
              <p className="text-sm text-muted mt-2">
                View-only mode. Contact an administrator to create or modify cases.
              </p>
            )}
          </div>
          
          {/* Sadece admin ise "NEW CASE" butonu göster */}
          {adminControl && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} /> NEW CASE
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div 
          className="flex gap-2"
          style={{
            borderBottom: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
            paddingBottom: '12px'
          }}
        >
          <button
            onClick={() => setStatusFilter('all')}
            className="px-4 py-2"
            style={{
              background: statusFilter === 'all' ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
              border: statusFilter === 'all' ? '1px solid #FF4D4D' : '1px solid transparent',
              borderRadius: '4px',
              color: statusFilter === 'all' ? '#FF4D4D' : (isDark ? '#9CA3AF' : '#000000'),
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== 'all') {
                e.currentTarget.style.borderColor = isDark ? '#2A2F38' : '#E2E8F0';
                e.currentTarget.style.color = isDark ? '#E0E6ED' : '#1A1F2E';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== 'all') {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = isDark ? '#9CA3AF' : '#000000';
              }
            }}
          >
            Tümü
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className="px-4 py-2"
            style={{
              background: statusFilter === 'open' ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
              border: statusFilter === 'open' ? '1px solid #FF4D4D' : '1px solid transparent',
              borderRadius: '4px',
              color: statusFilter === 'open' ? '#FF4D4D' : (isDark ? '#9CA3AF' : '#404040'),
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== 'open') {
                e.currentTarget.style.borderColor = isDark ? '#2A2F38' : '#E2E8F0';
                e.currentTarget.style.color = isDark ? '#E0E6ED' : '#1A1F2E';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== 'open') {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = isDark ? '#9CA3AF' : '#000000';
              }
            }}
          >
            Devam Eden
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className="px-4 py-2"
            style={{
              background: statusFilter === 'resolved' ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
              border: statusFilter === 'resolved' ? '1px solid #FF4D4D' : '1px solid transparent',
              borderRadius: '4px',
              color: statusFilter === 'resolved' ? '#FF4D4D' : (isDark ? '#9CA3AF' : '#404040'),
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== 'resolved') {
                e.currentTarget.style.borderColor = isDark ? '#2A2F38' : '#E2E8F0';
                e.currentTarget.style.color = isDark ? '#E0E6ED' : '#1A1F2E';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== 'resolved') {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = isDark ? '#9CA3AF' : '#000000';
              }
            }}
          >
            Tamamlanmış
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading cases...</p>
      ) : (
        <CaseList 
          cases={filteredCases} 
          onUpdate={handleUpdateCase} 
          onDelete={handleDeleteCase}
          onViewDetail={handleViewDetail}
          isAdmin={user?.role}
          currentUserId={user?.id}
        />
      )}

      {/* Modal sadece admin için */}
      {adminControl && (
        <CreateCaseModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={handleCreateCase}
          users={users}
        />
      )}
    </div>
  );
};

export default CasesPage;