import { Routes } from '@angular/router';


import { Home } from './components/home/home';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';

import { AdminLogin } from './components/admin-login/admin-login';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { RdDashboard } from './components/rd-dashboard/rd-dashboard';
import { FactoryDashboard } from './components/factory-dashboard/factory-dashboard';
import { TestDashboard } from './components/test-dashboard/test-dashboard';

export const routes: Routes = [


    { path: '', component: Home },

    { path: 'create-employee', component: RegisterComponent },
   // { path: 'admin-register', component: AdminRegisterComponent },
    { path: 'admin-login', component: AdminLogin },
    { path: 'admin-dashboard', component: AdminDashboard },
    { path: 'rd-dashboard', component: RdDashboard },
  { path: 'test-dashboard', component: TestDashboard },
  { path: 'factory-dashboard', component: FactoryDashboard },

    { path: 'login', component: LoginComponent },
];