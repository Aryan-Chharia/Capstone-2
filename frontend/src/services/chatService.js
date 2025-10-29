import api from './api';

export const chatService = {
  sendMessage: (formData) =>
    api.post('/api/chat/chat', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAIReply: (data) => api.post('/api/chat/chat/ai', data),
  getChatHistory: (projectId, chatId) => api.get(`/api/chat/${projectId}/${chatId}`),
  createChat: (data) => api.post('/api/chat/chat/create', data),
};

export default chatService;
