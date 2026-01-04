const CaseModel = require('../models/caseModel');
const TaskModel = require('../models/taskModel');
const NotificationService = require('../services/notificationService');

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

      // Get tasks from database
      const tasks = await TaskModel.findAllByCaseId(req.params.id);

      // Mock data - ileride gerçek verilerle değiştirilecek
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
        tasks: tasks,
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
        ],
        processTree: [
          {
            pid: 4,
            name: 'System',
            user: 'NT AUTHORITY\\SYSTEM',
            startTime: '2024-01-15 09:00:00',
            status: 'running',
            suspicious: false,
            children: [
              {
                pid: 584,
                name: 'smss.exe',
                user: 'NT AUTHORITY\\SYSTEM',
                startTime: '2024-01-15 09:00:02',
                status: 'running',
                suspicious: false,
                children: []
              }
            ]
          },
          {
            pid: 720,
            name: 'csrss.exe',
            user: 'NT AUTHORITY\\SYSTEM',
            startTime: '2024-01-15 09:00:05',
            status: 'running',
            suspicious: false,
            children: []
          },
          {
            pid: 1234,
            name: 'explorer.exe',
            user: 'CORPORATE\\john.doe',
            startTime: '2024-01-15 09:05:23',
            status: 'running',
            suspicious: false,
            children: [
              {
                pid: 2456,
                name: 'chrome.exe',
                user: 'CORPORATE\\john.doe',
                startTime: '2024-01-15 09:15:10',
                status: 'running',
                suspicious: false,
                children: [
                  {
                    pid: 2789,
                    name: 'chrome.exe',
                    user: 'CORPORATE\\john.doe',
                    startTime: '2024-01-15 09:15:12',
                    status: 'running',
                    suspicious: false,
                    children: []
                  },
                  {
                    pid: 2801,
                    name: 'chrome.exe',
                    user: 'CORPORATE\\john.doe',
                    startTime: '2024-01-15 09:15:13',
                    status: 'running',
                    suspicious: false,
                    children: []
                  }
                ]
              },
              {
                pid: 3456,
                name: 'powershell.exe',
                user: 'CORPORATE\\john.doe',
                startTime: '2024-01-15 10:23:45',
                status: 'terminated',
                suspicious: true,
                children: [
                  {
                    pid: 3678,
                    name: 'malware.exe',
                    user: 'CORPORATE\\john.doe',
                    startTime: '2024-01-15 10:23:50',
                    status: 'terminated',
                    suspicious: true,
                    children: [
                      {
                        pid: 3789,
                        name: 'svchost.exe',
                        user: 'CORPORATE\\john.doe',
                        startTime: '2024-01-15 10:24:00',
                        status: 'terminated',
                        suspicious: true,
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                pid: 4567,
                name: 'notepad.exe',
                user: 'CORPORATE\\john.doe',
                startTime: '2024-01-15 11:30:00',
                status: 'running',
                suspicious: false,
                children: []
              }
            ]
          }
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
      const userId = req.user.id;

      // Get existing case to check permissions
      const existingCase = await CaseModel.findById(req.params.id);
      if (!existingCase) {
        return res.status(404).json({ error: 'Case not found' });
      }

      // If trying to reopen a resolved case, check permissions
      if (req.body.status === 'open' && existingCase.status === 'resolved') {
        const isCaseCreator = existingCase.created_by === userId;
        const isCaseAssignee = existingCase.assigned_to === userId;
        
        if (!isCaseCreator && !isCaseAssignee) {
          return res.status(403).json({ error: 'Sadece case\'i oluşturan veya atanan kişi case\'i tekrar açabilir.' });
        }
      }

      if (req.body.status !== undefined) updates.status = req.body.status;
      if (req.body.severity !== undefined) updates.severity = req.body.severity;
      if (req.body.assigned_to !== undefined) updates.assigned_to = req.body.assigned_to;
      if (req.body.title !== undefined) updates.title = req.body.title;
      if (req.body.description !== undefined) updates.description = req.body.description;
      if (req.body.resolution_summary !== undefined) updates.resolution_summary = req.body.resolution_summary;

      const caseData = await CaseModel.update(req.params.id, updates);

      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      // Create notifications for case status changes
      if (req.body.status !== undefined) {
        const oldStatus = existingCase.status;
        const newStatus = req.body.status;
        
        if (oldStatus !== newStatus) {
          if (newStatus === 'resolved') {
            await NotificationService.createNotificationForCaseUsers(
              req.params.id,
              'case_closed',
              'Case Kapatıldı',
              `Case "${caseData.title}" kapatıldı.`,
              userId
            );
          } else if (newStatus === 'open' && oldStatus === 'resolved') {
            await NotificationService.createNotificationForCaseUsers(
              req.params.id,
              'case_reopened',
              'Case Tekrar Açıldı',
              `Case "${caseData.title}" tekrar açıldı.`,
              userId
            );
          }
        }
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