import api from './api';

export const organizationService = {
  getOrganization: (id) => api.get(`/api/organizations/${id}`),
  updateOrganization: (id, data) => api.put(`/api/organizations/update/${id}`, data),
  deleteOrganization: (id) => api.delete(`/api/organizations/delete/${id}`),
  getAllMembers: (orgId) => api.get(`/api/organizations/${orgId}/members`),
  makeCreator: (orgId, userId) => api.put(`/api/organizations/${orgId}/members/${userId}/admin`),
  listOrganizations: () => api.get('/api/organizations'),
};

export default organizationService;
