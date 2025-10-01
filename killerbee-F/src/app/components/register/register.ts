import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'], // ✅ plural
  standalone: true
})
export class RegisterComponent {
  // Define available roles (exclude Admin to avoid accidental admin creation)
  roles = [
    { id: 2, name: 'R&D' },
    { id: 3, name: 'Test' },
    { id: 4, name: 'Factory' }
  ];

  user = { name: '', email: '', password: '', role_id: 2 }; // default = R&D

  constructor(private employeeService: EmployeeService, private router: Router) {}

  onSubmit() {
    this.employeeService.registerEmployee(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/admin-dashboard']); // Redirect to admin dashboard after successful registration
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
