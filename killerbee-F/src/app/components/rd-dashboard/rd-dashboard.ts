import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rd-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './rd-dashboard.html',
  styleUrl: './rd-dashboard.css'
})
export class RdDashboard implements OnInit{

  models: any[] = [];
  ingredients: any[] = [];
  processes: any[] = [];

  // Form models
  newModel = { name: '', description: '', pUHT: '', range: '' };
  newIngredient = { name: '', description: '' };
  newProcess = { model_id: '', step_number: '', description: '' };
  newLink = { model_id: '', ingredient_id: '', weight: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadModels();
    this.loadIngredients();
  }

  getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  // MODELS CRUD
  loadModels() {
    this.http.get<any[]>('http://localhost:5000/api/v1/models', this.getAuthHeaders())
      .subscribe(data => this.models = data);
  }

  addModel() {
    this.http.post('http://localhost:5000/api/v1/models', this.newModel, this.getAuthHeaders())
      .subscribe(() => {
        this.loadModels();
        this.newModel = { name: '', description: '', pUHT: '', range: '' };
      });
  }

  deleteModel(id: number) {
    this.http.delete(`http://localhost:5000/api/v1/models/${id}`, this.getAuthHeaders())
      .subscribe(() => this.loadModels());
  }

  // INGREDIENTS CRUD
  loadIngredients() {
    this.http.get<any[]>('http://localhost:5000/api/v1/ingredients', this.getAuthHeaders())
      .subscribe(data => this.ingredients = data);
  }

  addIngredient() {
    this.http.post('http://localhost:5000/api/v1/ingredients', this.newIngredient, this.getAuthHeaders())
      .subscribe(() => {
        this.loadIngredients();
        this.newIngredient = { name: '', description: '' };
      });
  }

  deleteIngredient(id: number) {
    this.http.delete(`http://localhost:5000/api/v1/ingredients/${id}`, this.getAuthHeaders())
      .subscribe(() => this.loadIngredients());
  }

  // MODEL ↔ INGREDIENT LINK
  linkIngredient() {
    this.http.post('http://localhost:5000/api/v1/model-ingredients', this.newLink, this.getAuthHeaders())
      .subscribe(() => {
        alert('Ingredient linked to model!');
        this.newLink = { model_id: '', ingredient_id: '', weight: '' };
      });
  }

  // PROCESSES
  loadProcesses(modelId: number) {
    this.http.get<any[]>(`http://localhost:5000/api/v1/processes/${modelId}`, this.getAuthHeaders())
      .subscribe(data => this.processes = data);
  }

  addProcess() {
    this.http.post('http://localhost:5000/api/v1/processes', this.newProcess, this.getAuthHeaders())
      .subscribe(() => {
        this.loadProcesses(Number(this.newProcess.model_id));
        this.newProcess = { model_id: '', step_number: '', description: '' };
      });
  }
}

