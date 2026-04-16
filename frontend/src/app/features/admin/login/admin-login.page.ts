import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 text-white">
      <p class="text-xs uppercase tracking-wide text-yellow-400">Internal</p>
      <h1 class="text-2xl font-bold">Admin Portal</h1>
      <form class="mt-4 space-y-3" [formGroup]="form" (ngSubmit)="submit()">
        <input class="w-full rounded border border-slate-600 bg-slate-800 p-2" placeholder="Email" formControlName="email" />
        <input class="w-full rounded border border-slate-600 bg-slate-800 p-2" placeholder="Password" type="password" formControlName="password" />
        <button class="w-full rounded bg-yellow-500 py-2 font-semibold text-slate-900" [disabled]="form.invalid">Login</button>
      </form>
    </div>
  `,
})
export class AdminLoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.authService.adminLogin(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => {
        this.notificationService.show('Admin login successful');
        this.router.navigateByUrl('/admin/dashboard');
      },
    });
  }
}
