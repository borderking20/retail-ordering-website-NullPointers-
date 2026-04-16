import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-md rounded-xl border bg-white p-6">
      <h1 class="text-2xl font-bold text-[var(--brand-red)]">Register</h1>
      <form class="mt-4 space-y-3" [formGroup]="form" (ngSubmit)="submit()">
        <input class="w-full rounded border p-2" placeholder="Full Name" formControlName="fullName" />
        <p class="text-xs text-red-600" *ngIf="form.controls.fullName.touched && form.controls.fullName.invalid">Full name is required.</p>
        <input class="w-full rounded border p-2" placeholder="Email" formControlName="email" />
        <p class="text-xs text-red-600" *ngIf="form.controls.email.touched && form.controls.email.invalid">Enter a valid email.</p>
        <input class="w-full rounded border p-2" placeholder="Phone" formControlName="phone" />
        <p class="text-xs text-red-600" *ngIf="form.controls.phone.touched && form.controls.phone.invalid">Phone must be at least 10 digits.</p>
        <input class="w-full rounded border p-2" placeholder="Password" type="password" formControlName="password" />
        <p class="text-xs text-red-600" *ngIf="form.controls.password.touched && form.controls.password.invalid">Password must be at least 6 characters.</p>
        <button class="w-full rounded bg-[var(--brand-red)] py-2 text-white" [disabled]="form.invalid">Register</button>
      </form>
      <p class="mt-3 text-sm">
        Already registered?
        <a routerLink="/auth/login" class="text-[var(--brand-red)]">Login</a>
      </p>
    </div>
  `,
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authService.register(this.form.getRawValue() as { fullName: string; email: string; phone: string; password: string }).subscribe({
      next: () => {
        this.notificationService.show('Registered successfully');
        this.router.navigateByUrl('/menu');
      },
    });
  }
}
