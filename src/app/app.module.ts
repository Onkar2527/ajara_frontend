//System Imports

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

//User Imports
import { LoginComponent } from './login/login.component';

import { ProposalComponent } from './proposal/proposal.component';
import { AddAccountComponent } from './add-account/add-account/add-account.component';
import { ApplicantDetailsComponent } from './add-account/applicant-details/applicant-details.component';
import { ApplicantFinancialComponent } from './add-account/applicant/applicant-financial/applicant-financial.component';
import { ApplicantLoanInfoComponent } from './add-account/applicant/applicant-loan-info/applicant-loan-info.component';
import { ApplicantOtherBankAccountComponent } from './add-account/applicant/applicant-other-bank-account/applicant-other-bank-account.component';
import { ApplicantPersonalComponent } from './add-account/applicant/applicant-personal/applicant-personal.component';
import { ApplicantPropertyComponent } from './add-account/applicant/applicant-property/applicant-property.component';
import { ApplicantTabsComponent } from './add-account/applicant/applicant-tabs/applicant-tabs.component';
import { DepositComponent } from './add-account/deposit/deposit.component';
import { FormComponent } from './add-account/form/form.component';
import { NominationComponent } from './add-account/nomination/nomination.component';
import { PersonalComponent } from './add-account/personal/personal.component';
import { ServicesComponent } from './add-account/services/services.component';
import { WebCamComponent } from './add-account/web-cam/web-cam.component';

// import {LoginComponent} from 'src/app/login/login.component';
import { WebcamModule } from 'ngx-webcam';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import {NgxMaskModule} from 'ngx-mask'
import { NgxMaskModule, IConfig } from 'ngx-mask'
//Antd Imports

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

import { MakerVerificationComponent } from './verification/maker-verification/maker-verification.component';
import { CheckerVerificationComponent } from './verification/checker-verification/checker-verification.component';
import { VerifierVerificationComponent } from './verification/verifier-verification/verifier-verification.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { RemarkCompComponent } from './add-account/remark-comp/remark-comp.component';
import { MastersComponent } from './admin-panel/masters/masters.component';
import { DropdownEditComponent } from './admin-panel/masters/dropdown-edit/dropdown-edit.component';
import { DropdownItemsEditComponent } from './admin-panel/masters/dropdown-items-edit/dropdown-items-edit.component';
import { EditStatusComponent } from './admin-panel/proposal-master/edit-status/edit-status.component';

export const options: Partial<null|IConfig> | (() => Partial<IConfig>) = null;

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProposalComponent,
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
    ApplicantFinancialComponent,
    ApplicantOtherBankAccountComponent,
    ApplicantLoanInfoComponent,
    ApplicantPropertyComponent,
    AddAccountComponent,
    MakerVerificationComponent,
    CheckerVerificationComponent,
    VerifierVerificationComponent,
    RemarkCompComponent,
    MastersComponent,
    DropdownEditComponent,
    DropdownItemsEditComponent,
    EditStatusComponent
  ],
  imports: [
    //System Imports
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,


    // user
    WebcamModule,
    PdfViewerModule,
    NgxMaskModule.forRoot(),
    // NgxMaskModule,
    //Antd Imports
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    NzDividerModule,
    NzRadioModule,
    NzNotificationModule,
    NzTableModule,
    NzDrawerModule,
    NzTabsModule,
    NzFormModule,
    NzInputModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzListModule,
    NzSelectModule,
    NzUploadModule,
    NzPopconfirmModule,
    NzAvatarModule,
    NzPopoverModule,
    NzToolTipModule,
    NzModalModule,
    NzCollapseModule
  ],
  providers: [

    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
