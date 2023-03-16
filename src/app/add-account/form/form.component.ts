import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Facilities } from 'src/app/models/facilities';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { BasicInfo } from 'src/app/models/basicInfo';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  basicInfo: BasicInfo = new BasicInfo();
  depositInfo: TermDeposite = new TermDeposite();
  serviceInfo: Facilities = new Facilities();
  nominationInfo: NomineeDetails = new NomineeDetails();

  constructor(private api: ApiService, private message: NzNotificationService) { }
  APPLICANT_ID?: number;
  ngOnInit(): void {
  }
  pdfSrc = '../../../assets/FACO Adobe Form.pdf'
  pdfDoc: any;
  pdfByte: any
  showPdf: boolean = false;

  fieldMap = []

  async fillPdf() {
    console.error("In pdfFill");
    const formPdfBytes = await fetch(this.pdfSrc).then(res => res.arrayBuffer());
    this.pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = this.pdfDoc.getForm();

    // let name: string[] = this.splitName(this.basicInfo.PRIMARY_APPLICANT_NAME);

    // if (name.length > 2) {
    //   form.getTextField('AP1_FIRST_NAME').setText(name[0]);
    //   form.getTextField('AP1_MIDDLE_NAME').setText(name[1]);
    //   form.getTextField('AP1_LAST_NAME').setText(name[2]);
    // }
    // let name2: string[] = this.splitName(this.basicInfo.APPLICANT2);
    // if (name2.length > 2) {
    //   form.getTextField('AP2_FIRST_NAME').setText(name2[0]);
    //   form.getTextField('AP2_MIDDLE_NAME').setText(name2[1]);
    //   form.getTextField('AP2_LAST_NAME').setText(name2[2]);
    // }
    // let name3: string[] = this.splitName(this.basicInfo.APPLICANT3);
    // if (name3.length > 2) {
    //   form.getTextField('AP3_FIRST_NAME').setText(name3[0]);
    //   form.getTextField('AP3_MIDDLE_NAME').setText(name3[1]);
    //   form.getTextField('AP3_LAST_NAME').setText(name3[2]);
    // }
    // let name4: string[] = this.splitName(this.basicInfo.APPLICANT4);
    // if (name4.length > 2) {
    //   form.getTextField('AP4_FIRST_NAME').setText(name4[0]);
    //   form.getTextField('AP4_MIDDLE_NAME').setText(name4[1]);
    //   form.getTextField('AP4_LAST_NAME').setText(name4[2]);
    // }

    if (this.basicInfo.IS_MINOR) {
      let gName: string[] = this.splitName(this.basicInfo.GUARDIAN_NAME);
      if (gName.length == 3) {
        form.getTextField('G_FIRST_NAME').setText(gName[0]);
        form.getTextField('G_MIDDLE_NAME').setText(gName[1]);
        form.getTextField('G_LAST_NAME').setText(gName[2]);
      }
      else if (gName.length == 4) {
        form.getTextField('TITLE').setText(gName[0]);
        form.getTextField('G_FIRST_NAME').setText(gName[1]);
        form.getTextField('G_MIDDLE_NAME').setText(gName[2]);
        form.getTextField('G_LAST_NAME').setText(gName[3]);
      }

      if (this.basicInfo.MINOR_DOB) {
        let dob = this.splitDate(this.basicInfo.MINOR_DOB);
        form.getTextField('D11').setText(dob[0]);
        form.getTextField('D12').setText(dob[1]);
        form.getTextField('D13').setText(dob[2]);
        form.getTextField('D14').setText(dob[3]);
        form.getTextField('D15').setText(dob[4]);
        form.getTextField('D16').setText(dob[5]);
        form.getTextField('D17').setText(dob[6]);
        form.getTextField('D18').setText(dob[7]);
      }
      if (this.basicInfo.GUARDIAN_DOB) {
        let dob = this.splitDate(this.basicInfo.GUARDIAN_DOB);
        form.getTextField('D21').setText(dob[0]);
        form.getTextField('D22').setText(dob[1]);
        form.getTextField('D23').setText(dob[2]);
        form.getTextField('D24').setText(dob[3]);
        form.getTextField('D25').setText(dob[4]);
        form.getTextField('D26').setText(dob[5]);
        form.getTextField('D27').setText(dob[6]);
        form.getTextField('D28').setText(dob[7]);
      }
      if (this.basicInfo.RELATION_WITH_MINOR == 'F') {
        form.getCheckBox('Check Box3').check();
      }
      else if (this.basicInfo.RELATION_WITH_MINOR == 'M') {
        form.getCheckBox('Check Box4').check();
      }
      else if (this.basicInfo.RELATION_WITH_MINOR == 'C') {
        form.getCheckBox('Check Box5').check();
      }
      else if (this.basicInfo.RELATION_WITH_MINOR == 'O') {
        form.getCheckBox('Check Box6').check();
      }



    }
    if (this.basicInfo.IS_INTRODUCED) {
      form.getCheckBox('Check Box34').check();
      if (this.basicInfo.E_CUSTOMER_NAME) {
        let exName: string[] = this.splitName(this.basicInfo.E_CUSTOMER_NAME);
        if (exName.length > 2) {
          form.getTextField('I_FIRST_NAME').setText(exName[0]);
          form.getTextField('I_MIDDLE_NAME').setText(exName[1]);
          form.getTextField('I_LAST_NAME').setText(exName[2]);
        }
      }
      if (this.basicInfo.E_CUSTOMER_ID) {
        let costomer_id: string[] = this.splitInBlock(this.basicInfo.E_CUSTOMER_ID);
        if (costomer_id.length <= 10) {
          for (let i = 0; i < costomer_id.length; i++) {
            form.getTextField('I' + (i + 1).toString()).setText(costomer_id[i]);
          }
        }
      }
      if (this.basicInfo.E_ACCOUNT_NUMBER) {
        let account_no: string[] = this.splitInBlock(this.basicInfo.E_ACCOUNT_NUMBER);
        if (account_no.length <= 16) {
          for (let i = 0; i < account_no.length; i++) {
            form.getTextField('A1' + (i + 1).toString()).setText(account_no[i]);

          }
        }
      }
      if (this.basicInfo.E_YEARS) {
        form.getTextField('I_YEARS').setText(this.basicInfo.E_YEARS.toString())
      }
    }

    if (this.depositInfo.ACCOUNT_TYPE) {
      if (this.depositInfo.ACCOUNT_TYPE == 'S') {
        form.getCheckBox('Check Box2').check();
      }
      else if (this.depositInfo.ACCOUNT_TYPE == 'F') {
        form.getCheckBox('Check Box49').check();
      }
      else if (this.depositInfo.ACCOUNT_TYPE == 'R') {
        form.getCheckBox('Check Box50').check();
      }
      else if (this.depositInfo.ACCOUNT_TYPE == 'P') {
        form.getCheckBox('Check Box51').check();
      }
    }

    if (this.depositInfo.DEPOSIT_AMOUNT) {
      let deposit_amount: string[] = this.splitInBlock(this.depositInfo.DEPOSIT_AMOUNT.toString());
      if (deposit_amount.length <= 10) {
        for (let i = 0; i < deposit_amount.length; i++) {
          form.getTextField('DA' + (i + 1).toString()).setText(deposit_amount[i]);
        }
      }
    }

    if (this.depositInfo.RATE_OF_INTEREST) {
      form.getTextField('RATE_OF_INTEREST').setText(this.depositInfo.RATE_OF_INTEREST.toString());
    }

    if (this.depositInfo.TANURE_DAYS) {
      form.getTextField('T_DAYS').setText(this.depositInfo.TANURE_DAYS.toString());
    }
    if (this.depositInfo.TANURE_MONTHS) {
      form.getTextField('T_MONTHS').setText(this.depositInfo.TANURE_MONTHS.toString());
    }
    if (this.depositInfo.TANURE_YEARS) {
      form.getTextField('T_YEARS').setText(this.depositInfo.TANURE_YEARS.toString());
    }

    if (this.depositInfo.DEPOSIT_ACCOUNT_NUMBER) {
      let d_account = this.splitInBlock(this.depositInfo.DEPOSIT_ACCOUNT_NUMBER);
      if (d_account.length <= 16) {
        for (let i = 0; i < d_account.length; i++) {
          form.getTextField('ACC' + (i + 1).toString()).setText(d_account[i]);
        }
      }
    }


    if (this.depositInfo.DEPOSIT_BANK_NAME) {
      let d_account = this.splitInBlock(this.depositInfo.DEPOSIT_BANK_NAME);
      if (d_account.length <= 25) {
        for (let i = 0; i < d_account.length; i++) {
          form.getTextField('B_NAME' + (i + 1).toString()).setText(d_account[i]);
        }
      }
    }

    if (this.depositInfo.DEPOSIT_BRANCH_NAME) {
      let d_account = this.splitInBlock(this.depositInfo.DEPOSIT_BRANCH_NAME);
      if (d_account.length <= 25) {
        for (let i = 0; i < d_account.length; i++) {
          form.getTextField('BR_NAME' + (i + 1).toString()).setText(d_account[i]);
        }
      }
    }
    if (this.depositInfo.DEPOSIT_IFSC_CODE) {
      let d_account = this.splitInBlock(this.depositInfo.DEPOSIT_IFSC_CODE);
      if (d_account.length <= 11) {
        for (let i = 0; i < d_account.length; i++) {
          form.getTextField('IFSC' + (i + 1).toString()).setText(d_account[i]);
        }
      }
    }



    if (this.nominationInfo.IS_MINOR) {
      // form.getCheckBox('Check Box32').check();

      if (this.nominationInfo.DOB) {
        let dob = this.splitDate(this.nominationInfo.DOB);
        if (dob.length <= 8) {
          for (let i = 0; i < dob.length; i++) {
            form.getTextField('D' + (i + 31).toString()).setText(dob[i]);
          }
        }
      }

      if (this.nominationInfo.APONITED_NAME) {
        form.getTextField('ADDRESS_LINE_1').setText(this.nominationInfo.APONITED_NAME);
      }
      if (this.nominationInfo.APONITED_ADDRESS) {
        form.getTextField('ADDRESS_LINE_2').setText(this.nominationInfo.APONITED_ADDRESS);
      }
    }
    if (this.nominationInfo.RELATION) {
      form.getTextField('RELATION_WTH_APPLICANT').setText(this.nominationInfo.RELATION);
    }
    if (this.nominationInfo.NOMINEE_NAME) {
      form.getTextField('NOMINEE_ADDRESS_LINE_1').setText(this.nominationInfo.NOMINEE_NAME);
    }
    if (this.nominationInfo.NOMINEE_ADDRESS) {
      form.getTextField('NOMINEE_ADDRESS_LINE_2').setText(this.nominationInfo.NOMINEE_ADDRESS);
    }

    if (this.serviceInfo.CHEQUE_BOOK) {
      form.getCheckBox('Check Box42').check();
    }
    if (this.serviceInfo.PASS_BOOK) {
      form.getCheckBox('Check Box43').check();
    }
    if (this.serviceInfo.SMS_ALERT) {
      form.getCheckBox('Check Box46').check();
    }
    if (this.serviceInfo.STATEMENT_BY_EMAIL) {
      form.getCheckBox('Check Box44').check();
    }
    if (this.serviceInfo.CONSENT_NEW_PRODUCT) {
      form.getCheckBox('Check Box45').check();
    }

    if (this.serviceInfo.ATM_CARD) {
      form.getCheckBox('Check Box47').check();
      if (this.serviceInfo.APPLICANT1_NAME) {
        let app_name = this.splitInBlock(this.serviceInfo.APPLICANT1_NAME);
        if (app_name.length <= 20) {
          for (let i = 0; i < app_name.length; i++) {
            form.getTextField('AP1' + (i + 1).toString()).setText(app_name[i]);
          }
        }
      }

      if (this.serviceInfo.ADDON_CARD) {
        form.getCheckBox('Check Box48').check();
        if (this.serviceInfo.APPLICANT2_NAME) {
          let app_name = this.splitInBlock(this.serviceInfo.APPLICANT2_NAME);
          if (app_name.length <= 20) {
            for (let i = 0; i < app_name.length; i++) {
              form.getTextField('AP2' + (i + 1).toString()).setText(app_name[i]);
            }
          }
        }

        if (this.serviceInfo.APPLICANT3_NAME) {
          let app_name = this.splitInBlock(this.serviceInfo.APPLICANT3_NAME);
          if (app_name.length <= 20) {
            for (let i = 0; i < app_name.length; i++) {
              form.getTextField('AP3' + (i + 1).toString()).setText(app_name[i]);
            }
          }
        }

        if (this.serviceInfo.APPLICANT4_NAME) {
          let app_name = this.splitInBlock(this.serviceInfo.APPLICANT4_NAME);
          if (app_name.length <= 20) {
            for (let i = 0; i < app_name.length; i++) {
              form.getTextField('AP4' + (i + 1).toString()).setText(app_name[i]);
            }
          }
        }

      }

    }

    if (this.depositInfo.INTEREST_PAYOUT == 'M') {
      form.getCheckBox('Check Box19').check();
    }
    else if (this.depositInfo.INTEREST_PAYOUT == 'Q') {
      form.getCheckBox('Check Box20').check();
    }
    else if (this.depositInfo.INTEREST_PAYOUT == 'H') {
      form.getCheckBox('Check Box21').check();
    }
    else if (this.depositInfo.INTEREST_PAYOUT == 'Y') {
      form.getCheckBox('Check Box22').check();
    }
    else if (this.depositInfo.INTEREST_PAYOUT == 'O') {
      form.getCheckBox('Check Box23').check();
    }



    if (this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'S') {
      form.getCheckBox('Check Box25').check();
    }
    else if (this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'E') {
      form.getCheckBox('Check Box26').check();
    }
    else if (this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'P') {
      form.getCheckBox('Check Box27').check();
    }
    else if (this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'O') {
      form.getCheckBox('Check Box24').check();
    }


    if (this.depositInfo.AUTO_RENEWAL) {
      form.getCheckBox('Check Box28').check();
    }


    if (this.depositInfo.TDS == 'T') {
      form.getCheckBox('Check Box30').check();
    }
    else if (this.depositInfo.TDS == 'N') {
      form.getCheckBox('Check Box31').check();
    }

    form.flatten();

    this.pdfByte = await this.pdfDoc.save()
    this.showPdf = true;


  }

  save() {
    var blob = new Blob([this.pdfByte], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    window.open(url);
  }


  getAllData() {
    let personal = this.getPersonal();
    let deposit = this.getDeposit();
    let service = this.getService();
    let nominee = this.getNominee();
    let count = 0;

    personal.subscribe({
      next: (res) => {
        if (res == 200) {
          
          count++;
          console.log("count in p",count);
          if (count >= 4) {
            this.fillPdf();
          }
        }
        else {
          this.message.error('Something went wrong!', '');
        }
      },
      error: () => {
        this.message.error('Something went wrong!', '');
      },
      complete: () => {

      }
    })
    deposit.subscribe({
      next: (res1) => {
        if (res1 == 200) {
  
          count++;
          console.log("count in d",count);
          if (count >= 4) {
            this.fillPdf();
          }
        }
        else {
          this.message.error('Something went wrong!', '');
        }
      },
      error: () => {
        this.message.error('Something went wrong!', '');
      },
      complete: () => {

      }
    })
    nominee.subscribe({
      next: (res3) => {
       
        if (res3 == 200) {
          
          count++;
          console.log("count in n",count);
          if (count >= 4) {
            this.fillPdf();
          }
        }
        else {
          this.message.error('Something went wrong!', '');
        }
      },
      error: () => {
        this.message.error('Something went wrong!', '');
      },
      complete: () => {

      }
    })
    service.subscribe({
      next: (res2) => {
        if (res2 == 200) {
          
          count++;
          console.log("count in p",count);
          if (count >= 4) {
            this.fillPdf();
          }
        }
        else {
          this.message.error('Something went wrong!', '');
        }
      },
      error: () => {
        this.message.error('Something went wrong!', '');
      },
      complete: () => {

      }
    })
  }

  getPersonal() {
    let personal: Subject<any> = new Subject();
    this.api.getPersonal(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.basicInfo = res['data'][0];
          personal.next(200);
        }
        else {
          personal.next(res);
        }
      },
      error: (err) => {
        personal.error(err);
      },
      complete: () => {
        personal.complete();
      }
    });
    return personal;
  }

  getDeposit() {
    let deposit: Subject<any> = new Subject();
    this.api.getDeposite(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.depositInfo = res['data'][0];
          deposit.next(200);
        }
        else {
          deposit.next(res);
        }
      },
      error: (err) => {
        deposit.error(err);
      },
      complete: () => {
        deposit.complete();
      }
    });
    return deposit;
  }

  getService() {
    let service: Subject<any> = new Subject();
    this.api.getService(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.serviceInfo = res['data'][0];
          console.log("service info:", this.serviceInfo);

          service.next(200);
        }
        else {
          service.next(res);
        }
      },
      error: (err) => {
        service.error(err);
      },
      complete: () => {
        service.complete();
      }
    });
    return service;
  }
  getNominee() {
    let nominee: Subject<any> = new Subject();
    this.api.getNominee(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.nominationInfo = res['data'][0];
          console.log("nominee info:", this.nominationInfo);
          nominee.next(200);
        }
        else {
          nominee.next(res);
        }
      },
      error: (err) => {
        nominee.error(err);
      },
      complete: () => {
        nominee.complete();
      }
    });
    return nominee;
  }
  splitName(str: string): string[] {
    let res: string[] = []
    if (str) {
      res = str.split(' ');
    }
    return res;
  }
  splitDate(date: string): string[] {
    let res: string[] = [];
    let ires: string[] = [];

    if (date) {
      ires = this.splitInBlock(date);
      if (ires.length > 7) {
        for (let i = 0; i < ires.length; i++) {
          if (ires[i] != '-' && ires[i] != '/') {
            res.push(ires[i])
          }
        }
      }
    }
    return res;
  }
  splitInBlock(str: string): string[] {
    let res: string[] = []
    if (str) {
      for (let i = 0; i < str.length; i++) {
        res.push(str.charAt(i));
      }

    }

    return res;
  }




}
