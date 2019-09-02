import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'billing',
    loadChildren: () => import('./pages/billing/billing.module').then(m => m.BillingPageModule)
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'customers', loadChildren: './pages/customers/customers.module#CustomersPageModule' },
  { path: 'invoices', loadChildren: './pages/invoices/invoices.module#InvoicesPageModule' },
  { path: 'invoice-details', loadChildren: './pages/invoice-details/invoice-details.module#InvoiceDetailsPageModule' },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersPageModule )
  },
  { path: 'billing', loadChildren: './pages/billing/billing.module#BillingPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
