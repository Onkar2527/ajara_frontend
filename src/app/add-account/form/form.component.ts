import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Facilities } from 'src/app/models/facilities';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { Personal } from 'src/app/models/personal';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  personalInfo: Personal = new Personal();
  depositInfo: TermDeposite = new TermDeposite();
  serviceInfo: Facilities = new Facilities();
  nominationInfo: NomineeDetails = new NomineeDetails();

  constructor(private api: ApiService, private message: NzNotificationService) { }
  APPLICANT_ID?: number;
  ngOnInit(): void {
  }
  pdfSrc = '../../../assets/FACO Adobe Form.pdf'
  pdfByte: any
  getAllData() {
    let personal = this.getPersonal();
    let deposit = this.getDeposit();
    let service = this.getService();
    let nominee = this.getNominee();

    personal.subscribe({
      next: (res) => {
        if (res == 200) {
          deposit.subscribe({
            next: (res1) => {
              if (res1 == 200) {
                service.subscribe({
                  next: (res2) => {
                    if (res2 == 200) {
                      nominee.subscribe({
                        next: (res3) => {
                          if (res3 == 200) {
                          }
                          else {
                            this.message.error('Something went wrong!', '');
                          }
                        },
                        error: () => {
                          this.message.error('Something went wrong!', '');
                        }
                      })
                    }
                    else {
                      this.message.error('Something went wrong!', '');
                    }
                  },
                  error: () => {
                    this.message.error('Something went wrong!', '');
                  }
                })
              }
              else {
                this.message.error('Something went wrong!', '');
              }
            },
            error: () => {
              this.message.error('Something went wrong!', '');
            }
          })
        }
        else {
          this.message.error('Something went wrong!', '');
        }
      },
      error: () => {
        this.message.error('Something went wrong!', '');
      }
    })
  }

  getPersonal() {
    let personal: Subject<any> = new Subject();
    this.api.getPersonal(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.personalInfo = res['data'][0];
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
          this.serviceInfo = res['data'][0];
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

  async fillPdf() {
    const formPdfBytes = await fetch(this.pdfSrc).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();

    let name: string[] = this.splitName(this.personalInfo.PRIMARY_APPLICANT_NAME);

    if (name.length > 2) {
      form.getTextField('AP1_FIRST_NAME').setText(name[0]);
      form.getTextField('AP1_MIDDLE_NAME').setText(name[1]);
      form.getTextField('AP1_LAST_NAME').setText(name[2]);
    }
    let name2: string[] = this.splitName(this.personalInfo.APPLICANT2);
    if (name2.length > 2) {
      form.getTextField('AP2_FIRST_NAME').setText(name2[0]);
      form.getTextField('AP2_MIDDLE_NAME').setText(name2[1]);
      form.getTextField('AP2_LAST_NAME').setText(name2[2]);
    }
    let name3: string[] = this.splitName(this.personalInfo.APPLICANT3);
    if (name3.length > 2) {
      form.getTextField('AP3_FIRST_NAME').setText(name3[0]);
      form.getTextField('AP3_MIDDLE_NAME').setText(name3[1]);
      form.getTextField('AP3_LAST_NAME').setText(name3[2]);
    }
    let name4: string[] = this.splitName(this.personalInfo.APPLICANT4);
    if (name4.length > 2) {
      form.getTextField('AP4_FIRST_NAME').setText(name4[0]);
      form.getTextField('AP4_MIDDLE_NAME').setText(name4[1]);
      form.getTextField('AP4_LAST_NAME').setText(name4[2]);
    }

    if (this.personalInfo.IS_MINOR) {
      let gName: string[] = this.splitName(this.personalInfo.GUARDIAN_NAME);
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

      if (this.personalInfo.MINOR_DOB) {
        let dob = this.splitDate(this.personalInfo.MINOR_DOB);
        form.getTextField('D11').setText(dob[0]);
        form.getTextField('D12').setText(dob[1]);
        form.getTextField('D13').setText(dob[2]);
        form.getTextField('D14').setText(dob[3]);
        form.getTextField('D15').setText(dob[4]);
        form.getTextField('D16').setText(dob[5]);
        form.getTextField('D17').setText(dob[6]);
        form.getTextField('D18').setText(dob[7]);
      }
      if (this.personalInfo.GUARDIAN_DOB) {
        let dob = this.splitDate(this.personalInfo.GUARDIAN_DOB);
        form.getTextField('D21').setText(dob[0]);
        form.getTextField('D22').setText(dob[1]);
        form.getTextField('D23').setText(dob[2]);
        form.getTextField('D24').setText(dob[3]);
        form.getTextField('D25').setText(dob[4]);
        form.getTextField('D26').setText(dob[5]);
        form.getTextField('D27').setText(dob[6]);
        form.getTextField('D28').setText(dob[7]);
      }
      if(this.personalInfo.RELATION_WITH_MINOR == 'F'){
        form.getCheckBox('Check Box3').check();
      }
      else if(this.personalInfo.RELATION_WITH_MINOR == 'M'){
        form.getCheckBox('Check Box4').check();
      }
      else if(this.personalInfo.RELATION_WITH_MINOR == 'C'){
        form.getCheckBox('Check Box5').check();
      }
      else if(this.personalInfo.RELATION_WITH_MINOR == 'O'){
        form.getCheckBox('Check Box6').check();
      }

      

    }

    if(this.depositInfo.ACCOUNT_TYPE){
      if(this.depositInfo.ACCOUNT_TYPE == 'S'){
        form.getCheckBox('Check Box2').check();
      }
      else if(this.depositInfo.ACCOUNT_TYPE == 'F'){
        form.getCheckBox('Check Box49').check();
      }
      else if(this.depositInfo.ACCOUNT_TYPE == 'R'){
        form.getCheckBox('Check Box50').check();
      }
      else if(this.depositInfo.ACCOUNT_TYPE == 'P'){
        form.getCheckBox('Check Box51').check();
      }
    }

    if(this.depositInfo.INTEREST_PAYOUT){
      if(this.depositInfo.INTEREST_PAYOUT == 'M'){
        form.getCheckBox('Check Box19').check();
      }
      else if(this.depositInfo.INTEREST_PAYOUT == 'Q'){
        form.getCheckBox('Check Box20').check();
      }
      else if(this.depositInfo.INTEREST_PAYOUT == 'H'){
        form.getCheckBox('Check Box21').check();
      }
      else if(this.depositInfo.INTEREST_PAYOUT == 'Y'){
        form.getCheckBox('Check Box22').check();
      }
      else if(this.depositInfo.INTEREST_PAYOUT == 'O'){
        form.getCheckBox('Check Box23').check();
      }
    }

    if(this.depositInfo.MODE_OF_INTEREST_PAYOUT){
      if(this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'S'){
        form.getCheckBox('Check Box25').check();
      }
      else if(this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'E'){
        form.getCheckBox('Check Box26').check();
      }
      else if(this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'P'){
        form.getCheckBox('Check Box27').check();
      }
      else if(this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'O'){
        form.getCheckBox('Check Box24').check();
      }
    }

    if(this.depositInfo.AUTO_RENEWAL){
        form.getCheckBox('Check Box28').check();
    }

    if(this.depositInfo.TDS){
      if(this.depositInfo.TDS == 'T'){
        form.getCheckBox('Check Box30').check();
      }
      else if(this.depositInfo.TDS == 'N'){
        form.getCheckBox('Check Box31').check();
      }
    }

    if(this.nominationInfo.IS_MINOR){
      form.getCheckBox('Check Box32').check();
  }
    
    





    form.flatten();

    const pdfBytes = await pdfDoc.save()

    var blob = new Blob([pdfBytes], { type: 'application/pdf' });


    var url = URL.createObjectURL(blob);
    window.open(url);

    return pdfBytes
  }
}
