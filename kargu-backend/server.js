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
const aiRoutes = require('./routes/aiRoutes');
const forensicRoutes = require('./routes/forensicRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Morgan logging middleware - detaylı request logging için
app.use(morgan('dev'));

// CORS configuration - hem localhost hem de production deployment için
const corsOptions = {
  origin: [
    'https://kargu.vercel.app',  // Vercel frontend URL
    'http://localhost:3000',     // Local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Preflight requests için (aynı options ile)
app.options('*', cors(corsOptions));

// Middleware
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
app.use('/api/ai', aiRoutes);
app.use('/api/forensic', forensicRoutes);
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