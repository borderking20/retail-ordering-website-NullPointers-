import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  userName = '';
  userEmail = '';
  passwordHash = '';
  errorMessage = signal('');
  isLoading = signal(false);

  async onSubmit() {
    if (!this.userName || !this.userEmail || !this.passwordHash) {
      this.errorMessage.set('All fields are required.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const success = await this.authService.register(
      this.userName,
      this.userEmail,
      this.passwordHash
    );
    
    this.isLoading.set(false);
    
    if (success) {
      this.router.navigate(['/products']);
    } else {
      this.errorMessage.set('Registration failed. Email may already be in use.');
    }
  }
}
