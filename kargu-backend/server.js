require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/database');
const morgan = require('morgan');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const caseRoutes = require('./routes/caseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const commentRoutes = require('./routes/commentController');
const taskRoutes = require('./routes/taskRoutes');
const playbookRoutes = require('./routes/playbookRoutes');
const casePlaybookRoutes = require('./routes/casePlaybookRoutes');
const playbookExecutionRoutes = require('./routes/playbookExecutionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('==============================');
  console.log('➡️  REQUEST');
  console.log('METHOD:', req.method);
  console.log('URL:', req.originalUrl);

  if (Object.keys(req.params || {}).length) {
    console.log('PARAMS:', req.params);
  }

  if (Object.keys(req.query || {}).length) {
    console.log('QUERY:', req.query);
  }

  if (Object.keys(req.body || {}).length) {
    console.log('BODY:', req.body);
  }

  console.log('==============================');
  next();
});


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/playbooks', playbookRoutes);
app.use('/api/case-playbooks', casePlaybookRoutes);
app.use('/api/playbook-executions', playbookExecutionRoutes);
app.use('/api/notifications', notificationRoutes);
console.log('✓ Task routes loaded');
console.log('✓ Playbook routes loaded');
console.log('✓ Case playbook routes loaded');
console.log('✓ Playbook execution routes loaded');
console.log('✓ Notification routes loaded');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'KARGU API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});



// Initialize database and start server
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
Server running on port ${PORT}        
http://localhost:${PORT}              
      `);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });