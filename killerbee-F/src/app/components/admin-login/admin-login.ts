// src/app/components/admin-login/admin-login.component.ts
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
    if (this.isSubmitting) {
      console.log('Already submitting, ignoring');
      return;
    }

    console.log('Admin login payload:', this.admin);
    this.isSubmitting = true;

    this.authService.login(this.admin).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        if (response.access_token) {

          localStorage.setItem('user_id', response.user.id.toString());
          localStorage.setItem('role_id', response.user.role_id.toString());

          if (response.user.role_id === 1) {
            // ✅ Admin only
            this.router.navigate(['/admin-dashboard']);
          } else {
            alert('Access denied: Only Admins can log in here.');
            localStorage.clear(); // clear non-admin tokens
          }
        } else {
          console.error('No access token received.');
        }
      },
      error: (error) => {
        console.error('Admin login failed:', error);
        console.log('Status:', error.status);
        console.log('Message:', error.message);
        console.log('Error details:', error.error);
        alert('Login failed. Please try again.');
        this.isSubmitting = false;
      },
      complete: () => {
        console.log('Login request completed');
        this.isSubmitting = false;
      },
    });
  }
}
