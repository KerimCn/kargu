// API URL - environment variable'dan al, yoksa default olarak localhost kullan
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    // 401 veya 403 hatası alındığında otomatik logout yap
    if (response.status === 401 || response.status === 403) {
      // Token geçersiz veya expired - localStorage'ı temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Sayfayı yenile ki AuthContext logout'u algılasın ve login sayfasına yönlendirsin
      window.location.reload();
      // Promise'i reject et ki çağıran kod hata alsın
      const error = await response.json().catch(() => ({ error: 'Authentication failed' }));
      throw new Error(error.error || 'Authentication failed');
    }
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

  verifyToken: async () => {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: getAuthHeader()
    });
    // verifyToken için özel handler - reload yapmadan sadece hata fırlat
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token geçersiz - sadece localStorage'ı temizle, reload yapma
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      const error = await response.json().catch(() => ({ error: 'Token verification failed' }));
      throw new Error(error.error || 'Token verification failed');
    }
    return response.json();
  }
};

// User API
export const userAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  create: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  update: async (id, userData) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_URL}/users/me/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  }
};

// Case API
export const caseAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/cases`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/cases/${id}`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  getDetail: async (id) => {
    const response = await fetch(`${API_URL}/cases/${id}/detail`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  create: async (caseData, file) => {
    const formData = new FormData();
    formData.append('title', caseData.title);
    formData.append('description', caseData.description || '');
    formData.append('severity', caseData.severity || 'medium');
    formData.append('assigned_to', caseData.assigned_to || '');
    
    if (file) {
      formData.append('forensicFile', file);
    }

    const headers = getAuthHeader();
    // FormData kullanırken Content-Type header'ını eklemeyin, browser otomatik ekler
    delete headers['Content-Type'];

    const response = await fetch(`${API_URL}/cases`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    return handleResponse(response);
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_URL}/cases/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/cases/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  }
};

// Comment API
export const commentAPI = {
  getAll: async (caseId) => {
    const response = await fetch(`${API_URL}/comments?case_id=${caseId}`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  create: async (caseId, comment) => {
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ case_id: caseId, comment })
    });
    return handleResponse(response);
  },

  update: async (id, comment) => {
    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ comment })
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  }
};

// Task API
export const taskAPI = {
  getAll: async (caseId) => {
    const response = await fetch(`${API_URL}/tasks?case_id=${caseId}`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  create: async (taskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(taskData)
    });
    return handleResponse(response);
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  }
};

// Playbook API
export const playbookAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/playbooks`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/playbooks/${id}`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  create: async (playbookData) => {
    const response = await fetch(`${API_URL}/playbooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(playbookData)
    });
    return handleResponse(response);
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_URL}/playbooks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/playbooks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  }
};

// Case Playbook API
export const casePlaybookAPI = {
  getByCaseId: async (caseId) => {
    const response = await fetch(`${API_URL}/case-playbooks/case/${caseId}`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  addToCase: async (caseId, playbookId) => {
    const response = await fetch(`${API_URL}/case-playbooks/case/${caseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ playbookId })
    });
    return handleResponse(response);
  },

  removeFromCase: async (id) => {
    const response = await fetch(`${API_URL}/case-playbooks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  }
};

// Playbook Execution API
export const playbookExecutionAPI = {
  getByCasePlaybookId: async (casePlaybookId) => {
    const response = await fetch(`${API_URL}/playbook-executions/${casePlaybookId}`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  update: async (executionId, updates) => {
    const response = await fetch(`${API_URL}/playbook-executions/${executionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  complete: async (executionId) => {
    const response = await fetch(`${API_URL}/playbook-executions/${executionId}/complete`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  }
};

// Notification API
export const notificationAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  getUnreadCount: async () => {
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  markAsRead: async (id) => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  markAllAsRead: async () => {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  }
};

// Forensic API
export const forensicAPI = {
  getFileData: async (caseId) => {
    const response = await fetch(`${API_URL}/forensic/cases/${caseId}/file`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  addArtifact: async (caseId, file) => {
    const formData = new FormData();
    formData.append('forensicFile', file);

    const headers = getAuthHeader();
    // FormData kullanırken Content-Type header'ını eklemeyin
    delete headers['Content-Type'];

    const response = await fetch(`${API_URL}/forensic/cases/${caseId}/artifact`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    return handleResponse(response);
  },

  deleteArtifact: async (caseId, fileId) => {
    const response = await fetch(`${API_URL}/forensic/cases/${caseId}/artifact/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  }
};

// AI API
export const aiAPI = {
  getSummary: async (caseId) => {
    const response = await fetch(`${API_URL}/ai/cases/${caseId}/summary`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  generateSummary: async (caseId, processTree, force = false) => {
    const response = await fetch(`${API_URL}/ai/cases/${caseId}/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ processTree, force })
    });
    return handleResponse(response);
  }
};