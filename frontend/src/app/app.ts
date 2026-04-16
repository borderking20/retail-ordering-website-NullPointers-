import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  authService = inject(AuthService);
  router = inject(Router);

  showDropdown = signal(false);

  get user() { return this.authService.currentUser(); }
  get initials() {
    const name = this.user?.userName ?? '';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  }

  logout() {
    this.authService.logout();
    this.showDropdown.set(false);
    this.router.navigate(['/login']);
  }

  toggleDropdown() { this.showDropdown.update(v => !v); }
  closeDropdown()  { this.showDropdown.set(false); }
}
