import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-factory-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './factory-dashboard.html',
  styleUrl: './factory-dashboard.css'
})
export class FactoryDashboard  implements OnInit {
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

  // Load all models
  loadModels() {
    this.http.get<any[]>('http://localhost:5000/api/v1/models', this.getAuthHeaders())
      .subscribe(data => this.models = data);
  }

  // Load only validated processes for a given model
  loadProcesses(modelId: number) {
    this.selectedModelId = modelId;
    this.http.get<any[]>(`http://localhost:5000/api/v1/processes/${modelId}`, this.getAuthHeaders())
      .subscribe(data => {
        this.processes = data.filter(proc => proc.validated === true); // ✅ Only validated
      });
  }

  // Execute a process step
  executeProcess(processId: number) {
    this.http.put(`http://localhost:5000/api/v1/processes/${processId}/execute`, {}, this.getAuthHeaders())
      .subscribe(() => {
        alert("Process executed successfully 🚀");
        if (this.selectedModelId) {
          this.loadProcesses(this.selectedModelId);
        }
      });
  }
}