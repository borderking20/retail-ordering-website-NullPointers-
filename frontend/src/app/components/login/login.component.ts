import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  userEmail = signal('test@example.com');
  passwordHash = signal('password');
  errorMessage = signal('');
  isLoading = signal(false);

  async onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const success = await this.authService.login(this.userEmail(), this.passwordHash());
    
    this.isLoading.set(false);
    
    if (success) {
      this.router.navigate(['/products']);
    } else {
      this.errorMessage.set('Invalid email or password');
    }
  }
}
