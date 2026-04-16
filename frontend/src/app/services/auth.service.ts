import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = 'http://localhost:5105/api/auth';
  
  private readonly currentUserSignal = signal<User | null>(null);
  readonly authToken = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('currentUser');
      if (token) {
        this.authToken.set(token);
      }
      if (userJson) {
        try { this.currentUserSignal.set(JSON.parse(userJson)); } catch {}
      }
    }
  }

  /** Decode JWT payload (base64) to extract claims */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch { return {}; }
  }

  private buildUserFromToken(token: string, fallbackEmail: string, fallbackName: string): User {
    const claims = this.decodeToken(token);
    // .NET JWT claim names
    const userId = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? '0';
    const userEmail = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? fallbackEmail;
    return {
      userId,
      userEmail,
      userName: fallbackName || userEmail.split('@')[0],
      passwordHash: '',
      role: claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? 'User'
    };
  }

  get currentUser() {
    return this.currentUserSignal.asReadonly();
  }

  get isAuthenticated() {
    return !!this.authToken();
  }

  async login(userEmail: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.post<{ token: string }>(`${this.apiUrl}/login`, { UserEmail: userEmail, Password: password }));
      if (response?.token) {
        this.authToken.set(response.token);
        const user = this.buildUserFromToken(response.token, userEmail, '');
        this.currentUserSignal.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.authToken.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  }

  async register(userName: string, userEmail: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.post<{ token: string }>(`${this.apiUrl}/register`, { UserName: userName, UserEmail: userEmail, Password: password }));
      if (response?.token) {
        this.authToken.set(response.token);
        const user = this.buildUserFromToken(response.token, userEmail, userName);
        this.currentUserSignal.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  }
}
