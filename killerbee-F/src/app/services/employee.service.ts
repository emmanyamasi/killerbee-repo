import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,tap } from 'rxjs';
import { AuthService } from './auth.service'; // ✅ import auth service
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeeUrl = 'http://localhost:5000/api/v1/employees';

  constructor(private http: HttpClient, private authService: AuthService  ,private router: Router) {}

  registerEmployee(user: { name: string; email: string; password: string; role_id: number }): Observable<any> {
    const token = this.authService.getToken();   // ✅ always use auth service
    const roleId = this.authService.getRoleId(); // ✅ check role

    if (!token) {
      return new Observable(observer => observer.error("❌ No authentication token found."));
    }
     console.log("🚀 Token being sent:", token); // 👈 ADD THIS LINE

    if (roleId !== 1) { // ✅ Block employees from creating employees
      return new Observable(observer => observer.error("❌ Only Admin can create employees."));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.employeeUrl, user, { headers });



    
  }


// 🔹 Employee login
  loginEmployee(user: { name: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.employeeUrl}/login`, user, { withCredentials: true }).pipe(
      tap((response) => {
        if (response && response.user && response.accessToken) {
          // Save token + user info
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('user_id', response.user.id.toString());
          localStorage.setItem('role_id', response.user.role_id.toString());

          // Redirect based on role
          switch (response.user.role_id) {
            case 2: this.router.navigate(['/rd-dashboard']); break;
            case 3: this.router.navigate(['/test-dashboard']); break;
            case 4: this.router.navigate(['/factory-dashboard']); break;
            default: this.router.navigate(['/']); break;
          }
        } else {
          throw new Error('Invalid employee login response');
        }
      })
    );
  }
}
