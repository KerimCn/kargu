import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CaseList from '../components/cases/CaseList';
import CreateCaseModal from '../components/cases/CreateCaseModal';
import CaseDetailPage from './CaseDetailPage';
import { caseAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CasesPage = ({ initialCaseId, onCaseViewChange, initialTab }) => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId || null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'open', 'resolved'

  // Kullanıcının admin olup olmadığını kontrol et
  const isAdmin = user?.role;
  let adminControl = false;

  if (isAdmin === '3' || isAdmin === '4'){
    adminControl = true;
  }
  

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
    try {
      const [casesData, usersData] = await Promise.all([
        caseAPI.getAll(),
        userAPI.getAll()
      ]);
      setCases(casesData);
      setUsers(usersData);
      applyFilter(casesData, statusFilter);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (casesData, filter) => {
    let filtered = [];
    switch (filter) {
      case 'open':
        filtered = casesData.filter(c => c.status !== 'resolved');
        break;
      case 'resolved':
        filtered = casesData.filter(c => c.status === 'resolved');
        break;
      default:
        filtered = casesData;
    }
    setFilteredCases(filtered);
  };

  useEffect(() => {
    applyFilter(cases, statusFilter);
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

  const handleCreateCase = async (formData) => {
    if (!adminControl) {
      alert('Only admins can create cases');
      return;
    }

    try {
      await caseAPI.create(formData);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create case:', error);
      alert('Failed to create case');
    }
  };

  const handleUpdateCase = async (id, updates) => {
    if (!adminControl) {
      alert('Only admins can update cases');
      return;
    }

    try {
      await caseAPI.update(id, updates);
      fetchData();
    } catch (error) {
      console.error('Failed to update case:', error);
      alert('Failed to update case');
    }
  };

  const handleDeleteCase = async (id) => {
    if (!adminControl) {
      alert('Only admins can delete cases');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this case?')) return;
    
    try {
      await caseAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete case:', error);
      alert('Failed to delete case');
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
            borderBottom: '1px solid #2A2F38',
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
              color: statusFilter === 'all' ? '#FF4D4D' : '#9CA3AF',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== 'all') {
                e.currentTarget.style.borderColor = '#2A2F38';
                e.currentTarget.style.color = '#E0E6ED';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== 'all') {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
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
              color: statusFilter === 'open' ? '#FF4D4D' : '#9CA3AF',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== 'open') {
                e.currentTarget.style.borderColor = '#2A2F38';
                e.currentTarget.style.color = '#E0E6ED';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== 'open') {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
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
              color: statusFilter === 'resolved' ? '#FF4D4D' : '#9CA3AF',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== 'resolved') {
                e.currentTarget.style.borderColor = '#2A2F38';
                e.currentTarget.style.color = '#E0E6ED';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== 'resolved') {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
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
          isAdmin={isAdmin}
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