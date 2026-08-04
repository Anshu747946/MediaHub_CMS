import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiResponse, AuthResponse, CurrentUser, Role } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/api/auth';
  private _user = signal<CurrentUser | null>(this.fromStorage());

  isLoggedIn  = computed(() => !!this._user());
  currentUser = computed(() => this._user());
  userRole    = computed(() => this._user()?.role ?? null);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API}/login`, { email, password })
      .pipe(tap(r => { if (r.success) { this.persist(r.data); this.navigate(r.data.role); } }));
  }

  register(username: string, email: string, password: string, role: Role) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API}/register`, { username, email, password, role })
      .pipe(tap(r => { if (r.success) { this.persist(r.data); this.navigate(r.data.role); } }));
  }

  logout() { localStorage.removeItem('mh_user'); this._user.set(null); this.router.navigate(['/login']); }
  getToken() { return this._user()?.token ?? null; }

  private persist(d: AuthResponse) {
    const u: CurrentUser = { token: d.token, email: d.email, username: d.username, role: d.role, userId: d.userId };
    this._user.set(u);
    try { localStorage.setItem('mh_user', JSON.stringify(u)); } catch {}
  }

  private fromStorage(): CurrentUser | null {
    try { const s = localStorage.getItem('mh_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  }

  private navigate(role: Role) {
    const map: Record<Role, string> = {
      CONTENT_CREATOR: '/creator', EDITOR: '/editor',
      MARKETING: '/marketing', MANAGER: '/manager', IT_SUPPORT: '/manager/system'
    };
    this.router.navigate([map[role]]);
  }
}
