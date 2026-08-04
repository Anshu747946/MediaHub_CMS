import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Role } from '../models/auth.model';
import { UserResponse } from '../models/user.model';

/*
 * User Management Service — used by Manager Team and IT Support pages.
 * All write operations (role, status, delete) are restricted server-side
 * to MANAGER and IT_SUPPORT roles.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = 'http://localhost:8080/api/users';
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<ApiResponse<UserResponse[]>>(this.API);
  }

  updateRole(id: number, role: Role) {
    return this.http.put<ApiResponse<UserResponse>>(`${this.API}/${id}/role`, { role });
  }

  updateStatus(id: number, isActive: boolean) {
    return this.http.put<ApiResponse<UserResponse>>(`${this.API}/${id}/status`, { isActive });
  }

  deleteUser(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}
