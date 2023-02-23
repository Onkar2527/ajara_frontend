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

// antd imports
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { PersonalComponent } from './personal/personal.component';
import { DepositComponent } from './deposit/deposit.component';
import { NominationComponent } from './nomination/nomination.component';
import { ServicesComponent } from './services/services.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@NgModule({
  declarations: [
    AddAccountComponent,
    PersonalComponent,
    DepositComponent,
    NominationComponent,
    ServicesComponent
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
    NzCheckboxModule
  ],
  providers: [


    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AddAccountComponent]

})
export class AddAccountModule { }
