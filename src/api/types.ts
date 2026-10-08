export type Role = 'client' | 'specialist' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Specialist {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  specialists?: Specialist[];
}

export interface Paginated<T> {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
}

export interface SlotsResponse {
  data: {
    date: string;
    timezone: string;
    duration_minutes: number;
    slots: string[];
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: number;
  status: BookingStatus;
  starts_at: string;
  ends_at: string;
  price: number;
  can_cancel: boolean;
  service?: Service;
  specialist?: Specialist;
  client?: Specialist;
}

export interface NewBooking {
  specialist_id: number;
  service_id: number;
  date: string;
  time: string;
}