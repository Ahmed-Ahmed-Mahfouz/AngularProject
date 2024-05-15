// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RoleGuardService } from './services/role-guard.service';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: ['User', 'Admin'] },
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: ['User', 'Admin'] },
  },
  {
    path: 'products/:id/edit',
    component: EditProductComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'Admin' },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'Admin' },
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '**',
    component: NotFoundComponent,
    data: { hideNavbarFooter: true },
  },
];
