import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import UserList from '../components/users/UserList';
import CreateUserModal from '../components/users/CreateUserModal';
import { userAPI } from '../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      await userAPI.create(formData);
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user. Username or email may already exist.');
    }
  };

  const handleUpdateUser = async (id, updatedData) => {
  try {
    await userAPI.update(id, updatedData);

    // Modal kapatma UserCard içinde yapıldığı için burada gerek yok
    fetchUsers();
  } catch (error) {
    console.error('Failed to update user:', error);
    alert('Failed to update user');
  }
};


  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userAPI.delete(id);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-3xl font-bold" 
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          USER MANAGEMENT
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> ADD USER
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading users...</p>
      ) : (
        <UserList users={users} onDelete={handleDeleteUser} onUpdate={handleUpdateUser} />
      )}

      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
};

export default UsersPage;