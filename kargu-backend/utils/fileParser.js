const fs = require('fs');
const path = require('path');
const { parseString } = require('xml2js');
const csv = require('csv-parser');
const { Readable } = require('stream');

const parseFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  try {
    if (ext === '.json') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } else if (ext === '.xml') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return new Promise((resolve, reject) => {
        parseString(fileContent, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    } else if (ext === '.csv') {
      return new Promise((resolve, reject) => {
        const results = [];
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
          resolve([]);
          return;
        }
        
        // Header'ı al
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Data satırlarını parse et
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          results.push(row);
        }
        
        resolve(results);
      });
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error(`Error parsing file: ${error.message}`);
  }
};

module.exports = { parseFile };
