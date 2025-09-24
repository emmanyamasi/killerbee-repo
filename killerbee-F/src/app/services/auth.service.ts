import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/v1/auth'; // Base API URL

  constructor(private http: HttpClient, private router: Router) {}

  register(user: { name: string; email: string; password: string; role_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { withCredentials: true });
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('Full login response:', response);

        if (response && response.user) {
          // ✅ Only store what backend sends
          localStorage.setItem('user_id', response.user.id.toString());
          localStorage.setItem('role_id', response.user.role_id.toString());

          // Role-based navigation
          switch (response.user.role_id) {
            case 1: // Admin
              this.router.navigate(['/admin-dashboard']);
              break;
            case 2: // Employer (if you add later)
              this.router.navigate(['/employer-dashboard']);
              break;
            case 3: // JobSeeker
              this.router.navigate(['/jobseeker-dashboard']);
              break;
            default:
              this.router.navigate(['/']);
          }
        } else {
          console.error('No user found in login response.');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role_id');

    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
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
