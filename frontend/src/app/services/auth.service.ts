import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(null);
  readonly authToken = signal<string | null>(null);

  get currentUser() {
    return this.currentUserSignal.asReadonly();
  }

  get isAuthenticated() {
    return !!this.currentUserSignal();
  }

  login(userEmail: string, passwordHash: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userEmail === 'test@example.com' && passwordHash === 'password') {
          this.currentUserSignal.set({
            userId: '1',
            userEmail,
            userName: 'Test User',
            passwordHash: 'password',
            role: 'customer'
          });
          this.authToken.set('mock-jwt-token-12345');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.authToken.set(null);
  }

  register(userName: string, userEmail: string, passwordHash: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Automatically verify and log the new user in
        this.currentUserSignal.set({
          userId: `u_${Date.now()}`,
          userEmail,
          userName,
          passwordHash, // Front-end representation, never actually pass hashes back to client normally
          role: 'customer'
        });
        this.authToken.set(`mock-jwt-token-reg-${Date.now()}`);
        resolve(true);
      }, 500);
    });
  }
}
