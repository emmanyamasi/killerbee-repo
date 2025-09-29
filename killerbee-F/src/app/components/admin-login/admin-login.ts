// src/app/components/admin-login/admin-login.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLogin {
  admin = { name: '', password: '' };
  isSubmitting = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isSubmitting) return;

    console.log('Admin login payload:', this.admin);
    this.isSubmitting = true;

    this.authService.login(this.admin).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
          localStorage.setItem('token', response.accessToken);

        // ✅ Just use user info, token is already in cookie
        localStorage.setItem('user_id', response.user.id.toString());
        localStorage.setItem('role_id', response.user.role_id.toString());

        if (response.user.role_id === 1) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          alert('Access denied: Only Admins can log in here.');
          localStorage.clear();
        }
      },
      error: (error) => {
        console.error('Admin login failed:', error);
        alert('Login failed. Please try again.');
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
