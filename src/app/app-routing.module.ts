import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "new-account",
    loadChildren: () => import('./add-account/add-account.module').then(m => m.AddAccountModule),
  },
  {
    path: "login",
    loadComponent: () => import('./login/login.component').then(x => x.LoginComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
  
}
