import React from 'react';
import UserCard from './UserCard';

const UserList = ({ users, onUpdate, onDelete }) => {
  if (users.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted">No users found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th className="text-right">Role</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <UserCard
              key={u.id}
              userData={u}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
