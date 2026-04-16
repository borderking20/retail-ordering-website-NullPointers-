import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 border-b border-red-100 bg-white/95 backdrop-blur">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a routerLink="/" class="text-xl font-bold text-[var(--brand-red)]">RetailBite</a>
        <button class="rounded border px-3 py-1 md:hidden" (click)="menuOpen.set(!menuOpen())">Menu</button>
        <div class="hidden items-center gap-5 md:flex">
          <a routerLink="/" routerLinkActive="text-[var(--brand-red)]">Home</a>
          <a routerLink="/menu" routerLinkActive="text-[var(--brand-red)]">Menu</a>
          <a routerLink="/promotions" routerLinkActive="text-[var(--brand-red)]">Promotions</a>
          <a routerLink="/profile" routerLinkActive="text-[var(--brand-red)]">Profile</a>
          <a routerLink="/cart" class="rounded bg-[var(--brand-yellow)] px-3 py-1.5 font-medium text-white">
            Cart ({{ cartCount$ | async }})
          </a>
          <a *ngIf="authService.isAdmin()" routerLink="/admin/products" class="rounded border px-3 py-1.5">Admin</a>
          <button *ngIf="authService.isAuthenticated()" class="rounded border px-3 py-1.5" (click)="logout()">Logout</button>
          <a *ngIf="!authService.isAuthenticated()" routerLink="/auth/login" class="rounded border px-3 py-1.5">Login</a>
        </div>
      </nav>
      <div *ngIf="menuOpen()" class="border-t bg-white p-3 md:hidden">
        <div class="grid gap-2">
          <a routerLink="/" (click)="menuOpen.set(false)">Home</a>
          <a routerLink="/menu" (click)="menuOpen.set(false)">Menu</a>
          <a routerLink="/promotions" (click)="menuOpen.set(false)">Promotions</a>
          <a routerLink="/profile" (click)="menuOpen.set(false)">Profile</a>
          <a routerLink="/cart" (click)="menuOpen.set(false)">Cart ({{ cartCount$ | async }})</a>
          <a *ngIf="authService.isAdmin()" routerLink="/admin/dashboard" (click)="menuOpen.set(false)">Admin</a>
          <a *ngIf="!authService.isAuthenticated()" routerLink="/auth/login" (click)="menuOpen.set(false)">Login</a>
          <button *ngIf="authService.isAuthenticated()" class="rounded border px-3 py-2 text-left" (click)="logout()">Logout</button>
        </div>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  protected readonly menuOpen = signal(false);
  protected readonly cartCount$ = this.cartService.items$.pipe(map((items) => items.reduce((sum, x) => sum + x.quantity, 0)));

  logout(): void {
    this.authService.clearSession();
  }
}
