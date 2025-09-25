import { Routes } from '@angular/router';


import { Home } from './components/home/home';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';
import { AdminRegisterComponent } from './components/admin-register/admin-register';
import { AdminLogin } from './components/admin-login/admin-login';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';

export const routes: Routes = [


    { path: '', component: Home },

    { path: 'create-employee', component: RegisterComponent },
   // { path: 'admin-register', component: AdminRegisterComponent },
    { path: 'admin-login', component: AdminLogin },
    { path: 'admin-dashboard', component: AdminDashboard },
    

    { path: 'login', component: LoginComponent },
];