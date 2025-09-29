import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';


@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  user = {name:'',email: '',password:'',role_id:3};
  constructor(private employeeService:EmployeeService,private router: Router){}


onSubmit() {
    this.user.role_id = +this.user.role_id; // Using the unary plus operator

   
    this.employeeService.registerEmployee(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']); // Redirect to the book list page
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }}