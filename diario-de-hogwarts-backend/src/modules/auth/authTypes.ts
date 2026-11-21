export type UserRole = 'student' | 'teacher';

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  house: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}