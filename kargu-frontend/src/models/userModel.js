/**
 * User Model - Data validation and transformation
 */

export const userRoles = {
  VIEWER: '1',
  ANALYST: '2',
  ADMIN: '3',
  SUPER_ADMIN: '4'
};

export const roleLabels = {
  '1': 'VIEWER',
  '2': 'ANALYST',
  '3': 'ADMIN',
  '4': 'SUPER_ADMIN'
};

/**
 * Validate user data
 */
export const validateUser = (userData) => {
  const errors = {};

  if (!userData.username || userData.username.trim().length === 0) {
    errors.username = 'Username is required';
  }

  if (userData.username && userData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = 'Invalid email format';
  }

  if (userData.password && userData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (userData.role && !Object.values(userRoles).includes(userData.role)) {
    errors.role = 'Invalid role';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Transform user data for API
 */
export const transformUserForAPI = (userData) => {
  const transformed = {
    username: userData.username?.trim() || '',
    email: userData.email?.trim() || '',
    full_name: userData.full_name?.trim() || '',
    role: userData.role || userRoles.VIEWER
  };

  if (userData.password) {
    transformed.password = userData.password;
  }

  return transformed;
};

/**
 * Check if user is admin
 */
export const isAdmin = (user) => {
  return user?.role === userRoles.ADMIN || user?.role === userRoles.SUPER_ADMIN;
};

/**
 * Format user for display
 */
export const formatUser = (user) => {
  return {
    ...user,
    roleLabel: roleLabels[user.role] || 'VIEWER',
    createdAt: user.created_at ? new Date(user.created_at) : null
  };
};
