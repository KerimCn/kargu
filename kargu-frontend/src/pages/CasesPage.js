import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CaseList from '../components/cases/CaseList';
import CreateCaseModal from '../components/cases/CreateCaseModal';
import { caseAPI, userAPI } from '../services/api';
import { useAuth} from '../context/AuthContext';

const CasesPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  //Control User Permission 1-2 = Viewer & Investigator 2-3 IR & Admin
  const isAdmin = user.role;

    console.log('CasesPage - User:', user); // Debug için
  console.log('CasesPage - isAdmin:', isAdmin); // Debug için


  useEffect(() => {
    fetchData();
  }, []);

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

  const handleCreateCase = async (formData) => {
    if (isAdmin === '1' || isAdmin === '2'){
      alert ('Case oluşturma yetkiniz bulunmamaktadır.');
      return;
    }
    try {
      await caseAPI.create(formData);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create case:', error);
      console.log(error);
      alert('Failed to create case');
    }
  };

  const handleUpdateCase = async (id, updates) => {
     if (isAdmin === '1' ){
      alert ('Yetkiniz bulunmamaktadır.');
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
     if (isAdmin === '1' || isAdmin === '2'){
      alert ('Case oluşturma yetkiniz bulunmamaktadır.');
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

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-3xl font-bold" 
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          INCIDENT CASES
        </h2>
        {( isAdmin === '3' || isAdmin === '4') && (
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
          isAdmin={isAdmin}
        />
      )}

      <CreateCaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateCase}
        users={users}
      />
    </div>
  );
};

export default CasesPage;