import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          });
          const newToken = res.data.access;
          localStorage.setItem("token", newToken);
          
          // Retry the original request with new token
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else {
        // No refresh token, logout user
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// API Service functions
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/users/login/", credentials),
  register: (userData: { email: string; nom: string; password: string }) =>
    api.post("/users/register/", userData),
  getMe: () => api.get("/users/me/"),
  refreshToken: (refresh: string) =>
    api.post("/users/token/refresh/", { refresh }),
};

export const usersAPI = {
  getAll: (params?: any) => api.get("/users/", { params }),
  getById: (id: number) => api.get(`/users/${id}/`),
  update: (id: number, data: any) => api.patch(`/users/${id}/`, data),
  delete: (id: number) => api.delete(`/users/${id}/`),
  activate: (id: number) => api.post(`/users/${id}/activate/`),
  deactivate: (id: number) => api.post(`/users/${id}/deactivate/`),
};

export const reportsAPI = {
  getAll: (params?: any) => api.get("/reports/", { params }),
  getById: (id: number) => api.get(`/reports/${id}/`),
  create: (data: any) => api.post("/reports/", data),
  update: (id: number, data: any) => api.patch(`/reports/${id}/`, data),
  delete: (id: number) => api.delete(`/reports/${id}/`),
  assignToMe: (id: number) => api.post(`/reports/${id}/assign_to_me/`),
  resolve: (id: number) => api.post(`/reports/${id}/resolve/`),
  reject: (id: number) => api.post(`/reports/${id}/reject/`),
  myReports: (params?: any) => api.get("/reports/my_reports/", { params }),
  assignedToMe: (params?: any) => api.get("/reports/assigned_to_me/", { params }),
};

export const categoriesAPI = {
  getAll: (params?: any) => api.get("/categories/", { params }),
  getById: (id: number) => api.get(`/categories/${id}/`),
  create: (data: any) => api.post("/categories/", data),
  update: (id: number, data: any) => api.patch(`/categories/${id}/`, data),
  delete: (id: number) => api.delete(`/categories/${id}/`),
};

export const commentsAPI = {
  getAll: (params?: any) => api.get("/comments/", { params }),
  getById: (id: number) => api.get(`/comments/${id}/`),
  create: (data: any) => api.post("/comments/", data),
  update: (id: number, data: any) => api.patch(`/comments/${id}/`, data),
  delete: (id: number) => api.delete(`/comments/${id}/`),
  myComments: (params?: any) => api.get("/comments/my_comments/", { params }),
  markAsRead: (id: number) => api.post(`/comments/${id}/mark_as_read/`),
};

export const assignmentsAPI = {
  getAll: (params?: any) => api.get("/assignements/", { params }),
  getById: (id: number) => api.get(`/assignements/${id}/`),
  create: (data: any) => api.post("/assignements/", data),
  update: (id: number, data: any) => api.patch(`/assignements/${id}/`, data),
  delete: (id: number) => api.delete(`/assignements/${id}/`),
  myAssignments: (params?: any) => api.get("/assignements/my_assignments/", { params }),
  markInProgress: (id: number) => api.post(`/assignements/${id}/mark_in_progress/`),
  markCompleted: (id: number) => api.post(`/assignements/${id}/mark_completed/`),
  markCancelled: (id: number) => api.post(`/assignements/${id}/mark_cancelled/`),
};

export const notificationsAPI = {
  getAll: (params?: any) => api.get("/notifications/", { params }),
  getById: (id: number) => api.get(`/notifications/${id}/`),
  create: (data: any) => api.post("/notifications/", data),
  update: (id: number, data: any) => api.patch(`/notifications/${id}/`, data),
  delete: (id: number) => api.delete(`/notifications/${id}/`),
  unread: (params?: any) => api.get("/notifications/unread/", { params }),
  markAllAsRead: () => api.post("/notifications/mark_all_as_read/"),
  markAsRead: (id: number) => api.post(`/notifications/${id}/mark_as_read/`),
  markAsUnread: (id: number) => api.post(`/notifications/${id}/mark_as_unread/`),
  countUnread: () => api.get("/notifications/count_unread/"),
};

export default api;
