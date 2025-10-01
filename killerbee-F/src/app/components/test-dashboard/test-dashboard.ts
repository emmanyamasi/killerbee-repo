import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-test-dashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './test-dashboard.html',
  styleUrl: './test-dashboard.css'
})
export class TestDashboard  implements OnInit {


models: any[] = [];
  processes: any[] = [];
  selectedModelId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadModels();
  }

  getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  // Load all models (FreezeBee Classic, Max, etc.)
  loadModels() {
    this.http.get<any[]>('http://localhost:5000/api/v1/models', this.getAuthHeaders())
      .subscribe(data => this.models = data);
  }

  // Load all processes for a given model
  loadProcesses(modelId: number) {
    this.selectedModelId = modelId;
    this.http.get<any[]>(`http://localhost:5000/api/v1/processes/${modelId}`, this.getAuthHeaders())
      .subscribe(data => this.processes = data);
  }

  // Validate a process step
  validateProcess(processId: number) {
    this.http.put(`http://localhost:5000/api/v1/processes/${processId}/validate`, {}, this.getAuthHeaders())
      .subscribe(() => {
        alert("Process step validated ✅");
        if (this.selectedModelId) {
          this.loadProcesses(this.selectedModelId); // reload after update
        }
      });
  }
}
