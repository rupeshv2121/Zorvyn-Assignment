export interface User {
  id: string;
  email: string;
  role: 'viewer' | 'analyst' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
