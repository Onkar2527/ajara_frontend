import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProposalComponent } from './proposal/proposal.component';
import { MastersComponent } from './admin-panel/masters/masters.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PasswordManagerComponent } from './admin-panel/password-manager/password-manager.component';
import { PasswordChangeComponent } from './login/password-change/password-change.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  { path: 'proposal', component: ProposalComponent },
  { path: 'masters', component: MastersComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'password-manager', component: PasswordManagerComponent },
  { path: "reset-password", component: PasswordChangeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
