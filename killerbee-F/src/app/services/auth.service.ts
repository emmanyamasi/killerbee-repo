import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:5000/api/v1/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Clear localStorage before login to prevent stale data
  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role_id');
  }

  // 🔹 Register admin only
  registerAdmin(admin: { name: string; email: string; password: string }): Observable<any> {
    const adminData = { ...admin, role_id: 1 };
    return this.http.post(`${this.authUrl}/admin-register`, adminData, { withCredentials: true });
  }

  // 🔹 Admin login only
  login(admin: { name: string; password: string }): Observable<any> {
    this.clearStorage();
    return this.http.post<any>(`${this.authUrl}/login`, admin, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('Full admin login response:', response);

        if (response && response.user && response.accessToken) {
          // Check role_id is Admin (1)
          if (response.user.role_id !== 1) {
            throw new Error('Unauthorized: Not an admin');
          }

          // Store token + user data
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('user_id', response.user.id.toString());
          localStorage.setItem('role_id', response.user.role_id.toString());

          // Redirect to admin dashboard
          this.router.navigate(['/admin-dashboard']);
        } else {
          throw new Error('Invalid admin login response');
        }
      })
    );
  }

  // Helpers
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('user_id') || '0', 10);
  }

  getRoleId(): number {
    return parseInt(localStorage.getItem('role_id') || '0', 10);
  }

  isAdmin(): boolean {
    return this.getRoleId() === 1;
  }

  logout(): void {
    this.clearStorage();
    this.router.navigate(['/login']);
  }
}
