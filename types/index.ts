// API Data Models

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string; // Format: "dd-MM-yyyy"
  organisation_id: number | null;
  interested_count: number;
}

export interface User {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  street: string;
  street_number: string;
  apartment?: string;
  postal_code: string;
  city: string;
  is_volunteer: boolean;
  is_assisted: boolean;
  has_organisation: boolean;
  organisation_id?: number;
}

export interface Organisation {
  id: number;
  name: string;
  description?: string;
  head_user_id: number;
  allowed_municipality_ids: number[];
  allowed_municipalities: string[];
  allowed_parish_ids: number[];
  allowed_parishes: string[];
}

export interface District {
  id: number;
  name: string;
  population?: number;
  description?: string;
}

export interface Municipality {
  id: number;
  name: string;
  district_id: number;
  district_name: string;
  population?: number;
  description?: string;
}

export interface Parish {
  id: number;
  name: string;
  municipality_id: number;
  municipality_name: string;
  population?: number;
  description?: string;
}

// Form Data Types
export interface CreateUserData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  street: string;
  street_number: string;
  apartment?: string;
  postal_code: string;
  city: string;
  is_volunteer?: boolean;
  is_assisted?: boolean;
  has_organisation?: boolean;
  organisation_id?: number;
}

export interface CreateEventData {
  name: string;
  description: string;
  date: string; // Format: "dd-MM-yyyy"
  organisation_id?: number;
}

export interface CreateOrganisationData {
  name: string;
  description?: string;
  allowed_municipality_ids?: number[];
  allowed_parish_ids?: number[];
  head_user_id: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface EventsResponse {
  events: Event[];
  count: number;
}

export interface UsersResponse {
  users: User[];
  count: number;
}

export interface OrganisationsResponse {
  organisations: Organisation[];
  count: number;
}

export interface DistrictsResponse {
  districts: District[];
  count: number;
}

export interface MunicipalitiesResponse {
  municipalities: Municipality[];
  count: number;
}

export interface ParishesResponse {
  parishes: Parish[];
  count: number;
}
