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