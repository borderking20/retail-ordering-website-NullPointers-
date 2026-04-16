import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;
  private readonly tokenKey = 'retail.auth.token';
  private readonly roleKey = 'retail.auth.role';
  private readonly token = signal<string | null>(localStorage.getItem(this.tokenKey));
  private readonly role = signal<string | null>(localStorage.getItem(this.roleKey));

  readonly isAuthenticated = computed(() => !!this.token());
  readonly isAdmin = computed(() => this.role() === 'Admin');

  getToken(): string | null {
    return this.token();
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => this.setSession(response.token, response.role))
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(
      tap((response) => this.setSession(response.token, response.role))
    );
  }

  adminLogin(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/admin/login`, request).pipe(
      tap((response) => this.setSession(response.token, response.role)),
      map((response) => response.role === 'Admin')
    );
  }

  setSession(token: string, role: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
    this.token.set(token);
    this.role.set(role);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.token.set(null);
    this.role.set(null);
  }
}
