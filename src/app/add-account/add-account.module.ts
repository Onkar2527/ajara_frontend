//system imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAccountRoutingModule } from './add-account-routing.module';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// user Import
import { AddAccountComponent } from './add-account/add-account.component';
import { WebCamComponent } from './web-cam/web-cam.component';
import { PersonalComponent } from './personal/personal.component';
import { DepositComponent } from './deposit/deposit.component';
import { NominationComponent } from './nomination/nomination.component';
import { ServicesComponent } from './services/services.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
// antd imports
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTableModule } from 'ng-zorro-antd/table';
//other
import { FormComponent } from './form/form.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {WebcamModule} from 'ngx-webcam';
import { ApplicantTabsComponent } from './applicant/applicant-tabs/applicant-tabs.component';
import { ApplicantPersonalComponent } from './applicant/applicant-personal/applicant-personal.component';



@NgModule({
  declarations: [
    AddAccountComponent,
    PersonalComponent,
    DepositComponent,
    NominationComponent,
    ServicesComponent,
    FormComponent,
    WebCamComponent,
    ApplicantDetailsComponent,
    ApplicantTabsComponent,
    ApplicantPersonalComponent,
    
  ],
  imports: [
    // system imports
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    AddAccountRoutingModule,
    // antd imports
    NzFormModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    NzTabsModule,
    NzDividerModule,
    NzInputModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzRadioModule,
    NzCheckboxModule,
    NzSelectModule,
    NzListModule,
    NzDrawerModule,
    NzTableModule,
    // other
    PdfViewerModule,
    WebcamModule
  ],
  providers: [


    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AddAccountComponent]

})
export class AddAccountModule { }
