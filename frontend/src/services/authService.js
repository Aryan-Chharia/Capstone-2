import api from './api';

export const authService = {
  registerUser: (data) => api.post('/api/users/register', data),
  verifyUser: (data) => api.post('/api/users/verify-email', data),
  loginUser: (data) => api.post('/api/users/login', data),
  logoutUser: () => api.post('/api/users/logout'),
  listUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
};

export const orgAuthService = {
  registerOrganization: (data) => api.post('/api/organizations/register', data),
  loginOrganization: (data) => api.post('/api/organizations/login', data),
  listOrganizations: () => api.get('/api/organizations'),
};

export default authService;
