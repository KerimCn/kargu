const CaseModel = require('../models/caseModel');
const TaskModel = require('../models/taskModel');
const NotificationService = require('../services/notificationService');
const { pool } = require('../config/database');
const { parseFile } = require('../utils/fileParser');
const path = require('path');

class CaseController {
  // Düz process array'ini tree yapısına dönüştür
  static convertProcessArrayToTree(processArray) {
    if (!Array.isArray(processArray) || processArray.length === 0) {
      return [];
    }

    // Process'leri normalize et ve map oluştur
    const processMap = new Map();
    const rootProcesses = [];

    // Önce tüm process'leri normalize et ve map'e ekle
    processArray.forEach(proc => {
      const normalized = {
        pid: proc.pid,
        ppid: proc.ppid,
        name: proc.name || proc.process_name || 'Unknown',
        process_name: proc.process_name || proc.name,
        user: proc.user || proc.username || 'Unknown',
        startTime: proc.startTime || proc.start_time || null,
        status: proc.status || 'running',
        suspicious: proc.suspicious || false,
        path: proc.path || null,
        command_line: proc.command_line || proc.commandLine || null,
        session_id: proc.session_id || null,
        integrity_level: proc.integrity_level || null,
        children: []
      };
      processMap.set(proc.pid, normalized);
    });

    // Parent-child ilişkilerini kur
    processArray.forEach(proc => {
      const current = processMap.get(proc.pid);
      if (!current) return;

      const parentPid = proc.ppid;
      
      // ppid 0 veya null ise root process
      if (!parentPid || parentPid === 0) {
        rootProcesses.push(current);
      } else {
        const parent = processMap.get(parentPid);
        if (parent) {
          parent.children.push(current);
        } else {
          // Parent bulunamazsa root olarak ekle
          rootProcesses.push(current);
        }
      }
    });

    // Children'ları PID'ye göre sırala (görsel düzen için)
    const sortChildren = (process) => {
      if (process.children && process.children.length > 0) {
        process.children.sort((a, b) => (a.pid || 0) - (b.pid || 0));
        process.children.forEach(sortChildren);
      }
    };
    rootProcesses.forEach(sortChildren);

    return rootProcesses;
  }
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

      // Get network connections from database
      const networkConnectionsResult = await pool.query(
        'SELECT local_address, remote_address, protocol, state, process_name, pid FROM case_network_connections WHERE case_id = $1 ORDER BY id',
        [req.params.id]
      );
      const networkConnections = networkConnectionsResult.rows.map(row => ({
        localAddress: row.local_address,
        remoteAddress: row.remote_address,
        protocol: row.protocol,
        state: row.state,
        processName: row.process_name,
        pid: row.pid
      }));
      console.log(`Retrieved ${networkConnections.length} network connections for case ${req.params.id}`);

      // Get process tree from database
      const processTreeResult = await pool.query(
        'SELECT process_data FROM case_process_trees WHERE case_id = $1 ORDER BY created_at DESC LIMIT 1',
        [req.params.id]
      );
      let processTree = [];
      if (processTreeResult.rows.length > 0) {
        const processData = processTreeResult.rows[0].process_data;
        // PostgreSQL JSONB otomatik parse eder, ama string ise parse et
        if (typeof processData === 'string') {
          try {
            processTree = JSON.parse(processData);
          } catch (parseError) {
            console.error('Error parsing process tree:', parseError);
            processTree = [];
          }
        } else {
          processTree = processData || [];
        }
        console.log(`Retrieved process tree for case ${req.params.id}: ${Array.isArray(processTree) ? processTree.length : 'invalid'} items`);
      } else {
        console.log(`No process tree found for case ${req.params.id}`);
      }

      // Get forensic file info
      const forensicFileResult = await pool.query(
        'SELECT filename, filepath, file_type FROM case_forensic_files WHERE case_id = $1 ORDER BY created_at DESC LIMIT 1',
        [req.params.id]
      );
      let forensicFile = null;
      if (forensicFileResult.rows.length > 0) {
        forensicFile = forensicFileResult.rows[0];
        console.log(`Forensic file found for case ${req.params.id}:`, forensicFile.filename);
      } else {
        console.log(`No forensic file found for case ${req.params.id}`);
      }

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
        processTree: processTree.length > 0 ? processTree : [
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
        ],
        networkConnections: networkConnections.length > 0 ? networkConnections : [
          {
            localAddress: '192.168.1.105:52341',
            remoteAddress: '185.220.101.45:443',
            protocol: 'TCP',
            state: 'ESTABLISHED',
            processName: 'chrome.exe',
            pid: 2456,
            suspicious: true
          },
          {
            localAddress: '192.168.1.105:52342',
            remoteAddress: '8.8.8.8:53',
            protocol: 'UDP',
            state: 'ESTABLISHED',
            processName: 'svchost.exe',
            pid: 1234,
            suspicious: false
          },
          {
            localAddress: '0.0.0.0:80',
            remoteAddress: null,
            protocol: 'TCP',
            state: 'LISTENING',
            processName: 'httpd.exe',
            pid: 4567,
            suspicious: false
          },
          {
            localAddress: '192.168.1.105:52343',
            remoteAddress: '45.33.32.156:443',
            protocol: 'TCP',
            state: 'ESTABLISHED',
            processName: 'powershell.exe',
            pid: 3456,
            suspicious: true
          },
          {
            localAddress: '192.168.1.105:52344',
            remoteAddress: '172.217.16.14:443',
            protocol: 'TCP',
            state: 'ESTABLISHED',
            processName: 'chrome.exe',
            pid: 2456,
            suspicious: false
          },
          {
            localAddress: '0.0.0.0:445',
            remoteAddress: null,
            protocol: 'TCP',
            state: 'LISTENING',
            processName: 'System',
            pid: 4,
            suspicious: false
          },
          {
            localAddress: '192.168.1.105:52345',
            remoteAddress: '198.51.100.42:8080',
            protocol: 'TCP',
            state: 'ESTABLISHED',
            processName: 'malware.exe',
            pid: 3678,
            suspicious: true
          },
          {
            localAddress: '192.168.1.105:52346',
            remoteAddress: '1.1.1.1:53',
            protocol: 'UDP',
            state: 'ESTABLISHED',
            processName: 'svchost.exe',
            pid: 1234,
            suspicious: false
          },
          {
            localAddress: '0.0.0.0:3389',
            remoteAddress: null,
            protocol: 'TCP',
            state: 'LISTENING',
            processName: 'svchost.exe',
            pid: 1234,
            suspicious: false
          },
          {
            localAddress: '192.168.1.105:52347',
            remoteAddress: '203.0.113.10:443',
            protocol: 'TCP',
            state: 'TIME_WAIT',
            processName: 'explorer.exe',
            pid: 1234,
            suspicious: false
          },
          {
            localAddress: '192.168.1.105:52348',
            remoteAddress: '192.0.2.1:4444',
            protocol: 'TCP',
            state: 'ESTABLISHED',
            processName: 'cmd.exe',
            pid: 5678,
            suspicious: true
          },
          {
            localAddress: '0.0.0.0:135',
            remoteAddress: null,
            protocol: 'TCP',
            state: 'LISTENING',
            processName: 'svchost.exe',
            pid: 1234,
            suspicious: false
          },
          {
            localAddress: '192.168.1.105:52349',
            remoteAddress: '93.184.216.34:80',
            protocol: 'TCP',
            state: 'ESTABLISHED',
            processName: 'chrome.exe',
            pid: 2456,
            suspicious: false
          },
          {
            localAddress: '192.168.1.105:52350',
            remoteAddress: '185.220.101.45:443',
            protocol: 'TCP',
            state: 'ESTABLISHED',
            processName: 'powershell.exe',
            pid: 3456,
            suspicious: true
          },
          {
            localAddress: '0.0.0.0:49152',
            remoteAddress: null,
            protocol: 'TCP',
            state: 'LISTENING',
            processName: 'svchost.exe',
            pid: 1234,
            suspicious: false
          }
        ],
        forensicFile: forensicFile
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

      // Eğer dosya yüklendiyse işle
      if (req.file) {
        try {
          const filePath = req.file.path;
          console.log(`Parsing file: ${filePath} for case ${caseData.id}`);
          const fileData = await parseFile(filePath);
          console.log(`File parsed successfully. Keys: ${Object.keys(fileData).join(', ')}`);
          
          // Dosya bilgisini database'e kaydet
          await pool.query(
            `INSERT INTO case_forensic_files (case_id, filename, filepath, file_type) 
             VALUES ($1, $2, $3, $4)`,
            [caseData.id, req.file.filename, filePath, path.extname(req.file.originalname).substring(1)]
          );
          console.log(`Forensic file saved for case ${caseData.id}: ${req.file.filename}`);

          // Network connections varsa database'e kaydet
          // Hem networkConnections hem de network_connections field'larını kontrol et
          const networkConnections = fileData.networkConnections || fileData.network_connections;
          console.log(`Network connections found: ${networkConnections ? (Array.isArray(networkConnections) ? networkConnections.length : 'not an array') : 'null/undefined'}`);
          
          if (networkConnections && Array.isArray(networkConnections)) {
            console.log(`Saving ${networkConnections.length} network connections for case ${caseData.id}`);
            let savedCount = 0;
            let errorCount = 0;
            
            for (const conn of networkConnections) {
              try {
                // Farklı field isim formatlarını destekle
                const localIP = conn.localAddress || conn.local_address || conn.local_ip;
                const localPort = conn.localPort || conn.local_port;
                const remoteIP = conn.remoteAddress || conn.remote_address || conn.remote_ip;
                const remotePort = conn.remotePort || conn.remote_port;
                const processName = conn.processName || conn.process_name || conn.process;
                
                // IP ve port'u birleştir - sadece geçerli IP varsa
                let localAddress = null;
                if (localIP) {
                  localAddress = localPort ? `${localIP}:${localPort}` : localIP;
                }
                
                let remoteAddress = null;
                if (remoteIP) {
                  remoteAddress = remotePort ? `${remoteIP}:${remotePort}` : remoteIP;
                }
                
                await pool.query(
                  `INSERT INTO case_network_connections 
                   (case_id, local_address, remote_address, protocol, state, process_name, pid) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                  [
                    caseData.id,
                    localAddress,
                    remoteAddress,
                    conn.protocol || 'TCP',
                    conn.state || 'ESTABLISHED',
                    processName || null,
                    conn.pid || null
                  ]
                );
                savedCount++;
              } catch (connError) {
                errorCount++;
                console.error(`Error saving network connection (${errorCount}):`, connError.message);
                console.error('Connection data:', JSON.stringify(conn));
                // Bir bağlantı hatası diğerlerini engellemez
              }
            }
            console.log(`Network connections saved: ${savedCount} successful, ${errorCount} failed for case ${caseData.id}`);
          } else {
            console.log(`No network connections data found or invalid format for case ${caseData.id}`);
          }

          // Process tree varsa database'e kaydet
          // Hem processTree, process_tree, processtree ve processlist field'larını kontrol et
          let processTree = fileData.processTree || fileData.process_tree || fileData.processtree || fileData.processlist;
          console.log(`Process tree found: ${processTree ? (Array.isArray(processTree) ? `array with ${processTree.length} items` : typeof processTree) : 'null/undefined'}`);
          
          if (processTree && Array.isArray(processTree)) {
            // Eğer düz array ise (ppid ile parent-child ilişkisi varsa), tree yapısına dönüştür
            if (processTree.length > 0 && processTree[0].ppid !== undefined) {
              console.log(`Converting flat process array to tree structure for case ${caseData.id}`);
              processTree = CaseController.convertProcessArrayToTree(processTree);
            }
            
            console.log(`Saving process tree for case ${caseData.id}`);
            try {
              await pool.query(
                `INSERT INTO case_process_trees (case_id, process_data) 
                 VALUES ($1, $2::jsonb)`,
                [caseData.id, JSON.stringify(processTree)]
              );
              console.log(`Successfully saved process tree for case ${caseData.id}`);
            } catch (treeError) {
              console.error('Error saving process tree:', treeError);
              throw treeError;
            }
          } else {
            console.log(`No process tree data found in file for case ${caseData.id}`);
          }
        } catch (fileError) {
          console.error('Error processing uploaded file:', fileError);
          console.error('Error stack:', fileError.stack);
          // Dosya hatası case oluşturmayı engellemez
        }
      }

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

      // Check if user is the case creator - only creator can edit case
      const isCaseCreator = existingCase.created_by === userId;
      if (!isCaseCreator) {
        return res.status(403).json({ error: 'Sadece case\'i oluşturan kişi case\'i düzenleyebilir.' });
      }

      // If trying to reopen a resolved case, check permissions
      if (req.body.status === 'open' && existingCase.status === 'resolved') {
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