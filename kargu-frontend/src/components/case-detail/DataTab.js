import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, Search, Server, X } from 'lucide-react';
import { forensicAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const DataTab = ({ data, searchTerm, setSearchTerm, caseId, forensicFile, onMachineRemoved }) => {
  const { isDark } = useTheme();
  const [forensicFiles, setForensicFiles] = useState([]);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState([]);
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [removingMachineId, setRemovingMachineId] = useState(null);

  useEffect(() => {
    if (forensicFile && caseId) {
      fetchForensicData();
    } else {
      setForensicFiles([]);
      setKeys([]);
      setSelectedKey(null);
      setSelectedMachineId(null);
    }
  }, [forensicFile, caseId]);

  const fetchForensicData = async () => {
    if (!caseId) return;
    
    try {
      setLoading(true);
      const filesData = await forensicAPI.getFileData(caseId);
      
      // If it's an array (multiple machines), use it directly
      // If it's a single object (backward compatibility), wrap it in array
      const filesArray = Array.isArray(filesData) ? filesData : [filesData];
      
      setForensicFiles(filesArray);
      
      // Select first machine by default
      if (filesArray.length > 0 && !selectedMachineId) {
        const firstFileId = filesArray[0].id || 0;
        setSelectedMachineId(firstFileId);
        const firstFileData = filesArray[0].data || filesArray[0];
        const extractedKeys = Object.keys(firstFileData);
        setKeys(extractedKeys);
        if (extractedKeys.length > 0) {
          setSelectedKey(extractedKeys[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching forensic data:', error);
      setForensicFiles([]);
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  // Get selected machine data
  const selectedMachine = forensicFiles.find(f => (f.id || 0) === selectedMachineId) || forensicFiles[0];
  const selectedMachineData = selectedMachine?.data || selectedMachine;

  useEffect(() => {
    if (selectedMachineData) {
      const extractedKeys = Object.keys(selectedMachineData);
      setKeys(extractedKeys);
      if (extractedKeys.length > 0 && !selectedKey) {
        setSelectedKey(extractedKeys[0]);
      }
      setTableSearchTerm('');
    }
  }, [selectedMachineId]);

  const handleRemoveMachine = async (fileId, e) => {
    e.stopPropagation(); // Prevent machine selection when clicking remove button
    
    if (!window.confirm('Bu makineyi kaldırmak istediğinize emin misiniz?')) {
      return;
    }

    try {
      setRemovingMachineId(fileId);
      await forensicAPI.deleteArtifact(caseId, fileId);
      
      // Remove from local state
      const updatedFiles = forensicFiles.filter(f => (f.id || 0) !== fileId);
      setForensicFiles(updatedFiles);
      
      // If the removed machine was selected, select another one or clear selection
      if (selectedMachineId === fileId) {
        if (updatedFiles.length > 0) {
          const newSelectedId = updatedFiles[0].id || 0;
          setSelectedMachineId(newSelectedId);
          const newSelectedData = updatedFiles[0].data || updatedFiles[0];
          const extractedKeys = Object.keys(newSelectedData);
          setKeys(extractedKeys);
          if (extractedKeys.length > 0) {
            setSelectedKey(extractedKeys[0]);
          }
        } else {
          setSelectedMachineId(null);
          setSelectedKey(null);
          setKeys([]);
        }
      }
      
      // Notify parent component if callback provided
      if (onMachineRemoved) {
        onMachineRemoved();
      }
    } catch (error) {
      console.error('Error removing machine:', error);
      alert(error.message || 'Makine kaldırılırken bir hata oluştu.');
    } finally {
      setRemovingMachineId(null);
    }
  };


  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return <span style={{ color: '#9CA3AF' }}>null</span>;
    }
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#9CA3AF' }}>
            Array[{value.length}]
          </div>
        );
      } else {
        return (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#9CA3AF' }}>
            Object
          </div>
        );
      }
    }
    
    return String(value);
  };

  const filterTableData = (dataArray) => {
    if (!tableSearchTerm) return dataArray;
    
    return dataArray.filter(row => {
      return Object.values(row).some(val => {
        const valueStr = val === null || val === undefined ? '' : String(val);
        return valueStr.toLowerCase().includes(tableSearchTerm.toLowerCase());
      });
    });
  };

  const renderTable = (dataArray) => {
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted">No data available</p>
        </div>
      );
    }

    const columns = Object.keys(dataArray[0]);
    const filteredData = filterTableData(dataArray);

    return (
      <div>
        {/* Search Bar */}
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: isDark ? '#6B7280' : '#9CA3AF',
              zIndex: 1
            }} 
          />
          <input
            type="text"
            placeholder="Search in table..."
            value={tableSearchTerm}
            onChange={(e) => setTableSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: '4px',
              border: `1px solid ${isDark ? '#2A2F38' : '#E2E8F0'}`,
              background: isDark ? '#1E2229' : '#FFFFFF',
              color: isDark ? '#E0E6ED' : '#1A1F2E',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FF4D4D';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDark ? '#2A2F38' : '#E2E8F0';
            }}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#1A1F2E', borderBottom: '2px solid #2A2F38' }}>
                {columns.map(col => (
                  <th
                    key={col}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      color: isDark ? '#9CA3AF' : '#000000',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '11px'
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid #2A2F38',
                      background: index % 2 === 0 ? 'transparent' : 'rgba(26, 31, 46, 0.3)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1A1F2E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(26, 31, 46, 0.3)';
                    }}
                  >
                    {columns.map(col => (
                      <td
                        key={col}
                        style={{
                          padding: '12px 16px',
                          color: isDark ? '#E0E6ED' : '#000000',
                          wordBreak: 'break-word',
                          maxWidth: '300px'
                        }}
                      >
                        {renderValue(row[col])}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={columns.length}
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      color: isDark ? '#9CA3AF' : '#64748B',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    No data found matching "{tableSearchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const hasForensicFile = forensicFiles.length > 0;
  
  if (hasForensicFile) {
    if (loading) {
      return (
        <div className="text-center py-12">
          <p className="text-muted">Loading forensic data...</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', gap: '16px', height: '100%' }}>

        {/* Machine Selection Sidebar */}
        {forensicFiles.length > 1 && (
          <div
            style={{
              width: '220px',
              background: '#0F1115',
              border: '1px solid #2A2F38',
              borderRadius: '4px',
              padding: '12px',
              overflowY: 'auto',
              maxHeight: '600px'
            }}
          >
            <div
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#E0E6ED',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #2A2F38',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Server size={16} />
              Machines
            </div>
            {forensicFiles.map((file, index) => {
              const fileId = file.id || index;
              const hostname = file.hostname || file.metadata?.hostname || `Machine ${index + 1}`;
              const isSelected = (selectedMachineId || 0) === fileId;
              const isRemoving = removingMachineId === fileId;
              
              return (
                <div
                  key={fileId}
                  onClick={() => {
                    if (!isRemoving) {
                      setSelectedMachineId(fileId);
                      setSelectedKey(null);
                      setTableSearchTerm('');
                    }
                  }}
                  style={{
                    padding: '10px 12px',
                    marginBottom: '4px',
                    borderRadius: '4px',
                    cursor: isRemoving ? 'not-allowed' : 'pointer',
                    background: isSelected ? 'rgba(74, 158, 255, 0.2)' : 'transparent',
                    border: isSelected ? '1px solid #4A9EFF' : '1px solid transparent',
                    color: isSelected ? '#4A9EFF' : '#E0E6ED',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                    opacity: isRemoving ? 0.5 : 1,
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !isRemoving) {
                      e.currentTarget.style.background = '#1A1F2E';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !isRemoving) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{hostname}</div>
                      <div style={{ fontSize: '10px', color: '#9CA3AF' }}>
                        {file.filename || `File ${index + 1}`}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleRemoveMachine(fileId, e)}
                      disabled={isRemoving}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: isRemoving ? '#9CA3AF' : '#FF4D4D',
                        cursor: isRemoving ? 'not-allowed' : 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        if (!isRemoving) {
                          e.currentTarget.style.background = 'rgba(255, 77, 77, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isRemoving) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                      title="Makineyi Kaldır"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Data Keys Sidebar */}
        <div
          style={{
            width: '250px',
            background: '#0F1115',
            border: '1px solid #2A2F38',
            borderRadius: '4px',
            padding: '12px',
            overflowY: 'auto',
            maxHeight: '600px'
          }}
        >
          <div
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: '#E0E6ED',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid #2A2F38'
            }}
          >
            Data Keys
            {selectedMachine && (
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>
                {selectedMachine.hostname || 'Selected Machine'}
              </div>
            )}
          </div>
          {keys.map(key => (
            <div
              key={key}
              onClick={() => {
                setSelectedKey(key);
                setTableSearchTerm('');
              }}
              style={{
                padding: '10px 12px',
                marginBottom: '4px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: selectedKey === key ? 'rgba(74, 158, 255, 0.2)' : 'transparent',
                border: selectedKey === key ? '1px solid #4A9EFF' : '1px solid transparent',
                color: selectedKey === key ? '#4A9EFF' : '#E0E6ED',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedKey !== key) {
                  e.currentTarget.style.background = '#1A1F2E';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedKey !== key) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} />
                <span>{key}</span>
              </div>
              {selectedKey === key && <ChevronRight size={14} />}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {selectedKey && selectedMachineData && selectedMachineData[selectedKey] ? (
            <div
              style={{
                background: '#0F1115',
                border: '1px solid #2A2F38',
                borderRadius: '4px',
                padding: '16px',
                overflow: 'auto'
              }}
            >
              <div
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: isDark ? '#E0E6ED' : '#000000',
                  marginBottom: '8px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #2A2F38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div>{selectedKey}</div>
                  {selectedMachine && (
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                      {selectedMachine.hostname || 'Machine Data'}
                    </div>
                  )}
                </div>
              </div>
              {Array.isArray(selectedMachineData[selectedKey]) ? (
                renderTable(selectedMachineData[selectedKey])
              ) : typeof selectedMachineData[selectedKey] === 'object' ? (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: isDark ? '#E0E6ED' : '#000000' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {JSON.stringify(selectedMachineData[selectedKey], null, 2)}
                  </pre>
                </div>
              ) : (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: isDark ? '#E0E6ED' : '#000000' }}>
                  {String(selectedMachineData[selectedKey])}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted">Select a key from the sidebar to view data</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Eski görünüm (forensic file yoksa)
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input-field mb-4"
      />
      {data && data.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#1A1F2E', borderBottom: '2px solid #2A2F38' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9CA3AF', fontWeight: 600 }}>Timestamp</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9CA3AF', fontWeight: 600 }}>Event</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9CA3AF', fontWeight: 600 }}>Path</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9CA3AF', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid #2A2F38',
                    background: index % 2 === 0 ? 'transparent' : 'rgba(26, 31, 46, 0.3)'
                  }}
                >
                  <td style={{ padding: '12px 16px', color: isDark ? '#E0E6ED' : '#000000' }}>{item.timestamp}</td>
                  <td style={{ padding: '12px 16px', color: isDark ? '#E0E6ED' : '#000000' }}>{item.event}</td>
                  <td style={{ padding: '12px 16px', color: isDark ? '#E0E6ED' : '#000000' }}>{item.path}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${item.status?.toLowerCase()}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted">No data available</p>
        </div>
      )}
    </div>
  );
};

export default DataTab;
