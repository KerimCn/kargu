import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CaseList from '../components/cases/CaseList';
import CreateCaseModal from '../components/cases/CreateCaseModal';
import CaseDetailPage from './CaseDetailPage';
import { caseAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CasesPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  // Kullanıcının admin olup olmadığını kontrol et
  const isAdmin = user?.role;
  let adminControl = false;

  if (isAdmin === '3' || isAdmin === '4'){
    adminControl = true;
  }
  

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
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (caseId) => {
    setSelectedCaseId(caseId);
  };

  const handleBackToCases = () => {
    setSelectedCaseId(null);
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
    return <CaseDetailPage caseId={selectedCaseId} onBack={handleBackToCases} />;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
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

      {loading ? (
        <p className="text-muted">Loading cases...</p>
      ) : (
        <CaseList 
          cases={cases} 
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