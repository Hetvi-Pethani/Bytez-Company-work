export interface UserData {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserData;
} 