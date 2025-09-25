import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,    
   // <-- add this
  imports: [RouterModule],  // <-- add this
             // ✅ if this is a standalone component
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'] // ✅ must be styleUrls
})
export class AdminDashboard {
  constructor() {}
}
