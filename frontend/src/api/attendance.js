import { api } from './client';

export const attendanceApi = {
  mark: (data) => api.post('/attendance', data),
  getByEmployee: (employeeId, date) => {
    const params = date ? `?date=${date}` : '';
    return api.get(`/attendance/${employeeId}${params}`);
  },
  getSummary: (employeeId) => api.get(`/attendance/${employeeId}/summary`),
  getDashboard: () => api.get('/dashboard'),
};
