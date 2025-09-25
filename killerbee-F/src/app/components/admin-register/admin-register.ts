import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-register',
  standalone: true,            // if you are using standalone components
  imports: [FormsModule],
  templateUrl: './admin-register.html',
  styleUrls: ['./admin-register.css']
})
export class AdminRegisterComponent {
  admin = { name: '', email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Always force role_id = 1 for admins
    const adminData = { ...this.admin, role_id: 1 };

    this.authService.registerAdmin(adminData).subscribe({
      next: (response) => {
        console.log('Admin registration successful:', response);
        alert('Admin account created successfully!');
        this.router.navigate(['/admin-login']); // redirect to login page
      },
      error: (error) => {
        console.error('Admin registration failed:', error);
        alert('Admin registration failed. Please try again.');
      }
    });
  }
}
