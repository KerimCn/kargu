const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { parseFile } = require('../utils/fileParser');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Get forensic file data for a case (all files)
router.get('/cases/:caseId/file', authenticateToken, async (req, res) => {
  try {
    const { caseId } = req.params;

    // Get ALL forensic files for this case
    const fileResult = await pool.query(
      'SELECT id, filename, filepath, file_type, created_at FROM case_forensic_files WHERE case_id = $1 ORDER BY created_at DESC',
      [caseId]
    );

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Forensic file not found' });
    }

    // Parse all files and return with metadata
    const filesData = await Promise.all(
      fileResult.rows.map(async (file) => {
        if (!fs.existsSync(file.filepath)) {
          return null;
        }
        
        try {
          const fileData = await parseFile(file.filepath);
          
          // Extract hostname from metadata if available
          const hostname = fileData.metadata?.hostname || 
                          fileData.hostname || 
                          `Machine-${file.id}`;
          
          return {
            id: file.id,
            filename: file.filename,
            hostname: hostname,
            metadata: fileData.metadata || {},
            data: fileData,
            created_at: file.created_at
          };
        } catch (error) {
          console.error(`Error parsing file ${file.filename}:`, error);
          return null;
        }
      })
    );

    // Filter out null values (files that don't exist or failed to parse)
    const validFiles = filesData.filter(f => f !== null);
    
    if (validFiles.length === 0) {
      return res.status(404).json({ error: 'No valid forensic files found' });
    }
    
    res.json(validFiles);
  } catch (error) {
    console.error('Error getting forensic file:', error);
    res.status(500).json({ error: 'Failed to get forensic file data' });
  }
});

// Add artifact to existing case
router.post('/cases/:caseId/artifact', authenticateToken, upload.single('forensicFile'), async (req, res) => {
  try {
    const { caseId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if case exists
    const caseCheck = await pool.query('SELECT id FROM cases WHERE id = $1', [caseId]);
    if (caseCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const filePath = req.file.path;
    console.log(`Parsing artifact file: ${filePath} for case ${caseId}`);
    
    try {
      const fileData = await parseFile(filePath);
      console.log(`File parsed successfully. Keys: ${Object.keys(fileData).join(', ')}`);
      
      // Save file info to database
      const result = await pool.query(
        `INSERT INTO case_forensic_files (case_id, filename, filepath, file_type) 
         VALUES ($1, $2, $3, $4) RETURNING id, filename, filepath, file_type, created_at`,
        [caseId, req.file.filename, filePath, path.extname(req.file.originalname).substring(1)]
      );
      
      console.log(`Artifact saved for case ${caseId}: ${req.file.filename}`);

      // Extract hostname
      const hostname = fileData.metadata?.hostname || 
                      fileData.hostname || 
                      `Machine-${result.rows[0].id}`;

      res.json({
        id: result.rows[0].id,
        filename: result.rows[0].filename,
        hostname: hostname,
        metadata: fileData.metadata || {},
        data: fileData,
        created_at: result.rows[0].created_at
      });
    } catch (parseError) {
      // If parsing fails, still save the file but log the error
      console.error('Error parsing file:', parseError);
      const result = await pool.query(
        `INSERT INTO case_forensic_files (case_id, filename, filepath, file_type) 
         VALUES ($1, $2, $3, $4) RETURNING id, filename, filepath, file_type, created_at`,
        [caseId, req.file.filename, filePath, path.extname(req.file.originalname).substring(1)]
      );
      
      res.json({
        id: result.rows[0].id,
        filename: result.rows[0].filename,
        hostname: `Machine-${result.rows[0].id}`,
        metadata: {},
        data: {},
        created_at: result.rows[0].created_at,
        parseError: 'File uploaded but could not be parsed'
      });
    }
  } catch (error) {
    console.error('Error adding artifact:', error);
    res.status(500).json({ error: 'Failed to add artifact' });
  }
});

// Delete artifact from case
router.delete('/cases/:caseId/artifact/:fileId', authenticateToken, async (req, res) => {
  try {
    const { caseId, fileId } = req.params;

    // Check if case exists
    const caseCheck = await pool.query('SELECT id FROM cases WHERE id = $1', [caseId]);
    if (caseCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Get file info before deleting
    const fileResult = await pool.query(
      'SELECT id, filepath FROM case_forensic_files WHERE id = $1 AND case_id = $2',
      [fileId, caseId]
    );

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Forensic file not found' });
    }

    const filePath = fileResult.rows[0].filepath;

    // Delete file from filesystem if it exists
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (unlinkError) {
        console.error(`Error deleting file ${filePath}:`, unlinkError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await pool.query('DELETE FROM case_forensic_files WHERE id = $1 AND case_id = $2', [fileId, caseId]);

    res.json({ message: 'Artifact deleted successfully' });
  } catch (error) {
    console.error('Error deleting artifact:', error);
    res.status(500).json({ error: 'Failed to delete artifact' });
  }
});

module.exports = router;
