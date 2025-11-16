
import axios from 'axios';
import type {
  Event,
  User,
  Organisation,
  CreateUserData,
  CreateEventData,
  CreateOrganisationData,
  EventsResponse,
  UsersResponse,
  OrganisationsResponse,
  DistrictsResponse,
  MunicipalitiesResponse,
  ParishesResponse,
} from '@/types';

// Get API base URL from environment or use default
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// API service modules
export const eventsAPI = {
  /**
   * Get all events with optional filters
   * @param filters - Optional filters: name (partial match), date (dd-MM-yyyy)
   */
  getEvents: async (filters?: { name?: string; date?: string }) => {
    const response = await api.get<EventsResponse>('/events', { params: filters });
    return response.data;
  },

  /**
   * Create a new event (organization only)
   * @param eventData - Event data including name, description, date, organisation_id
   */
  createEvent: async (eventData: CreateEventData) => {
    const response = await api.post<{ message: string; event: Event }>('/event', eventData);
    return response.data;
  },

  /**
   * Delete an event by ID
   * @param eventId - Event ID to delete
   */
  deleteEvent: async (eventId: number) => {
    const response = await api.delete<{ message: string }>('/event', {
      data: { id: eventId },
    });
    return response.data;
  },

  /**
   * Mark a user as interested in an event
   * @param eventId - Event ID
   * @param userId - User ID
   */
  markInterest: async (eventId: number, userId: number) => {
    const response = await api.post<{ message: string }>(`/event/${eventId}/interest`, {
      user_id: userId,
    });
    return response.data;
  },

  /**
   * Remove a user's interest in an event
   * @param eventId - Event ID
   * @param userId - User ID
   */
  removeInterest: async (eventId: number, userId: number) => {
    const response = await api.delete<{ message: string }>(`/event/${eventId}/interest`, {
      data: { user_id: userId },
    });
    return response.data;
  },
};

export const usersAPI = {
  /**
   * Get all users
   */
  getUsers: async () => {
    const response = await api.get<UsersResponse>('/users');
    return response.data;
  },

  /**
   * Create a new user
   * @param userData - User data including name, age, gender, address, etc.
   */
  createUser: async (userData: CreateUserData) => {
    const response = await api.post<{ message: string; user: User }>('/user', userData);
    return response.data;
  },
};

export const organisationsAPI = {
  /**
   * Get all organisations
   */
  getOrganisations: async () => {
    const response = await api.get<OrganisationsResponse>('/organisations');
    return response.data;
  },

  /**
   * Create a new organisation
   * @param orgData - Organisation data
   */
  createOrganisation: async (orgData: CreateOrganisationData) => {
    const response = await api.post<{ message: string; organisation: Organisation }>(
      '/organisation',
      orgData
    );
    return response.data;
  },
};

export const locationsAPI = {
  /**
   * Get all districts
   */
  getDistricts: async () => {
    const response = await api.get<DistrictsResponse>('/districts');
    return response.data;
  },

  /**
   * Get municipalities, optionally filtered by district
   * @param districtId - Optional district ID to filter by
   */
  getMunicipalities: async (districtId?: number) => {
    const response = await api.get<MunicipalitiesResponse>('/municipalities', {
      params: districtId ? { district_id: districtId } : undefined,
    });
    return response.data;
  },

  /**
   * Get parishes, optionally filtered by municipality
   * @param municipalityId - Optional municipality ID to filter by
   */
  getParishes: async (municipalityId?: number) => {
    const response = await api.get<ParishesResponse>('/parishes', {
      params: municipalityId ? { municipality_id: municipalityId } : undefined,
    });
    return response.data;
  },
};

/**
 * Health check endpoint
 */
export const healthCheck = async () => {
  const response = await api.get<{ status: string; message: string }>('/health');
  return response.data;
};

// Export axios instance for custom requests if needed
export default api;
