import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeeUrl = 'http://localhost:5000/api/v1/employees';

  constructor(private http: HttpClient) {} // Router not used here, so I've removed it for brevity

  // 🔹 Register employee (admin only)
  registerEmployee(user: { name: string; email: string; password: string; role_id: number }): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("❌ No token found in localStorage. Cannot proceed with registration.");
      // Optional: Handle this case by throwing an error or redirecting
      // this.router.navigate(['/login']); 
      return new Observable(observer => observer.error("No authentication token found."));
    }

    // 1. Create headers ONCE and ensure the token is included.
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // This is the crucial line for authorization
      'Authorization': `Bearer ${token}` 
    });

    console.log("🚀 Sending request with token:", token.substring(0, 10) + '...'); // Print partial token for security

    // 2. Pass the created 'headers' object to the request options.
    return this.http.post(
      this.employeeUrl,
      user, // Send the plain user object; Angular handles JSON.stringify
      { headers: headers }
    );
  }
}