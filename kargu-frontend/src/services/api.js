const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
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
    return handleResponse(response);
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

  create: async (caseData) => {
    const response = await fetch(`${API_URL}/cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(caseData)
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