import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAccountComponent } from './add-account/add-account.component';
import { DepositComponent } from './deposit/deposit.component';
import { NominationComponent } from './nomination/nomination.component';
import { PersonalComponent } from './personal/personal.component';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [
  {
    path: "tabs", component: AddAccountComponent,
    children: [
      { path: "personal", component: PersonalComponent },
      { path: "deposit", component: DepositComponent },
      { path: "nomination", component: NominationComponent },
      { path: "services", component: ServicesComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAccountRoutingModule { }
