const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kargu_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const initDB = async () => {
  try {
    // Users table (must be created first)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role VARCHAR(1) DEFAULT '0',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Roles Name table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        rolename VARCHAR(30) UNIQUE NOT NULL
      )
    `);

    // Cases table (must be created before comments, tasks, etc.)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cases (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        severity VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'open',
        assigned_to INTEGER REFERENCES users(id),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        resolution_summary TEXT
      )
    `);

    // Comments table (depends on users and cases)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        case_id INT NOT NULL,
        comment TEXT NOT NULL,
        visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (case_id) REFERENCES cases(id)
      )
    `);

    // Add resolution_summary column if it doesn't exist (for existing databases)
    await pool.query(`
      ALTER TABLE cases 
      ADD COLUMN IF NOT EXISTS resolution_summary TEXT
    `);

    // Tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_to INTEGER REFERENCES users(id),
        assigned_to_name VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending',
        priority VARCHAR(20) DEFAULT 'medium',
        due_date DATE,
        result VARCHAR(20),
        comment TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Playbooks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS playbooks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        steps JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Case Playbooks table (case-playbook ilişkisi)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_playbooks (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        playbook_id INTEGER NOT NULL REFERENCES playbooks(id) ON DELETE CASCADE,
        added_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(case_id, playbook_id)
      )
    `);

    // Playbook Executions table (execution state, checklist, yorumlar)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS playbook_executions (
        id SERIAL PRIMARY KEY,
        case_playbook_id INTEGER NOT NULL REFERENCES case_playbooks(id) ON DELETE CASCADE,
        current_step_index INTEGER DEFAULT 0,
        step_states JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Case AI Summaries table (for storing OpenAI analysis results)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_ai_summaries (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        summary TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(case_id)
      )
    `);

    // Case Forensic Files table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_forensic_files (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        filepath VARCHAR(500) NOT NULL,
        file_type VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Case Network Connections table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_network_connections (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        local_address VARCHAR(100),
        remote_address VARCHAR(100),
        protocol VARCHAR(10),
        state VARCHAR(20),
        process_name VARCHAR(255),
        pid INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Case Process Trees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_process_trees (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        process_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Creating Role Names
    await pool.query(`
      INSERT INTO roles (rolename)
      VALUES
        ('Viewer'),
        ('Investigator'),
        ('Incident Responder'),
        ('Admin')
      ON CONFLICT (rolename) DO NOTHING;
    `);

    // Create default admin user
    const bcrypt = require('bcryptjs');
    const adminCheck = await pool.query('SELECT * FROM users WHERE username = $1', ['admin']);
    
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (username, email, password, full_name, role) VALUES ($1, $2, $3, $4, $5)',
        ['admin', 'admin@kargu.com', hashedPassword, 'System Admin', '4']
      );
      console.log('✓ Default admin user created (username: admin, password: admin123)');
    }

    console.log('✓ Database initialized successfully');
  } catch (err) {
    console.error('✗ Database initialization error:', err);
    throw err;
  }

 
};

module.exports = { pool, initDB };