import api from './api';

export const projectService = {
  createProject: (data) => api.post('/api/projects', data),
  listProjects: () => api.get('/api/projects'),
  getProject: (id) => api.get(`/api/projects/${id}`),
  updateProject: (id, data) => api.patch(`/api/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/api/projects/${id}`),
  uploadDataset: (id, formData) =>
    api.post(`/api/projects/${id}/datasets`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  listDatasets: (id) => api.get(`/api/projects/${id}/datasets`),
};

export default projectService;
