import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:5000/api/v1/auth';
  private employeeUrl = 'http://localhost:5000/api/v1/employees';

  constructor(private http: HttpClient, private router: Router) {}

  // 🔹 Register admin (force role_id = 1)
  registerAdmin(admin: { name: string; email: string; password: string }): Observable<any> {
    const adminData = { ...admin, role_id: 1 };
    return this.http.post(`${this.authUrl}/admin-register`, adminData, { withCredentials: true });
  }

  // 🔹 Register employee (admin only)
  registerEmployee(user: { name: string; email: string; password: string; role_id: number }): Observable<any> {
    const token = localStorage.getItem('token'); // 👈 grab saved token
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.post(`${this.employeeUrl}/register`, user, {
      withCredentials: true,
      headers,
    });
  }

  // 🔹 Login (admin or employee)
  login(user: { name: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, user, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('Full login response:', response);

        if (response && response.user) {
          // ✅ Save user info
          localStorage.setItem('user_id', response.user.id.toString());
          localStorage.setItem('role_id', response.user.role_id.toString());

          // ✅ Save access token (needed for employee registration)
          if (response.accessToken) {
            localStorage.setItem('token', response.accessToken);
          }

          // ✅ Redirect based on role
          switch (response.user.role_id) {
            case 1: this.router.navigate(['/admin-dashboard']); break; // Admin
            case 2: this.router.navigate(['/rd-dashboard']); break;   // R&D
            case 3: this.router.navigate(['/test-dashboard']); break; // Test
            case 4: this.router.navigate(['/factory-dashboard']); break; // Factory
            default:
              console.warn('Unknown role, redirecting to home');
              this.router.navigate(['/']);
          }
        } else {
          console.error('No user found in login response.');
        }
      })
    );
  }

  // 🔹 Logout
  logout(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role_id');
    localStorage.removeItem('token'); // 👈 clear token too

    this.http.post(`${this.authUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => console.log('User logged out successfully'),
      error: (error) => console.error('Logout error:', error),
    });
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('user_id') || '0', 10);
  }

  getRoleId(): number {
    return parseInt(localStorage.getItem('role_id') || '0', 10);
  }
}
