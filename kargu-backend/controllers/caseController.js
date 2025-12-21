const CaseModel = require('../models/caseModel');

class CaseController {
  static async getAllCases(req, res) {
    try {
      const cases = await CaseModel.findAll();
      res.json(cases);
    } catch (err) {
      console.error('Get cases error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getCaseById(req, res) {
    try {
      const caseData = await CaseModel.findById(req.params.id);
      
      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      res.json(caseData);
    } catch (err) {
      console.error('Get case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getCaseDetail(req, res) {
    try {
      const caseData = await CaseModel.findById(req.params.id);
      
      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      // Mock data for now - bu veriler ileride gerçek verilerle değiştirilecek
      const detailData = {
        case: caseData,
        machine: {
          name: 'DESKTOP-A7B2C3D',
          os: 'Windows 10 Pro',
          ip: '192.168.1.105',
          user: 'john.doe',
          domain: 'CORPORATE',
          timestamp: new Date().toISOString()
        },
        data: [
          { id: 1, timestamp: '2024-01-15 10:23:45', event: 'File Created', path: 'C:\\Users\\john\\malware.exe', status: 'Suspicious' },
          { id: 2, timestamp: '2024-01-15 10:24:12', event: 'Registry Modified', path: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', status: 'Critical' },
          { id: 3, timestamp: '2024-01-15 10:25:03', event: 'Network Connection', path: '185.220.101.45:443', status: 'Suspicious' }
        ],
        tasks: [
          { id: 1, name: 'Malware Analysis', assigned_to: 'Alice', status: 'In Progress', priority: 'High', due_date: '2024-01-20' },
          { id: 2, name: 'Threat Intelligence Check', assigned_to: 'Bob', status: 'Completed', priority: 'Medium', due_date: '2024-01-18' },
          { id: 3, name: 'Containment Actions', assigned_to: 'Charlie', status: 'Pending', priority: 'Critical', due_date: '2024-01-16' }
        ],
        playbooks: [
          { id: 1, name: 'Ransomware Response', version: '2.1', last_run: '2024-01-15 10:30:00', status: 'Success', steps_completed: '8/10' },
          { id: 2, name: 'Initial Triage', version: '1.5', last_run: '2024-01-15 10:15:00', status: 'Success', steps_completed: '12/12' }
        ],
        comments: [
          { id: 1, user: 'admin', timestamp: '2024-01-15 11:00:00', comment: 'Initial analysis shows signs of ransomware activity.' },
          { id: 2, user: 'alice', timestamp: '2024-01-15 11:30:00', comment: 'File hash matches known malware signature in VirusTotal.' },
          { id: 3, user: 'bob', timestamp: '2024-01-15 12:00:00', comment: 'Network traffic indicates C2 communication.' }
        ],
        ioc: [
          { id: 1, type: 'File Hash', value: 'a1b2c3d4e5f6...', threat_level: 'High', first_seen: '2024-01-10', source: 'VirusTotal' },
          { id: 2, type: 'IP Address', value: '185.220.101.45', threat_level: 'Critical', first_seen: '2024-01-12', source: 'ThreatFeed' },
          { id: 3, type: 'Domain', value: 'malicious-domain.com', threat_level: 'Medium', first_seen: '2024-01-14', source: 'AlienVault' }
        ]
      };

      res.json(detailData);
    } catch (err) {
      console.error('Get case detail error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createCase(req, res) {
    try {
      const { title, description, severity, assigned_to } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const caseData = await CaseModel.create({
        title,
        description,
        severity: severity || 'medium',
        assigned_to,
        created_by: req.user.id
      });

      res.status(201).json(caseData);
    } catch (err) {
      console.error('Create case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateCase(req, res) {
    try {
      const updates = {};

      if (req.body.status !== undefined) updates.status = req.body.status;
      if (req.body.severity !== undefined) updates.severity = req.body.severity;
      if (req.body.assigned_to !== undefined) updates.assigned_to = req.body.assigned_to;
      if (req.body.title !== undefined) updates.title = req.body.title;
      if (req.body.description !== undefined) updates.description = req.body.description;

      const caseData = await CaseModel.update(req.params.id, updates);

      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      res.json(caseData);
    } catch (err) {
      console.error('Update case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async deleteCase(req, res) {
    try {
      await CaseModel.delete(req.params.id);
      res.json({ message: 'Case deleted successfully' });
    } catch (err) {
      console.error('Delete case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = CaseController;