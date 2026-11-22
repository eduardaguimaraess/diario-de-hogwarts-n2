export type UserRole = 'student' | 'teacher';
export type HogwartsHouse =
  | 'Grifinória'
  | 'Sonserina'
  | 'Corvinal'
  | 'Lufa-Lufa';

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

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  house: HogwartsHouse;
}
