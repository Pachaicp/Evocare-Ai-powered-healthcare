import api from './axios';
import { ApiResponse, AuthResponse } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password }),

  register: (name: string, email: string, password: string, role?: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, password, role }),

  logout: () => api.post('/auth/logout'),
};

export const patientApi = {
  getAll: (page = 0, size = 10) =>
    api.get(`/patients?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/patients/${id}`),
  search: (q: string, page = 0) => api.get(`/patients/search?q=${q}&page=${page}`),
  create: (data: object) => api.post('/patients', data),
  update: (id: number, data: object) => api.put(`/patients/${id}`, data),
  assign: (id: number, doctorId?: number, caregiverId?: number) =>
    api.patch(`/patients/${id}/assign`, { doctorId, caregiverId }),
  getByDoctor: (doctorId: number) => api.get(`/patients/by-doctor/${doctorId}`),
  getByCaregiver: (caregiverId: number) => api.get(`/patients/by-caregiver/${caregiverId}`),
};

export const observationApi = {
  add: (data: object) => api.post('/observations', data),
  getByPatient: (patientId: number, page = 0) =>
    api.get(`/observations/patient/${patientId}?page=${page}`),
  getRecent: () => api.get('/observations/recent'),
};

export const medicationApi = {
  add: (data: object) => api.post('/medications', data),
  getByPatient: (patientId: number) => api.get(`/medications/patient/${patientId}`),
  delete: (id: number) => api.delete(`/medications/${id}`),
};

export const reportApi = {
  upload: (patientId: number, file: File, reportType?: string, description?: string) => {
    const formData = new FormData();
    formData.append('patientId', String(patientId));
    formData.append('file', file);
    if (reportType) formData.append('reportType', reportType);
    if (description) formData.append('description', description);
    return api.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getByPatient: (patientId: number) => api.get(`/reports/patient/${patientId}`),
};

export const clinicalNoteApi = {
  add: (data: object) => api.post('/clinical-notes', data),
  getByPatient: (patientId: number) => api.get(`/clinical-notes/patient/${patientId}`),
};

export const aiApi = {
  generate: (patientId: number) => api.post(`/ai-insights/generate/${patientId}`),
};

export const userApi = {
  getAll: (page = 0, size = 10) => api.get(`/users?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/users/${id}`),
  toggleStatus: (id: number) => api.patch(`/users/${id}/toggle-status`),
  updateRole: (id: number, role: string) => api.patch(`/users/${id}/role?role=${role}`),
  getDashboardStats: () => api.get('/users/dashboard-stats'),
};

export const auditApi = {
  getLogs: (page = 0, size = 20) => api.get(`/audit-logs?page=${page}&size=${size}`),
};
