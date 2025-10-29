import api from './api';

export const teamService = {
  createTeam: (data) => api.post('/api/teams/create', data),
  listTeams: () => api.get('/api/teams/all'),
  getTeam: (id) => api.get(`/api/teams/${id}`),
  getUserTeams: () => api.get('/api/teams'),
  deleteTeam: (id) => api.delete(`/api/teams/${id}`),
  addMember: (id, data) => api.put(`/api/teams/${id}/add-member`, data),
  removeMember: (id, data) => api.put(`/api/teams/${id}/remove-member`, data),
  changeAdmin: (id, data) => api.patch(`/api/teams/${id}/change-admin`, data),
  changeAccessLevel: (id, data) => api.patch(`/api/teams/${id}/change-access`, data),
};

export default teamService;
