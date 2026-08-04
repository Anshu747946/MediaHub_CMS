import { Role } from './auth.model';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}
