const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (err) {
      console.error('Get users error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error('Get user error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createUser(req, res) {
    try {
      const { username, email, password, full_name, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        full_name,
        role
      });

      res.status(201).json(user);
    } catch (err) {
      console.error('Create user error:', err);
      
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateUser(req, res) {
    try {
      const updates = {};

      if (req.body.email) updates.email = req.body.email;
      if (req.body.full_name) updates.full_name = req.body.full_name;
      if (req.body.role) updates.role = req.body.role;
      if (req.body.password) {
        updates.password = await bcrypt.hash(req.body.password, 10);
      }

      const user = await UserModel.update(req.params.id, updates);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error('Update user error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserModel.delete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Delete user error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updates = {};

      // Only allow updating full_name and password
      // Username, email, and role cannot be changed
      if (req.body.full_name !== undefined) {
        updates.full_name = req.body.full_name;
      }
      if (req.body.password) {
        updates.password = await bcrypt.hash(req.body.password, 10);
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      const user = await UserModel.update(userId, updates);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = UserController;