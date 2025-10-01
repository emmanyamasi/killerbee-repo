// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  user = { name: '', password: '' };
  isSubmitting = false;

  constructor(private employeeService:EmployeeService, private router: Router) {}

  onSubmit() {
    if (this.isSubmitting) {
      console.log('Already submitting, ignoring');
      return;
    }

    console.log('onSubmit called');
    console.log('Login payload:', this.user);

    this.isSubmitting = true;

    this.employeeService.loginEmployee(this.user).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // ✅ Save token and user info
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('user_id', response.user.id.toString());
          localStorage.setItem('role_id', response.user.role_id.toString());

          // ✅ Role-based redirects (matching your DB)
          switch (response.user.role_id) {
            case 1: // Admin
              this.router.navigate(['/admin-dashboard']);
              break;
            case 2: // R&D Department
              this.router.navigate(['/rd-dashboard']);
              break;
            case 3: // Test Department
              this.router.navigate(['/test-dashboard']);
              break;
            case 4: // Factory
              this.router.navigate(['/factory-dashboard']);
              break;
            default:
              this.router.navigate(['/']);
              break;
          }
        } else {
          console.error('No access token received.');
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
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
