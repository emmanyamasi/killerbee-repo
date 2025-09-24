import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {



  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/admin-register']);
  }


 goToAdminLogin() {
    this.router.navigate(['/admin-login']); // admin login
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}

