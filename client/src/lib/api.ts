import { useAuth } from './auth';

const API_URL = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {

  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || 'An error occurred',
      response.status,
      error
    );
  }
  
  return response.json();
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuth.getState().token;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as any).Authorization = `Bearer ${token}`;
  }

  // Include CSRF token from cookie if available
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('x-csrf-token='))
    ?.split('=')[1];

  if (csrfToken) {
    (headers as Record<string, string>)['x-csrf-token'] = csrfToken;
  }

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Important for CSRF
  });


  return handleResponse(response);
}

export const getLatestEvent = () => apiClient('/events/latest');

export const getFeaturedActiveEvents = () => apiClient('/events/featured-active');

// Common API endpoints

export const adminApi = {

  // Event Registrations
  getEventRegistrations: (eventId?: number) =>
    apiClient(`/admin/event-registrations${eventId ? `?eventId=${eventId}` : ''}`),
  // Media Management
  getMedia: () => apiClient('/media'),
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_URL}/api/media/upload`, {
      method: 'POST',
      body: formData,
    }).then(handleResponse);
  },

  deleteMedia: (id: number) => apiClient(`/media/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboardStats: () => 
    apiClient('/admin/dashboard'),
  
  getTransactions: (params?: { page?: number; limit?: number }) =>
    apiClient('/admin/transactions' + (params ? `?${new URLSearchParams(params as any)}` : '')),

  // Blog Posts
  getBlogPosts: () =>
    apiClient('/admin/blog-posts'),
  
  createBlogPost: (data: any) =>
    apiClient('/admin/blog-posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateBlogPost: (id: number, data: any) =>
    apiClient(`/admin/blog-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteBlogPost: (id: number) =>
    apiClient(`/admin/blog-posts/${id}`, {
      method: 'DELETE',
    }),

  // Users
  getUsers: () =>
    apiClient('/admin/users'),
  
  createUser: (data: any) =>
    apiClient('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateUser: (id: number, data: any) =>
    apiClient(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteUser: (id: number) =>
    apiClient(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  // Donations
  getDonations: () =>
    apiClient('/admin/donations'),

  // Events
  getEvents: () =>
    apiClient('/admin/events'),
  
  createEvent: (data: any) =>
    apiClient('/admin/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateEvent: (id: number, data: any) =>
    apiClient(`/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteEvent: (id: number) =>
    apiClient(`/admin/events/${id}`, {
      method: 'DELETE',
    }),

  // Volunteers
  getVolunteers: () =>
    apiClient('/admin/volunteers'),
  
  updateVolunteer: (id: number, data: any) =>
    apiClient(`/admin/volunteers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Reports
  getReports: (timeRange: string) =>
    apiClient(`/admin/reports?timeRange=${timeRange}`),

  exportReport: (timeRange: string, format: 'csv' | 'pdf') =>
    apiClient(`/admin/reports/export?timeRange=${timeRange}&format=${format}`),

  // Settings
  getSettings: () =>
    apiClient('/admin/settings'),

  updateSettings: (data: any) =>
    apiClient('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Volunteer Applications
  getVolunteerApplications: () =>
    apiClient('/admin/volunteer-applications'),

  updateVolunteerApplication: (id: number, status: 'approved' | 'rejected') =>
    apiClient(`/admin/volunteer-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};
