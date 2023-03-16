import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAccountComponent } from './add-account/add-account.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { DepositComponent } from './deposit/deposit.component';
import { FormComponent } from './form/form.component';
import { NominationComponent } from './nomination/nomination.component';
import { PersonalComponent } from './personal/personal.component';
import { ServicesComponent } from './services/services.component';
import { WebCamComponent } from './web-cam/web-cam.component';

const routes: Routes = [
  {
    path: "tabs", component: AddAccountComponent,
    children: [
      { path: "personal", component: PersonalComponent },
      { path: "deposit", component: DepositComponent },
      { path: "nomination", component: NominationComponent },
      { path: "services", component: ServicesComponent },
      { path: "form", component: FormComponent },
      { path: "web-cam", component: WebCamComponent },
      { path: "applicant", component:ApplicantDetailsComponent}
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAccountRoutingModule { }
