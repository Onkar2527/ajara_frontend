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
  pdfSrc2 = '../../../assets/Applicants Form.pdf'


  pdfDoc: any;
  pdfByte: any
  showPdf: boolean = false;

  pdfDocApplicant: any[4];
  ApplicantForm: any[4];




  fieldMap: FormField[] = []
  fieldMap2: FormField[] = []
  fieldMap3: FormField[] = []

  fillField(){
    this.fieldMap = [
      { field: 'AP1_FIRST_NAME', type: 'text', value: this.basicInfo.PRIMARY_APPLICANT_FIRST_NAME ? this.basicInfo.PRIMARY_APPLICANT_FIRST_NAME : " " },
      { field: 'AP1_MIDDLE_NAME',type:'text',value: this.basicInfo.PRIMARY_APPLICANT_MIDDLE_NAME ? this.basicInfo.PRIMARY_APPLICANT_MIDDLE_NAME : ' '},
      { field: 'AP1_LAST_NAME',type:'text',value: this.basicInfo.PRIMARY_APPLICANT_MIDDLE_NAME ? this.basicInfo.PRIMARY_APPLICANT_LAST_NAME : ' '},

      { field: 'AP2_FIRST_NAME', type: 'text', value: this.basicInfo.APPLICANT2_FIRST_NAME? this.basicInfo.APPLICANT2_FIRST_NAME: " " },
      { field: 'AP2_MIDDLE_NAME',type:'text',value: this.basicInfo.APPLICANT2_MIDDLE_NAME ? this.basicInfo.APPLICANT2_MIDDLE_NAME : ' '},
      { field: 'AP2_LAST_NAME',type:'text',value: this.basicInfo.APPLICANT2_LAST_NAME ? this.basicInfo.APPLICANT2_LAST_NAME :' '},

      { field: 'AP3_FIRST_NAME', type: 'text', value: this.basicInfo.APPLICANT3_FIRST_NAME? this.basicInfo.APPLICANT3_FIRST_NAME: " " },
      { field: 'AP3_MIDDLE_NAME',type:'text',value: this.basicInfo.APPLICANT3_MIDDLE_NAME ? this.basicInfo.APPLICANT3_MIDDLE_NAME : ' '},
      { field: 'AP3_LAST_NAME',type:'text',value: this.basicInfo.APPLICANT3_LAST_NAME ? this.basicInfo.APPLICANT3_LAST_NAME :' '},

      { field: 'AP4_FIRST_NAME', type: 'text', value: this.basicInfo.APPLICANT4_FIRST_NAME? this.basicInfo.APPLICANT4_FIRST_NAME: " " },
      { field: 'AP4_MIDDLE_NAME',type:'text',value: this.basicInfo.APPLICANT4_MIDDLE_NAME ? this.basicInfo.APPLICANT4_MIDDLE_NAME : ' '},
      { field: 'AP4_LAST_NAME',type:'text',value: this.basicInfo.APPLICANT4_LAST_NAME ? this.basicInfo.APPLICANT4_LAST_NAME :' '},

    ]
  }

  async fillPdf() {
    // console.error("In pdfFill");
    const formPdfBytes = await fetch(this.pdfSrc).then(res => res.arrayBuffer());
    this.pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = this.pdfDoc.getForm();
    const emblemImageBytes = await fetch(this.image).then(res => res.arrayBuffer())
    const applicantImage = await this.pdfDoc.embedJpg(emblemImageBytes);
    form.getButton('AP1_PHOTO_af_image').setImage(applicantImage);
 
    for (let field of this.fieldMap) {
      if (field.type == 'text'){
        form.getTextField(field.field).setText(field.value);
      }
   }

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

    if (this.basicInfo.ACCOUNT_TYPE) {
      if (this.basicInfo.ACCOUNT_TYPE == 'S') {
        form.getCheckBox('Check Box2').check();
      }
      else if (this.basicInfo.ACCOUNT_TYPE == 'F') {
        form.getCheckBox('Check Box49').check();
      }
      else if (this.basicInfo.ACCOUNT_TYPE == 'R') {
        form.getCheckBox('Check Box50').check();
      }
      else if (this.basicInfo.ACCOUNT_TYPE == 'P') {
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
          console.log("count in p", count);
          if (count >= 4) {
            this.fillField();
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
          console.log("count in d", count);
          if (count >= 4) {
            this.fillField();
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
          console.log("count in n", count);
          if (count >= 4) {
            this.fillField();
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
          console.log("count in p", count);
          if (count >= 4) {
            this.fillField();
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
    this.api.getBasic(this.APPLICANT_ID).subscribe({
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

  image = "data:image/jpeg;base64,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";



}

interface FormField {
  field: string;
  type: string;
  value?: any;
}
