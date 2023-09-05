import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Facilities } from 'src/app/models/facilities';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { BasicInfo } from 'src/app/models/basicInfo';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';
import { PDFDocument } from 'pdf-lib';
import { PersonalInfo } from 'src/app/models/personal-info';
import { Financial } from 'src/app/models/financial';
import { Property } from 'src/app/models/property';
import { LoanInfo } from 'src/app/models/loan-info';
import { OtherBankAccount } from 'src/app/models/other-bank-account';
import { ImageData } from 'src/app/models/image-data';
const html2pdf =  require('html2pdf.js');

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit  {
  @Input() APPLICANT_ID!: number;

  @Output() pdfButtonLoading:EventEmitter<boolean> = new EventEmitter<boolean>();

  basicInfo: BasicInfo = new BasicInfo();
  depositInfo: TermDeposite = new TermDeposite();
  serviceInfo: Facilities = new Facilities();
  nominationInfo: NomineeDetails = new NomineeDetails();

  ApplicantPersonal: PersonalInfo[] = []
  ApplicantFinancial: Financial[] = []
  ApplicantProperty: Property[] = []
  ApplicantLoanInfo: LoanInfo[] = []
  ApplicantOtherBank: OtherBankAccount[] = []




  ApplicantPhoto: ImageData[] = [];


  account_type = {
    'S' : 'Saving',
    'F': 'Fixed Deposite',
    'R': 'Recurring Deposite',
    'P': 'Pigmy'
  }

  religion = {
    "H":"Hindu",
    "M":"Muslim",
    "C":"Christianity",
    "B":"Buddhism",
    "P":"Parsi",
    "S":"Sikhism",
    "O":"Other"
  }

  caste ={
    "N" : "Open",
    "T" : "Other Cast",
    "S" : "Other Tribes",
    "C" : "OBC",
    "O" : "Other"
  }

  education = {
    "S" : "10th class",
    "H" : "12th class",
    "D" : "Degree",
    "G" : "Graduate",
    "P" : "Post Graduate",
    "O" : "Other"
  }

  income = {
    "1" : "Upto ₹60000",
    "2" : "₹60001 to ₹120000",
    "3" : "₹120001 to ₹240000",
    "4" : "₹240001 to ₹360000",
    "5" : "₹360001 to ₹600000",
    "6" : "₹600001 to ₹1200000",
    "7" : "₹1200001 to ₹1800000",
    "8" : "Above ₹1800001",

  }

  residential_status = {
    "O" : "Own House",
    "H" : "Rented",
    "D" : "House Bought on Home Loan",
    "G" : "Ancestral House",
    "P" : "Given to you by Company or Employer"
  }

  relation = {
    "F" : "Father",
    "M" : "Mother",
    "C" : "By Court Order",
    "O" : "Other"
  }
  account_operation = {
    "S" : "Self",
    "E" : "Either or Survivor",
    "A" : "Anyone or Survivor",
    "F" : "Former or Survivor",
    "J" : "Jointly by All",
    "O" : "Other"
  } 

  interest_payout = {
    "M" : "Monthly",
    "Q" : "Quarterly",
    "H" : "Half Yearly",
    "Y" : "Yearly",
    "O" : "On Maturity"
  }

  work = {
    "E" : "Employee",
    "S" : "Self Employeed",
    "B" : "Business",
    "R" : "Retired",
    "T" : "Student",
    "H" : "House Wife",
    "O" : "Other"
  }

  employee = {
    "P" : "Public Company",
    "E" : "Private Company",
    "C" : "Centeral/State Goverment",
    "M" : "Multi-Purpose Company",
    "J" : "Private Job",
    "O" : "Other",
    " " : "None"
  }

  proprieter = {
    "C" : "CA",
    "D" : "Doctor",
    "A" : "Advisor",
    "T" : "Trader",
    "E" : "Engineer",
    "V" : "Advocate",
    "S" : "Software",
    "O" : "Other",
    " " : "None"
  }


  constructor(private api: ApiService, private message: NzNotificationService) { }
  
  ngOnInit(): void {
   if(this.APPLICANT_ID){
    this.getAllData();
   }
  }
  ngAfterViewInit(): void{
    
  }

  pdfSrc = '../../../assets/FACO Adobe Form.pdf'
  pdfSrc2 = '../../../assets/Applicants Form.pdf'

  MergedPdf: any;

  pdfDoc: any;
  pdfByte: any
  showPdf: boolean = false;

  pdfDoc2: any;
  pdfByte2: any;

  pdfDoc3: any;
  pdfByte3: any;

  pdfDoc4: any;
  pdfByte4: any;

  pdfDoc5: any;
  pdfByte5: any;

  fieldMap: FormField[] = []
  fieldMap2: FormField[][] = []
  fieldMap3: FormField[][] = []


  getPhoto(applicant_no: number): string {
    if (this.ApplicantPhoto.length >= applicant_no) {
      return this.ApplicantPhoto[applicant_no - 1].IMAGE_DATA
    }
    else {
      return '';
    }

  }

  validateValue(value: any) {
    if (value) {
      return value.toString();
    }
    else {
      return ''
    }
  }

  validateBlock(value: any, size: number) {
    let returnArray = []
    if (value) {
      if (size) {
        let tempArray = this.splitInBlock(value.toString());
        for (let i = 0; i < size; i++) {
          returnArray.push(tempArray[i]);
        }
      }
    }

    return returnArray;
  }

  validateRadioButton(value: any, checkChar: any) {
    if (value == checkChar) {
      return true;
    }
    else {
      return false;
    }

  }

 

  save() {
    this.generatePDF();
  }


  getAllData() {
    let personal = this.getPersonal();
    let deposit = this.getDeposit();
    let service = this.getService();
    let nominee = this.getNominee();

    let applicantPersonal = this.getApplicantPersonal();
    let applicantFinancial = this.getApplicantFinancial();
    let applicantProperty = this.getApplicantProperty();
    let applicantLoanInfo = this.getApplicantLoanInfo();
    let applicantOtherAccount = this.getApplicantOtherAccount();
    let applicantPhoto = this.getApplicantPhoto();
    let count = 0;

    personal.subscribe({
      next: (res) => {
        if (res == 200) {

          count++;
          console.log("count in p", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Something went wrong! while getting Basic Information.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! while getting Basic Information.', '');
      },
      complete: () => {

      }
    })
    deposit.subscribe({
      next: (res1) => {
        if (res1 == 200) {

          count++;
          console.log("count in d", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Deposit Information is not Filled.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! While getting deposite Information.', '');
      },
      complete: () => {

      }
    })
    nominee.subscribe({
      next: (res3) => {

        if (res3 == 200) {

          count++;
          console.log("count in n", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Nominee Information is not filled.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! While getting nominee Information.', '');
      },
      complete: () => {

      }
    })
    service.subscribe({
      next: (res2) => {
        if (res2 == 200) {

          count++;
          console.log("count in p", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Information about required service is not filled.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! while getting service information.', '');
      },
      complete: () => {

      }
    })


    applicantPersonal.subscribe({
      next: (res2) => {
        if (res2 == 200) {

          count++;
          console.log("count in p", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Applicant Personal Information is not filled.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! While getting Applicant Personal Information.', '');
      },
      complete: () => {

      }
    })

    applicantFinancial.subscribe({
      next: (res2) => {
        if (res2 == 200) {

          count++;
          console.log("count in p", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Applicant Financial Information is not Filled.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! While getting Applicant Financial Information.', '');
      },
      complete: () => {

      }
    })

    applicantProperty.subscribe({
      next: (res2) => {
        if (res2 == 200) {

          count++;
          console.log("count in p", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Applicant Property Information is not Filled.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! While getting Applicant Property Information.', '');
      },
      complete: () => {

      }
    })

    applicantLoanInfo.subscribe({
      next: (res2) => {
        if (res2 == 200) {

          count++;
          console.log("count in p", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Applicant Earlier Loan Information is not Filled.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! While getting Applicant Earlier Loan Information.', '');
      },
      complete: () => {

      }
    })

    applicantOtherAccount.subscribe({
      next: (res2) => {
        if (res2 == 200) {

          count++;
          console.log("count in p", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Applicant Other Account Details is not Filled.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! While getting Applicant Other Account Details.', '');
      },
      complete: () => {

      }
    })

    applicantPhoto.subscribe({
      next: (res2) => {
        if (res2 == 200) {

          count++;
          console.log("count in p", count);
          if (count >= 10) {
            //this.fillField()
            //this.fillPdf();
          }
        }
        else {
          this.message.warning('Applicant Photo is not Uploaded.', '');
        }
      },
      error: () => {
        this.message.warning('Something went wrong! While getting Applicant Photo.', '');
      },
      complete: () => {

      }
    })

  }

  getPersonal() {
    let personal: Subject<any> = new Subject();
    this.api.getBasic(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
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
        if (res['code'] == 200 && res['data'].length > 0) {
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
        if (res['code'] == 200 && res['data'].length > 0) {
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
        if (res['code'] == 200 && res['data'].length > 0) {
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

  getApplicantPersonal() {
    let applicantPersonal: Subject<any> = new Subject();
    this.api.getAllAplicant(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.ApplicantPersonal = res['data'];
          console.log("applicant personal:", this.ApplicantPersonal);
          applicantPersonal.next(200);
        }
        else {
          applicantPersonal.next(res);
        }
      },
      error: (err) => {
        applicantPersonal.error(err);
      },
      complete: () => {
        applicantPersonal.complete();
      }
    });
    return applicantPersonal;
  }

  getApplicantFinancial() {
    let applicantFinancial: Subject<any> = new Subject();
    this.api.getAllFinancial(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.ApplicantFinancial = res['data'];
          console.log("applicant financial:", this.ApplicantFinancial);
          applicantFinancial.next(200);
        }
        else {
          applicantFinancial.next(res);
        }
      },
      error: (err) => {
        applicantFinancial.error(err);
      },
      complete: () => {
        applicantFinancial.complete();
      }
    });
    return applicantFinancial;
  }

  getApplicantProperty() {
    let applicantProperty: Subject<any> = new Subject();
    this.api.getAllProperty(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.ApplicantProperty = res['data'];
          console.log("applicant property:", this.ApplicantProperty);
          applicantProperty.next(200);
        }
        else {
          applicantProperty.next(res);
        }
      },
      error: (err) => {
        applicantProperty.error(err);
      },
      complete: () => {
        applicantProperty.complete();
      }
    });
    return applicantProperty;
  }

  getApplicantLoanInfo() {
    let applicantLoanInfo: Subject<any> = new Subject();
    this.api.getAllLoanInfo(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.ApplicantLoanInfo = res['data'];
          console.log("applicant property:", this.ApplicantLoanInfo);
          applicantLoanInfo.next(200);
        }
        else {
          applicantLoanInfo.next(res);
        }
      },
      error: (err) => {
        applicantLoanInfo.error(err);
      },
      complete: () => {
        applicantLoanInfo.complete();
      }
    });
    return applicantLoanInfo;
  }

  getApplicantOtherAccount() {
    let applicantOtherAccount: Subject<any> = new Subject();
    this.api.getAllOtherAccount(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.ApplicantOtherBank = res['data'];
          console.log("applicant property:", this.ApplicantOtherBank);
          applicantOtherAccount.next(200);
        }
        else {
          applicantOtherAccount.next(res);
        }
      },
      error: (err) => {
        applicantOtherAccount.error(err);
      },
      complete: () => {
        applicantOtherAccount.complete();
      }
    });
    return applicantOtherAccount;
  }

  getApplicantPhoto() {
    let applicantPhoto: Subject<any> = new Subject();
    this.api.getAllApplicantPhoto(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.ApplicantPhoto = res['data'];
          applicantPhoto.next(200);
        }
        else {
          applicantPhoto.next(res);
        }
      },
      error: (err) => {
        applicantPhoto.error(err);
      },
      complete: () => {
        applicantPhoto.complete();
      }
    });
    return applicantPhoto;
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

 

  async generatePDF() {
    
    let data = document.getElementById('contentToConvert');
    let opt = {
      margin: 0.3,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas:{scale:4},
      pagebreak: { mode: ['avoid-all', 'css', 'legecy'] },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };

    
    await html2pdf().from(data).set(opt).toPdf().get('pdf').save('Form'+ '.pdf');
    this.pdfButtonLoading.emit(false)
    // console.log("pdf done",this.pdfButtonLoading);
  }

  


}

interface FormField {
  field: string;
  type: string;
  value?: any;
}


 // fillField() {
  //   this.fieldMap = [

  //     // FOR BANK USE ONLY

  //     { field: 'B1,B10', type: 'block' },
  //     { field: 'D1,D8', type: 'block' },

  //     { field: 'A1,A16', type: 'block' },
  //     { field: 'BRANCH_NAME', type: 'text' },

  //     { field: 'R1,R26', type: 'block' },

  //     { field: 'C1,C110', type: 'block' },
  //     { field: 'C2,C210', type: 'block' },

  //     { field: 'C3,C310', type: 'block' },
  //     { field: 'C4,C410', type: 'block' },

  //     { field: 'Check Box2', type: 'checkbox' },
  //     { field: 'Check Box49', type: 'checkbox' },
  //     { field: 'Check Box50', type: 'checkbox' },
  //     { field: 'Check Box51', type: 'checkbox' },

  //     { field: 'AP1_FIRST_NAME', type: 'text', value: this.validateValue(this.basicInfo.PRIMARY_APPLICANT_FIRST_NAME) },
  //     { field: 'AP1_MIDDLE_NAME', type: 'text', value: this.validateValue(this.basicInfo.PRIMARY_APPLICANT_MIDDLE_NAME) },
  //     { field: 'AP1_LAST_NAME', type: 'text', value: this.validateValue(this.basicInfo.PRIMARY_APPLICANT_LAST_NAME) },

  //     { field: 'AP2_FIRST_NAME', type: 'text', value: this.validateValue(this.basicInfo.APPLICANT2_FIRST_NAME) },
  //     { field: 'AP2_MIDDLE_NAME', type: 'text', value: this.validateValue(this.basicInfo.APPLICANT2_MIDDLE_NAME) },
  //     { field: 'AP2_LAST_NAME', type: 'text', value: this.validateValue(this.basicInfo.APPLICANT2_LAST_NAME) },

  //     { field: 'AP3_FIRST_NAME', type: 'text', value: this.validateValue(this.basicInfo.APPLICANT3_FIRST_NAME) },
  //     { field: 'AP3_MIDDLE_NAME', type: 'text', value: this.validateValue(this.basicInfo.APPLICANT3_MIDDLE_NAME) },
  //     { field: 'AP3_LAST_NAME', type: 'text', value: this.validateValue(this.basicInfo.APPLICANT3_LAST_NAME) },

  //     { field: 'AP4_FIRST_NAME', type: 'text', value: this.validateValue(this.basicInfo.APPLICANT4_FIRST_NAME) },
  //     { field: 'AP4_MIDDLE_NAME', type: 'text', value: this.validateValue(this.basicInfo.APPLICANT4_MIDDLE_NAME) },
  //     { field: 'AP4_LAST_NAME', type: 'text', value: this.validateValue(this.basicInfo.APPLICANT4_LAST_NAME) },

  //     { field: 'TITLE', type: 'text' },
  //     { field: 'G_FIRST_NAME', type: 'text' },
  //     { field: 'G_MIDDLE_NAME', type: 'text' },
  //     { field: 'G_LAST_NAME', type: 'text' },

  //     { field: 'Check Box3', type: 'checkbox' },
  //     { field: 'Check Box4', type: 'checkbox' },
  //     { field: 'Check Box5', type: 'checkbox' },

  //     { field: 'Check Box6', type: 'checkbox' },

  //     { field: 'Check Box7', type: 'checkbox' },
  //     { field: 'Check Box8', type: 'checkbox' },
  //     { field: 'Check Box9', type: 'checkbox' },
  //     { field: 'Check Box10', type: 'checkbox' },

  //     { field: 'Check Box11', type: 'checkbox' },
  //     { field: 'Check Box12', type: 'checkbox' },
  //     { field: 'OTHER_INSTRUCTION_FOR_ACC_OPERATION', type: 'text' },

  //     { field: 'Check Box13', type: 'checkbox' },

  //     { field: 'AP1_PHOTO_af_image', type: 'image', value: this.getPhoto(1) },
  //     { field: 'AP2_PHOTO_af_image', type: 'image', value: this.getPhoto(2) },
  //     { field: 'AP3_PHOTO_af_image', type: 'image', value: this.getPhoto(3) },
  //     { field: 'AP4_PHOTO_af_image', type: 'image', value: this.getPhoto(4) },

  //     { field: 'Check Box34', type: 'checkbox' },

  //     { field: 'I_FIRST_NAME', type: 'text' },
  //     { field: 'I_MIDDLE_NAME', type: 'text' },
  //     { field: 'I_LAST_NAME', type: 'text' },

  //     { field: 'I2,I10', type: 'block' },

  //     { field: 'A011,A116', type: 'block' },

  //     { field: 'I_YEARS', type: 'text' },


  //     // INITIAL PAYMENT DETAILS
  //     { field: 'INITIAL_AMOUNT', type: 'text' },
  //     { field: 'Check Box35', type: 'checkbox' },
  //     { field: 'Check Box36', type: 'checkbox' },
  //     { field: 'A21,A215', type: 'block' },

  //     { field: 'CHEQUE_NO', type: 'text' },
  //     { field: 'INITIAL_PAYMENT_DATE', type: 'text' },

  //     { field: 'DA1,DA10', type: 'block' },
  //     { field: 'RATE_OF_INTEREST', type: 'text' },

  //     { field: 'Check Box19', type: 'checkbox' },
  //     { field: 'Check Box20', type: 'checkbox' },
  //     { field: 'Check Box21', type: 'checkbox' },
  //     { field: 'Check Box22', type: 'checkbox' },
  //     { field: 'Check Box23', type: 'checkbox' },

  //     { field: 'T_DAYS', type: 'text' },
  //     { field: 'T_MONTHS', type: 'text' },
  //     { field: 'T_YEARS', type: 'text' },

  //     { field: 'Check Box25', type: 'checkbox' },
  //     { field: 'Check Box26', type: 'checkbox' },
  //     { field: 'Check Box27', type: 'checkbox' },
  //     { field: 'Check Box24', type: 'checkbox' },

  //     { field: 'Check Box28', type: 'checkbox' },
  //     { field: 'Check Box29', type: 'checkbox' },

  //     { field: 'B_NAME1,B_NAME25', type: 'block' },
  //     { field: 'BR_NAME1,BR_NAME25', type: 'block' },
  //     { field: 'IFSC1,IFSC11', type: 'block' },
  //     { field: 'ACC1,ACC16', type: 'block' },

  //     { field: 'Check Box30', type: 'checkbox' },
  //     { field: 'Check Box31', type: 'checkbox' },

  //     { field: 'Check Box32', type: 'checkbox' },
  //     { field: 'Check Box33', type: 'checkbox' },

  //     { field: 'NOMINEE_ADDRESS_LINE_1', type: 'text' },
  //     { field: 'NOMINEE_ADDRESS_LINE_2', type: 'text' },
  //     { field: 'NOMINEE_ADDRESS_LINE_3', type: 'text' },
  //     { field: 'NOMINEE_ADDRESS_LINE_4', type: 'text' },

  //     { field: 'RELATION_WTH_APPLICANT', type: 'text' },
  //     { field: 'D31,D38', type: 'block' },

  //     { field: 'ADDRESS_LINE_1', type: 'text' },
  //     { field: 'ADDRESS_LINE_2', type: 'text' },

  //     { field: 'WITNESS1_ADDRESS_LINE_1', type: 'text' },
  //     { field: 'WITNESS1_ADDRESS_LINE_2', type: 'text' },
  //     { field: 'WITNESS1_ADDRESS_LINE_3', type: 'text' },
  //     { field: 'WITNESS1_ADDRESS_LINE_4', type: 'text' },

  //     { field: 'WITNESS2_ADDRESS_LINE_1', type: 'text' },
  //     { field: 'WITNESS2_ADDRESS_LINE_2', type: 'text' },
  //     { field: 'WITNESS2_ADDRESS_LINE_3', type: 'text' },
  //     { field: 'WITNESS2_ADDRESS_LINE_4', type: 'text' },

  //     // SERVICES & LINKAGES
  //     { field: 'Check Box42', type: 'checkbox' },
  //     { field: 'Check Box43', type: 'checkbox' },
  //     { field: 'Check Box44', type: 'checkbox' },

  //     { field: 'Check Box46', type: 'checkbox' },
  //     { field: 'Check Box47', type: 'checkbox' },
  //     { field: 'Check Box45', type: 'checkbox' },

  //     { field: 'Check Box48', type: 'checkbox' },

  //     { field: 'AP11,AP120', type: 'block' },
  //     { field: 'AP21,AP220', type: 'block' },
  //     { field: 'AP31,AP320', type: 'block' },
  //     { field: 'AP41,AP420', type: 'block' },


  //     // Date of Birth Mismatch (If necessary) Declaration :
  //     { field: 'D41,D48', type: 'block' },
  //     { field: 'D51,D58', type: 'block' },
  //     { field: 'D61,D68', type: 'block' },

  //     { field: 'DD', type: 'text' },
  //     { field: 'MM', type: 'text' },
  //     { field: 'YYYY', type: 'text' },

  //     { field: 'DECLARANT_NAME', type: 'text' },
  //     { field: 'LANGUAGE', type: 'text' },
  //     { field: 'APPLICANT_NAME', type: 'text' },

  //     { field: 'DOCUMENT_NAME', type: 'text' },
  //     { field: 'REASON_OF_DIIFERENCE_IN_SIGNATURE', type: 'text' },

  //   ]
    
  //   // index 1
  //   if (this.ApplicantPersonal.length >= 1) {
  //     this.fieldMap2[0] = [

  //       { field: 'BRANCH_NAME1', type: 'text' },
  //       { field: 'D71,D78', type: 'block' },
  //       { field: 'C51,C512', type: 'block' },
  //       { field: 'TYPE_OF_ACCOUNT', type: 'text' },
  //       { field: 'APPLICANT_LAST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].LAST_NAME) },
  //       { field: 'APPLICANT_FIRST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].FIRST_NAME) },
  //       { field: 'APPLICANT_MIDDLE_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].MIDDLE_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_LAST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].F_OR_H_LAST_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_FIRST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].F_OR_H_FIRST_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_MIDDLE_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].F_OR_H_MIDDLE_NAME) },

  //       { field: 'CURRENT_ADDRESS_LINE_1', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].CURRENT_ADDRESS) },
  //       { field: 'CURRENT_ADDRESS_LINE_2', type: 'text' },
  //       { field: 'CURRENT_ADDRESS_LINE_3', type: 'text' },
  //       { field: 'C_CITY', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].CURRENT_CITY) },
  //       { field: 'C_TALUKA', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].CURRENT_TALUKA) },
  //       { field: 'C_DISTRICT', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].CURRENT_DISTRICT) },
  //       { field: 'C_BIG_SIGN_NEARBY', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].CURRENT_LANDMARK) },
  //       { field: 'C_STATE', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].CURRENT_STATE) },
  //       { field: 'C_P1,C_P6', type: 'block', value: this.validateBlock(this.ApplicantPersonal[0].CURRENT_PINCODE, 6) },

  //       { field: 'PERMANENT_ADDRESS_LINE_1', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].PERMANENT_ADDRESS) },
  //       { field: 'PERMANENT_ADDRESS_LINE_2', type: 'text' },
  //       { field: 'PERMANENT_ADDRESS_LINE_3', type: 'text' },
  //       { field: 'P_CITY', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].PERMANENT_CITY) },
  //       { field: 'P_TALUKA', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].PERMANENT_TALUKA) },
  //       { field: 'P_DISTRICT', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].PERMANENT_DISTRICT) },
  //       { field: 'P_BIG_SIGN_NEARBY', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].PERMANENT_LANDMARK) },
  //       { field: 'P_STATE', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].PERMANENT_STATE) },
  //       { field: 'P_P1,P_P6', type: 'block', value: this.validateBlock(this.ApplicantPersonal[0].PERMANENT_PINCODE, 6) },

  //       { field: 'H_L1,H_L12', type: 'block', value: this.validateBlock(this.ApplicantPersonal[0].HOUSE_PHONE, 12) },
  //       { field: 'O_L1,O_L12', type: 'block', value: this.validateBlock(this.ApplicantPersonal[0].OFFICE_PHONE, 12) },

  //       { field: 'EMAIL_ID', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].EMAIL_ID) },
  //       { field: 'M1,M10', type: 'block', value: this.validateBlock(this.ApplicantPersonal[0].MOBILE_NUMBER, 10) },

  //       { field: 'Check Box61', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].WORK, 'E') },
  //       { field: 'Check Box62', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].WORK, 'S') },
  //       { field: 'Check Box63', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].WORK, 'B') },
  //       { field: 'Check Box64', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].WORK, 'R') },
  //       { field: 'Check Box65', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].WORK, 'T') },
  //       { field: 'Check Box66', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].WORK, 'H') },
  //       { field: 'Check Box67', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].WORK, 'O') },

  //       { field: 'Check Box71', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].ESTABLISHMENT, 'L') },
  //       { field: 'Check Box72', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].ESTABLISHMENT, 'R') },
  //       { field: 'Check Box73', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].ESTABLISHMENT, 'E') },
  //       { field: 'Check Box74', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].ESTABLISHMENT, 'Y') },
  //       { field: 'Check Box75', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].ESTABLISHMENT, 'N') },
  //       { field: 'Check Box76', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].ESTABLISHMENT, 'T') },
  //       { field: 'Check Box77', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].ESTABLISHMENT, 'O') },

  //       { field: 'Check Box81', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].RELIGION, 'H') },
  //       { field: 'Check Box82', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].RELIGION, 'M') },
  //       { field: 'Check Box83', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].RELIGION, 'C') },
  //       { field: 'Check Box84', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].RELIGION, 'B') },
  //       { field: 'Check Box85', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].RELIGION, 'P') },
  //       { field: 'Check Box86', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].RELIGION, 'S') },
  //       { field: 'Check Box87', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].RELIGION, 'O') },

  //       { field: 'Check Box91', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].CASTE, 'N') },
  //       { field: 'Check Box92', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].CASTE, 'T') },
  //       { field: 'Check Box93', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].CASTE, 'S') },
  //       { field: 'Check Box94', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].CASTE, 'C') },
  //       { field: 'Check Box95', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].CASTE, 'O') },

  //       { field: 'Check Box101', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].MARITAL_STATUS, 'M') },
  //       { field: 'OFFSPRING', type: 'text', value: this.validateRadioButton(this.ApplicantPersonal[0].MARITAL_STATUS, 'M') ? this.validateValue(this.ApplicantPersonal[0].FAMILY_COUNT) : ' ' },
  //       { field: 'Check Box102', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].MARITAL_STATUS, 'U') },
  //       { field: 'TOTAL_FAMILY_MEMBERS', type: 'text', value: this.validateRadioButton(this.ApplicantPersonal[0].MARITAL_STATUS, 'U') ? this.validateValue(this.ApplicantPersonal[0].FAMILY_COUNT) : ' ' },


  //       { field: 'Check Box103', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EDUCATION, 'S') },
  //       { field: 'Check Box104', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EDUCATION, 'H') },
  //       { field: 'Check Box105', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EDUCATION, 'D') },
  //       { field: 'Check Box106', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EDUCATION, 'G') },
  //       { field: 'Check Box107', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EDUCATION, 'P') },
  //       { field: 'Check Box108', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EDUCATION, 'O') },

  //       { field: 'Check Box109', type: 'checkbox', value: this.ApplicantPersonal[0].IS_INSURED },
  //       { field: 'INSURANCE_AMOUNT', type: 'text', value: this.ApplicantPersonal[0].IS_INSURED ? this.validateValue(this.ApplicantPersonal[0].INSURANCE_YEAR) : ' ' },
  //       { field: 'POLICY_TYPE', type: 'text', value: this.ApplicantPersonal[0].IS_INSURED ? this.validateValue(this.ApplicantPersonal[0].POLICY_TYPE) : ' ' },
  //       { field: 'INSURANCE_COMPANY', type: 'text', value: this.ApplicantPersonal[0].IS_INSURED ? this.validateValue(this.ApplicantPersonal[0].INSURANCE_COMPANY) : ' ' },

  //       { field: 'UID1,UID18', type: 'block', value: this.validateBlock(this.ApplicantPersonal[0].AADHAAR_NUMBER, 18) },

  //       { field: 'BG_1', type: 'text', value: this.ApplicantPersonal[0].BLOOD_TYPE_SIGN == '+' ? this.validateValue(this.ApplicantPersonal[0].BLOOD_TYPE) : ' ' },
  //       { field: 'BG_2', type: 'text', value: this.ApplicantPersonal[0].BLOOD_TYPE_SIGN == '-' ? this.validateValue(this.ApplicantPersonal[0].BLOOD_TYPE) : ' ' },

  //       { field: 'Check Box111', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EMPLOYMENT_DETAIL, 'P') },
  //       { field: 'Check Box112', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EMPLOYMENT_DETAIL, 'C') },
  //       { field: 'Check Box113', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EMPLOYMENT_DETAIL, 'J') },

  //       { field: 'Check Box114', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EMPLOYMENT_DETAIL, 'E') },
  //       { field: 'Check Box115', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EMPLOYMENT_DETAIL, 'M') },
  //       { field: 'Check Box116', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].EMPLOYMENT_DETAIL, 'O') },

  //       { field: 'COMPANY_OR_OWNER_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[0].EMPLOYMENT_COMPANY) },
  //       { field: 'DESIGNATION', type: 'text' },

  //       { field: 'Check Box117', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].PROPRIETOR_DETAILS, 'C') },
  //       { field: 'Check Box118', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].PROPRIETOR_DETAILS, 'D') },
  //       { field: 'Check Box119', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].PROPRIETOR_DETAILS, 'A') },
  //       { field: 'Check Box120', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].PROPRIETOR_DETAILS, 'T') },
  //       { field: 'Check Box121', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].PROPRIETOR_DETAILS, 'E') },
  //       { field: 'Check Box122', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].PROPRIETOR_DETAILS, 'V') },
  //       { field: 'Check Box123', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].PROPRIETOR_DETAILS, 'S') },
  //       { field: 'Check Box124', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].PROPRIETOR_DETAILS, 'O') },



  //       { field: 'Check Box125', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].BUSINESS_DETAIL, 'P') },
  //       { field: 'Check Box126', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].BUSINESS_DETAIL, 'N') },
  //       { field: 'Check Box127', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].BUSINESS_DETAIL, 'A') },

  //       { field: 'Check Box128', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].BUSINESS_DETAIL, 'R') },
  //       { field: 'Check Box129', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].BUSINESS_DETAIL, 'T') },
  //       { field: 'Check Box130', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[0].BUSINESS_DETAIL, 'O') },

  //     ]
  //     this.fieldMap3[0] = []
  //   }
  //   if (this.ApplicantFinancial.length >= 1) {
  //     this.fieldMap3[0] = [

  //       { field: 'Check Box131', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[0].INCOME, '1') },
  //       { field: 'Check Box132', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[0].INCOME, '3') },
  //       { field: 'Check Box133', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[0].INCOME, '5') },
  //       { field: 'Check Box134', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[0].INCOME, '7') },
  //       { field: 'Check Box135', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[0].INCOME, '2') },
  //       { field: 'Check Box136', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[0].INCOME, '4') },
  //       { field: 'Check Box137', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[0].INCOME, '6') },
  //       { field: 'Check Box138', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[0].INCOME, '8') },

  //     ]
  //   }
  //   if (this.ApplicantProperty.length >= 1) {
  //     this.fieldMap3[0] = [...this.fieldMap3[0],

  //     { field: 'Check Box139', type: 'checkbox', value: this.ApplicantProperty[0].IS_FOUR_WHEELER },
  //     { field: 'Check Box140', type: 'checkbox', value: this.ApplicantProperty[0].IS_TWO_WHEELER },
  //     { field: 'Check Box141', type: 'checkbox', value: this.ApplicantProperty[0].IS_HOME_THEATER },
  //     { field: 'Check Box142', type: 'checkbox', value: this.ApplicantProperty[0].IS_AC },
  //     { field: 'Check Box143', type: 'checkbox', value: this.ApplicantProperty[0].IS_DIGITAL_CAMERA },
  //     { field: 'Check Box144', type: 'checkbox', value: this.ApplicantProperty[0].IS_VIDEO_PLAYER },
  //     { field: 'Check Box145', type: 'checkbox', value: this.ApplicantProperty[0].IS_MICROWAVE },
  //     { field: 'Check Box146', type: 'checkbox', value: this.ApplicantProperty[0].IS_LCD_TV },
  //     { field: 'Check Box147', type: 'checkbox', value: this.ApplicantProperty[0].IS_COMPUTER },
  //     { field: 'Check Box148', type: 'checkbox', value: this.ApplicantProperty[0].IS_WASHING_MACHINE },

  //     { field: 'Check Box149', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[0].HOUSE_DETAIL, 'O') },
  //     { field: 'Check Box150', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[0].HOUSE_DETAIL, 'H') },
  //     { field: 'Check Box151', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[0].HOUSE_DETAIL, 'D') },
  //     { field: 'Check Box152', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[0].HOUSE_DETAIL, 'G') },
  //     { field: 'Check Box153', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[0].HOUSE_DETAIL, 'P') },

  //     ]
  //   }

  //   if (this.ApplicantLoanInfo.length >= 1) {
  //     this.fieldMap3[0] = [...this.fieldMap3[0],

  //     { field: 'Check Box154', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN },
  //     { field: 'Check Box155', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_HOME_LOAN },
  //     { field: 'Check Box156', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN },
  //     { field: 'Check Box157', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN },
  //     { field: 'Check Box158', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN },
  //     { field: 'Check Box159', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_TOUR_LOAN },
  //     { field: 'Check Box160', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN },

  //     { field: 'Check Box161', type: 'checkbox', value: !this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN },
  //     { field: 'Check Box162', type: 'checkbox', value: !this.ApplicantLoanInfo[0].IS_HOME_LOAN },
  //     { field: 'Check Box163', type: 'checkbox', value: !this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN },
  //     { field: 'Check Box164', type: 'checkbox', value: !this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN },
  //     { field: 'Check Box165', type: 'checkbox', value: !this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN },
  //     { field: 'Check Box166', type: 'checkbox', value: !this.ApplicantLoanInfo[0].IS_TOUR_LOAN },
  //     { field: 'Check Box167', type: 'checkbox', value: !this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN },

  //     { field: 'Check Box168', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box169', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_HOME_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_HOME_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box170', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box171', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box172', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box173', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_TOUR_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_TOUR_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box174', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN_YEAR, '1') : false },

  //     { field: 'Check Box175', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box176', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_HOME_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_HOME_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box177', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box178', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box179', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box180', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_TOUR_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_TOUR_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box181', type: 'checkbox', value: this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN_YEAR, '2') : false },

  //     { field: 'Check Box182', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN_YEAR,'3'):false },
  //     { field: 'Check Box183', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_HOME_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[0].IS_HOME_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box184', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box185', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box186', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box187', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_TOUR_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[0].IS_TOUR_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box188', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN_YEAR,'3'):false},

  //     { field: 'Check Box189', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN_REQUIRED },
  //     { field: 'Check Box190', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_HOME_LOAN_REQUIRED },
  //     { field: 'Check Box191', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN_REQUIRED },
  //     { field: 'Check Box192', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN_REQUIRED },
  //     { field: 'Check Box193', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN_REQUIRED },
  //     { field: 'Check Box194', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_TOUR_LOAN_REQUIRED },
  //     { field: 'Check Box195', type: 'checkbox' , value: this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN_REQUIRED },

  //     { field: 'Check Box196', type: 'checkbox' , value: !this.ApplicantLoanInfo[0].IS_VEHICLE_LOAN_REQUIRED },
  //     { field: 'Check Box197', type: 'checkbox' , value: !this.ApplicantLoanInfo[0].IS_HOME_LOAN_REQUIRED },
  //     { field: 'Check Box198', type: 'checkbox' , value: !this.ApplicantLoanInfo[0].IS_CONSUMER_LOAN_REQUIRED },
  //     { field: 'Check Box199', type: 'checkbox' , value: !this.ApplicantLoanInfo[0].IS_BUSINESS_LOAN_REQUIRED },
  //     { field: 'Check Box200', type: 'checkbox' , value: !this.ApplicantLoanInfo[0].IS_INSURANCE_LOAN_REQUIRED },
  //     { field: 'Check Box201', type: 'checkbox' , value: !this.ApplicantLoanInfo[0].IS_TOUR_LOAN_REQUIRED },
  //     { field: 'Check Box202', type: 'checkbox' , value: !this.ApplicantLoanInfo[0].IS_EDUCATION_LOAN_REQUIRED },

  //     ]
  //   }

  //   if (this.ApplicantOtherBank.length >= 1) {
  //     this.fieldMap3[0] = [...this.fieldMap3[0],
  //     { field: 'NAME_OF_BANK_1', type: 'text'  ,value:this.validateValue(this.ApplicantOtherBank[0].NAME_OF_BANK) },
  //     { field: 'NAME_OF_BRANCH_1', type: 'text',value:this.validateValue(this.ApplicantOtherBank[0].BRANCH_NAME) },
  //     { field: 'ACCOUNT_NO_1', type: 'text'    ,value:this.validateValue(this.ApplicantOtherBank[0].ACCOUNT_NO) },     

  //     { field: 'NAME_OF_BANK_2', type: 'text'  ,value:this.validateValue(this.ApplicantOtherBank[0].NAME_OF_BANK2) },
  //     { field: 'NAME_OF_BRANCH_2', type: 'text',value:this.validateValue(this.ApplicantOtherBank[0].BRANCH_NAME2) },
  //     { field: 'ACCOUNT_NO_2', type: 'text'    ,value:this.validateValue(this.ApplicantOtherBank[0].ACCOUNT_NO2) }, 

  //     { field: 'DEBIT_OR_CREDIT_CARD_NO_1', type: 'text' ,value:this.validateValue(this.ApplicantOtherBank[0].DEBIT_CARD)},
  //     { field: 'NAME_OF_BANK_3', type: 'text'            ,value:this.validateValue(this.ApplicantOtherBank[0].NAME_OF_BANK3)},

  //     { field: 'DEBIT_OR_CREDIT_CARD_NO_2', type: 'text' ,value:this.validateValue(this.ApplicantOtherBank[0].DEBIT_CARD2)},
  //     { field: 'NAME_OF_BANK_4', type: 'text'            ,value:this.validateValue(this.ApplicantOtherBank[0].NAME_OF_BANK4)},

  //     ]
  //   }

  //   // index 2

  //   if (this.ApplicantPersonal.length >= 2) {
  //     this.fieldMap2[1] = [

  //       { field: 'BRANCH_NAME1', type: 'text' },
  //       { field: 'D71,D78', type: 'block' },
  //       { field: 'C51,C512', type: 'block' },
  //       { field: 'TYPE_OF_ACCOUNT', type: 'text' },
  //       { field: 'APPLICANT_LAST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].LAST_NAME) },
  //       { field: 'APPLICANT_FIRST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].FIRST_NAME) },
  //       { field: 'APPLICANT_MIDDLE_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].MIDDLE_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_LAST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].F_OR_H_LAST_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_FIRST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].F_OR_H_FIRST_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_MIDDLE_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].F_OR_H_MIDDLE_NAME) },

  //       { field: 'CURRENT_ADDRESS_LINE_1', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].CURRENT_ADDRESS) },
  //       { field: 'CURRENT_ADDRESS_LINE_2', type: 'text' },
  //       { field: 'CURRENT_ADDRESS_LINE_3', type: 'text' },
  //       { field: 'C_CITY', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].CURRENT_CITY) },
  //       { field: 'C_TALUKA', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].CURRENT_TALUKA) },
  //       { field: 'C_DISTRICT', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].CURRENT_DISTRICT) },
  //       { field: 'C_BIG_SIGN_NEARBY', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].CURRENT_LANDMARK) },
  //       { field: 'C_STATE', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].CURRENT_STATE) },
  //       { field: 'C_P1,C_P6', type: 'block', value: this.validateBlock(this.ApplicantPersonal[1].CURRENT_PINCODE, 6) },

  //       { field: 'PERMANENT_ADDRESS_LINE_1', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].PERMANENT_ADDRESS) },
  //       { field: 'PERMANENT_ADDRESS_LINE_2', type: 'text' },
  //       { field: 'PERMANENT_ADDRESS_LINE_3', type: 'text' },
  //       { field: 'P_CITY', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].PERMANENT_CITY) },
  //       { field: 'P_TALUKA', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].PERMANENT_TALUKA) },
  //       { field: 'P_DISTRICT', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].PERMANENT_DISTRICT) },
  //       { field: 'P_BIG_SIGN_NEARBY', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].PERMANENT_LANDMARK) },
  //       { field: 'P_STATE', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].PERMANENT_STATE) },
  //       { field: 'P_P1,P_P6', type: 'block', value: this.validateBlock(this.ApplicantPersonal[1].PERMANENT_PINCODE, 6) },

  //       { field: 'H_L1,H_L12', type: 'block', value: this.validateBlock(this.ApplicantPersonal[1].HOUSE_PHONE, 12) },
  //       { field: 'O_L1,O_L12', type: 'block', value: this.validateBlock(this.ApplicantPersonal[1].OFFICE_PHONE, 12) },

  //       { field: 'EMAIL_ID', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].EMAIL_ID) },
  //       { field: 'M1,M10', type: 'block', value: this.validateBlock(this.ApplicantPersonal[1].MOBILE_NUMBER, 10) },

  //       { field: 'Check Box61', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].WORK, 'E') },
  //       { field: 'Check Box62', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].WORK, 'S') },
  //       { field: 'Check Box63', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].WORK, 'B') },
  //       { field: 'Check Box64', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].WORK, 'R') },
  //       { field: 'Check Box65', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].WORK, 'T') },
  //       { field: 'Check Box66', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].WORK, 'H') },
  //       { field: 'Check Box67', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].WORK, 'O') },

  //       { field: 'Check Box71', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].ESTABLISHMENT, 'L') },
  //       { field: 'Check Box72', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].ESTABLISHMENT, 'R') },
  //       { field: 'Check Box73', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].ESTABLISHMENT, 'E') },
  //       { field: 'Check Box74', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].ESTABLISHMENT, 'Y') },
  //       { field: 'Check Box75', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].ESTABLISHMENT, 'N') },
  //       { field: 'Check Box76', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].ESTABLISHMENT, 'T') },
  //       { field: 'Check Box77', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].ESTABLISHMENT, 'O') },

  //       { field: 'Check Box81', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].RELIGION, 'H') },
  //       { field: 'Check Box82', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].RELIGION, 'M') },
  //       { field: 'Check Box83', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].RELIGION, 'C') },
  //       { field: 'Check Box84', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].RELIGION, 'B') },
  //       { field: 'Check Box85', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].RELIGION, 'P') },
  //       { field: 'Check Box86', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].RELIGION, 'S') },
  //       { field: 'Check Box87', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].RELIGION, 'O') },

  //       { field: 'Check Box91', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].CASTE, 'N') },
  //       { field: 'Check Box92', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].CASTE, 'T') },
  //       { field: 'Check Box93', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].CASTE, 'S') },
  //       { field: 'Check Box94', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].CASTE, 'C') },
  //       { field: 'Check Box95', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].CASTE, 'O') },

  //       { field: 'Check Box101', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].MARITAL_STATUS, 'M') },
  //       { field: 'OFFSPRING', type: 'text', value: this.validateRadioButton(this.ApplicantPersonal[1].MARITAL_STATUS, 'M') ? this.validateValue(this.ApplicantPersonal[1].FAMILY_COUNT) : ' ' },
  //       { field: 'Check Box102', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].MARITAL_STATUS, 'U') },
  //       { field: 'TOTAL_FAMILY_MEMBERS', type: 'text', value: this.validateRadioButton(this.ApplicantPersonal[1].MARITAL_STATUS, 'U') ? this.validateValue(this.ApplicantPersonal[1].FAMILY_COUNT) : ' ' },


  //       { field: 'Check Box103', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EDUCATION, 'S') },
  //       { field: 'Check Box104', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EDUCATION, 'H') },
  //       { field: 'Check Box105', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EDUCATION, 'D') },
  //       { field: 'Check Box106', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EDUCATION, 'G') },
  //       { field: 'Check Box107', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EDUCATION, 'P') },
  //       { field: 'Check Box108', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EDUCATION, 'O') },

  //       { field: 'Check Box109', type: 'checkbox', value: this.ApplicantPersonal[1].IS_INSURED },
  //       { field: 'INSURANCE_AMOUNT', type: 'text', value: this.ApplicantPersonal[1].IS_INSURED ? this.validateValue(this.ApplicantPersonal[1].INSURANCE_YEAR) : ' ' },
  //       { field: 'POLICY_TYPE', type: 'text', value: this.ApplicantPersonal[1].IS_INSURED ? this.validateValue(this.ApplicantPersonal[1].POLICY_TYPE) : ' ' },
  //       { field: 'INSURANCE_COMPANY', type: 'text', value: this.ApplicantPersonal[1].IS_INSURED ? this.validateValue(this.ApplicantPersonal[1].INSURANCE_COMPANY) : ' ' },

  //       { field: 'UID1,UID18', type: 'block', value: this.validateBlock(this.ApplicantPersonal[1].AADHAAR_NUMBER, 18) },

  //       { field: 'BG_1', type: 'text', value: this.ApplicantPersonal[1].BLOOD_TYPE_SIGN == '+' ? this.validateValue(this.ApplicantPersonal[1].BLOOD_TYPE) : ' ' },
  //       { field: 'BG_2', type: 'text', value: this.ApplicantPersonal[1].BLOOD_TYPE_SIGN == '-' ? this.validateValue(this.ApplicantPersonal[1].BLOOD_TYPE) : ' ' },

  //       { field: 'Check Box111', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EMPLOYMENT_DETAIL, 'P') },
  //       { field: 'Check Box112', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EMPLOYMENT_DETAIL, 'C') },
  //       { field: 'Check Box113', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EMPLOYMENT_DETAIL, 'J') },

  //       { field: 'Check Box114', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EMPLOYMENT_DETAIL, 'E') },
  //       { field: 'Check Box115', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EMPLOYMENT_DETAIL, 'M') },
  //       { field: 'Check Box116', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].EMPLOYMENT_DETAIL, 'O') },

  //       { field: 'COMPANY_OR_OWNER_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[1].EMPLOYMENT_COMPANY) },
  //       { field: 'DESIGNATION', type: 'text' },

  //       { field: 'Check Box117', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].PROPRIETOR_DETAILS, 'C') },
  //       { field: 'Check Box118', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].PROPRIETOR_DETAILS, 'D') },
  //       { field: 'Check Box119', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].PROPRIETOR_DETAILS, 'A') },
  //       { field: 'Check Box120', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].PROPRIETOR_DETAILS, 'T') },
  //       { field: 'Check Box121', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].PROPRIETOR_DETAILS, 'E') },
  //       { field: 'Check Box122', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].PROPRIETOR_DETAILS, 'V') },
  //       { field: 'Check Box123', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].PROPRIETOR_DETAILS, 'S') },
  //       { field: 'Check Box124', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].PROPRIETOR_DETAILS, 'O') },



  //       { field: 'Check Box125', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].BUSINESS_DETAIL, 'P') },
  //       { field: 'Check Box126', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].BUSINESS_DETAIL, 'N') },
  //       { field: 'Check Box127', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].BUSINESS_DETAIL, 'A') },

  //       { field: 'Check Box128', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].BUSINESS_DETAIL, 'R') },
  //       { field: 'Check Box129', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].BUSINESS_DETAIL, 'T') },
  //       { field: 'Check Box130', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[1].BUSINESS_DETAIL, 'O') },

  //     ]
  //     this.fieldMap3[1] = []
  //   }

  //   if (this.ApplicantFinancial.length >= 2) {
  //     this.fieldMap3[1] = [

  //       { field: 'Check Box131', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[1].INCOME, '1') },
  //       { field: 'Check Box132', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[1].INCOME, '3') },
  //       { field: 'Check Box133', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[1].INCOME, '5') },
  //       { field: 'Check Box134', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[1].INCOME, '7') },
  //       { field: 'Check Box135', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[1].INCOME, '2') },
  //       { field: 'Check Box136', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[1].INCOME, '4') },
  //       { field: 'Check Box137', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[1].INCOME, '6') },
  //       { field: 'Check Box138', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[1].INCOME, '8') },

  //     ]
  //   }
  //   if (this.ApplicantProperty.length >= 2) {
  //     this.fieldMap3[1] = [...this.fieldMap3[1],

  //     { field: 'Check Box139', type: 'checkbox', value: this.ApplicantProperty[1].IS_FOUR_WHEELER },
  //     { field: 'Check Box140', type: 'checkbox', value: this.ApplicantProperty[1].IS_TWO_WHEELER },
  //     { field: 'Check Box141', type: 'checkbox', value: this.ApplicantProperty[1].IS_HOME_THEATER },
  //     { field: 'Check Box142', type: 'checkbox', value: this.ApplicantProperty[1].IS_AC },
  //     { field: 'Check Box143', type: 'checkbox', value: this.ApplicantProperty[1].IS_DIGITAL_CAMERA },
  //     { field: 'Check Box144', type: 'checkbox', value: this.ApplicantProperty[1].IS_VIDEO_PLAYER },
  //     { field: 'Check Box145', type: 'checkbox', value: this.ApplicantProperty[1].IS_MICROWAVE },
  //     { field: 'Check Box146', type: 'checkbox', value: this.ApplicantProperty[1].IS_LCD_TV },
  //     { field: 'Check Box147', type: 'checkbox', value: this.ApplicantProperty[1].IS_COMPUTER },
  //     { field: 'Check Box148', type: 'checkbox', value: this.ApplicantProperty[1].IS_WASHING_MACHINE },

  //     { field: 'Check Box149', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[1].HOUSE_DETAIL, 'O') },
  //     { field: 'Check Box150', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[1].HOUSE_DETAIL, 'H') },
  //     { field: 'Check Box151', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[1].HOUSE_DETAIL, 'D') },
  //     { field: 'Check Box152', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[1].HOUSE_DETAIL, 'G') },
  //     { field: 'Check Box153', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[1].HOUSE_DETAIL, 'P') },

  //     ]
  //   }

  //   if (this.ApplicantLoanInfo.length >= 2) {
  //     this.fieldMap3[1] = [...this.fieldMap3[1],

  //     { field: 'Check Box154', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN },
  //     { field: 'Check Box155', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_HOME_LOAN },
  //     { field: 'Check Box156', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN },
  //     { field: 'Check Box157', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN },
  //     { field: 'Check Box158', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN },
  //     { field: 'Check Box159', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_TOUR_LOAN },
  //     { field: 'Check Box160', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN },

  //     { field: 'Check Box161', type: 'checkbox', value: !this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN },
  //     { field: 'Check Box162', type: 'checkbox', value: !this.ApplicantLoanInfo[1].IS_HOME_LOAN },
  //     { field: 'Check Box163', type: 'checkbox', value: !this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN },
  //     { field: 'Check Box164', type: 'checkbox', value: !this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN },
  //     { field: 'Check Box165', type: 'checkbox', value: !this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN },
  //     { field: 'Check Box166', type: 'checkbox', value: !this.ApplicantLoanInfo[1].IS_TOUR_LOAN },
  //     { field: 'Check Box167', type: 'checkbox', value: !this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN },

  //     { field: 'Check Box168', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box169', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_HOME_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_HOME_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box170', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box171', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box172', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box173', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_TOUR_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_TOUR_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box174', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN_YEAR, '1') : false },

  //     { field: 'Check Box175', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box176', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_HOME_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_HOME_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box177', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box178', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box179', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box180', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_TOUR_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_TOUR_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box181', type: 'checkbox', value: this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN_YEAR, '2') : false },

  //     { field: 'Check Box182', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN_YEAR,'3'):false },
  //     { field: 'Check Box183', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_HOME_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[1].IS_HOME_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box184', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box185', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box186', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box187', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_TOUR_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[1].IS_TOUR_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box188', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN_YEAR,'3'):false},

  //     { field: 'Check Box189', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN_REQUIRED },
  //     { field: 'Check Box190', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_HOME_LOAN_REQUIRED },
  //     { field: 'Check Box191', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN_REQUIRED },
  //     { field: 'Check Box192', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN_REQUIRED },
  //     { field: 'Check Box193', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN_REQUIRED },
  //     { field: 'Check Box194', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_TOUR_LOAN_REQUIRED },
  //     { field: 'Check Box195', type: 'checkbox' , value: this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN_REQUIRED },

  //     { field: 'Check Box196', type: 'checkbox' , value: !this.ApplicantLoanInfo[1].IS_VEHICLE_LOAN_REQUIRED },
  //     { field: 'Check Box197', type: 'checkbox' , value: !this.ApplicantLoanInfo[1].IS_HOME_LOAN_REQUIRED },
  //     { field: 'Check Box198', type: 'checkbox' , value: !this.ApplicantLoanInfo[1].IS_CONSUMER_LOAN_REQUIRED },
  //     { field: 'Check Box199', type: 'checkbox' , value: !this.ApplicantLoanInfo[1].IS_BUSINESS_LOAN_REQUIRED },
  //     { field: 'Check Box200', type: 'checkbox' , value: !this.ApplicantLoanInfo[1].IS_INSURANCE_LOAN_REQUIRED },
  //     { field: 'Check Box201', type: 'checkbox' , value: !this.ApplicantLoanInfo[1].IS_TOUR_LOAN_REQUIRED },
  //     { field: 'Check Box202', type: 'checkbox' , value: !this.ApplicantLoanInfo[1].IS_EDUCATION_LOAN_REQUIRED },

  //     ]
  //   }

  //   if (this.ApplicantOtherBank.length >= 2) {
  //     this.fieldMap3[1] = [...this.fieldMap3[1],
  //     { field: 'NAME_OF_BANK_1', type: 'text'  ,value:this.validateValue(this.ApplicantOtherBank[1].NAME_OF_BANK) },
  //     { field: 'NAME_OF_BRANCH_1', type: 'text',value:this.validateValue(this.ApplicantOtherBank[1].BRANCH_NAME) },
  //     { field: 'ACCOUNT_NO_1', type: 'text'    ,value:this.validateValue(this.ApplicantOtherBank[1].ACCOUNT_NO) },     

  //     { field: 'NAME_OF_BANK_2', type: 'text'  ,value:this.validateValue(this.ApplicantOtherBank[1].NAME_OF_BANK2) },
  //     { field: 'NAME_OF_BRANCH_2', type: 'text',value:this.validateValue(this.ApplicantOtherBank[1].BRANCH_NAME2) },
  //     { field: 'ACCOUNT_NO_2', type: 'text'    ,value:this.validateValue(this.ApplicantOtherBank[1].ACCOUNT_NO2) }, 

  //     { field: 'DEBIT_OR_CREDIT_CARD_NO_1', type: 'text' ,value:this.validateValue(this.ApplicantOtherBank[1].DEBIT_CARD)},
  //     { field: 'NAME_OF_BANK_3', type: 'text'            ,value:this.validateValue(this.ApplicantOtherBank[1].NAME_OF_BANK3)},

  //     { field: 'DEBIT_OR_CREDIT_CARD_NO_2', type: 'text' ,value:this.validateValue(this.ApplicantOtherBank[1].DEBIT_CARD2)},
  //     { field: 'NAME_OF_BANK_4', type: 'text'            ,value:this.validateValue(this.ApplicantOtherBank[1].NAME_OF_BANK4)},

  //     ]
  //   }

  //   // index 3
  //   if (this.ApplicantPersonal.length >= 3) {
  //     this.fieldMap2[2] = [

  //       { field: 'BRANCH_NAME1', type: 'text' },
  //       { field: 'D71,D78', type: 'block' },
  //       { field: 'C51,C512', type: 'block' },
  //       { field: 'TYPE_OF_ACCOUNT', type: 'text' },
  //       { field: 'APPLICANT_LAST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].LAST_NAME) },
  //       { field: 'APPLICANT_FIRST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].FIRST_NAME) },
  //       { field: 'APPLICANT_MIDDLE_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].MIDDLE_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_LAST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].F_OR_H_LAST_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_FIRST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].F_OR_H_FIRST_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_MIDDLE_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].F_OR_H_MIDDLE_NAME) },

  //       { field: 'CURRENT_ADDRESS_LINE_1', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].CURRENT_ADDRESS) },
  //       { field: 'CURRENT_ADDRESS_LINE_2', type: 'text' },
  //       { field: 'CURRENT_ADDRESS_LINE_3', type: 'text' },
  //       { field: 'C_CITY', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].CURRENT_CITY) },
  //       { field: 'C_TALUKA', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].CURRENT_TALUKA) },
  //       { field: 'C_DISTRICT', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].CURRENT_DISTRICT) },
  //       { field: 'C_BIG_SIGN_NEARBY', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].CURRENT_LANDMARK) },
  //       { field: 'C_STATE', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].CURRENT_STATE) },
  //       { field: 'C_P1,C_P6', type: 'block', value: this.validateBlock(this.ApplicantPersonal[2].CURRENT_PINCODE, 6) },

  //       { field: 'PERMANENT_ADDRESS_LINE_1', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].PERMANENT_ADDRESS) },
  //       { field: 'PERMANENT_ADDRESS_LINE_2', type: 'text' },
  //       { field: 'PERMANENT_ADDRESS_LINE_3', type: 'text' },
  //       { field: 'P_CITY', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].PERMANENT_CITY) },
  //       { field: 'P_TALUKA', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].PERMANENT_TALUKA) },
  //       { field: 'P_DISTRICT', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].PERMANENT_DISTRICT) },
  //       { field: 'P_BIG_SIGN_NEARBY', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].PERMANENT_LANDMARK) },
  //       { field: 'P_STATE', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].PERMANENT_STATE) },
  //       { field: 'P_P1,P_P6', type: 'block', value: this.validateBlock(this.ApplicantPersonal[2].PERMANENT_PINCODE, 6) },

  //       { field: 'H_L1,H_L12', type: 'block', value: this.validateBlock(this.ApplicantPersonal[2].HOUSE_PHONE, 12) },
  //       { field: 'O_L1,O_L12', type: 'block', value: this.validateBlock(this.ApplicantPersonal[2].OFFICE_PHONE, 12) },

  //       { field: 'EMAIL_ID', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].EMAIL_ID) },
  //       { field: 'M1,M10', type: 'block', value: this.validateBlock(this.ApplicantPersonal[2].MOBILE_NUMBER, 10) },

  //       { field: 'Check Box61', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].WORK, 'E') },
  //       { field: 'Check Box62', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].WORK, 'S') },
  //       { field: 'Check Box63', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].WORK, 'B') },
  //       { field: 'Check Box64', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].WORK, 'R') },
  //       { field: 'Check Box65', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].WORK, 'T') },
  //       { field: 'Check Box66', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].WORK, 'H') },
  //       { field: 'Check Box67', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].WORK, 'O') },

  //       { field: 'Check Box71', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].ESTABLISHMENT, 'L') },
  //       { field: 'Check Box72', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].ESTABLISHMENT, 'R') },
  //       { field: 'Check Box73', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].ESTABLISHMENT, 'E') },
  //       { field: 'Check Box74', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].ESTABLISHMENT, 'Y') },
  //       { field: 'Check Box75', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].ESTABLISHMENT, 'N') },
  //       { field: 'Check Box76', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].ESTABLISHMENT, 'T') },
  //       { field: 'Check Box77', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].ESTABLISHMENT, 'O') },

  //       { field: 'Check Box81', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].RELIGION, 'H') },
  //       { field: 'Check Box82', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].RELIGION, 'M') },
  //       { field: 'Check Box83', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].RELIGION, 'C') },
  //       { field: 'Check Box84', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].RELIGION, 'B') },
  //       { field: 'Check Box85', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].RELIGION, 'P') },
  //       { field: 'Check Box86', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].RELIGION, 'S') },
  //       { field: 'Check Box87', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].RELIGION, 'O') },

  //       { field: 'Check Box91', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].CASTE, 'N') },
  //       { field: 'Check Box92', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].CASTE, 'T') },
  //       { field: 'Check Box93', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].CASTE, 'S') },
  //       { field: 'Check Box94', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].CASTE, 'C') },
  //       { field: 'Check Box95', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].CASTE, 'O') },

  //       { field: 'Check Box101', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].MARITAL_STATUS, 'M') },
  //       { field: 'OFFSPRING', type: 'text', value: this.validateRadioButton(this.ApplicantPersonal[2].MARITAL_STATUS, 'M') ? this.validateValue(this.ApplicantPersonal[2].FAMILY_COUNT) : ' ' },
  //       { field: 'Check Box102', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].MARITAL_STATUS, 'U') },
  //       { field: 'TOTAL_FAMILY_MEMBERS', type: 'text', value: this.validateRadioButton(this.ApplicantPersonal[2].MARITAL_STATUS, 'U') ? this.validateValue(this.ApplicantPersonal[2].FAMILY_COUNT) : ' ' },


  //       { field: 'Check Box103', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EDUCATION, 'S') },
  //       { field: 'Check Box104', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EDUCATION, 'H') },
  //       { field: 'Check Box105', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EDUCATION, 'D') },
  //       { field: 'Check Box106', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EDUCATION, 'G') },
  //       { field: 'Check Box107', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EDUCATION, 'P') },
  //       { field: 'Check Box108', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EDUCATION, 'O') },

  //       { field: 'Check Box109', type: 'checkbox', value: this.ApplicantPersonal[2].IS_INSURED },
  //       { field: 'INSURANCE_AMOUNT', type: 'text', value: this.ApplicantPersonal[2].IS_INSURED ? this.validateValue(this.ApplicantPersonal[2].INSURANCE_YEAR) : ' ' },
  //       { field: 'POLICY_TYPE', type: 'text', value: this.ApplicantPersonal[2].IS_INSURED ? this.validateValue(this.ApplicantPersonal[2].POLICY_TYPE) : ' ' },
  //       { field: 'INSURANCE_COMPANY', type: 'text', value: this.ApplicantPersonal[2].IS_INSURED ? this.validateValue(this.ApplicantPersonal[2].INSURANCE_COMPANY) : ' ' },

  //       { field: 'UID1,UID18', type: 'block', value: this.validateBlock(this.ApplicantPersonal[2].AADHAAR_NUMBER, 18) },

  //       { field: 'BG_1', type: 'text', value: this.ApplicantPersonal[2].BLOOD_TYPE_SIGN == '+' ? this.validateValue(this.ApplicantPersonal[2].BLOOD_TYPE) : ' ' },
  //       { field: 'BG_2', type: 'text', value: this.ApplicantPersonal[2].BLOOD_TYPE_SIGN == '-' ? this.validateValue(this.ApplicantPersonal[2].BLOOD_TYPE) : ' ' },

  //       { field: 'Check Box111', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EMPLOYMENT_DETAIL, 'P') },
  //       { field: 'Check Box112', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EMPLOYMENT_DETAIL, 'C') },
  //       { field: 'Check Box113', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EMPLOYMENT_DETAIL, 'J') },

  //       { field: 'Check Box114', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EMPLOYMENT_DETAIL, 'E') },
  //       { field: 'Check Box115', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EMPLOYMENT_DETAIL, 'M') },
  //       { field: 'Check Box116', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].EMPLOYMENT_DETAIL, 'O') },

  //       { field: 'COMPANY_OR_OWNER_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[2].EMPLOYMENT_COMPANY) },
  //       { field: 'DESIGNATION', type: 'text' },

  //       { field: 'Check Box117', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].PROPRIETOR_DETAILS, 'C') },
  //       { field: 'Check Box118', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].PROPRIETOR_DETAILS, 'D') },
  //       { field: 'Check Box119', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].PROPRIETOR_DETAILS, 'A') },
  //       { field: 'Check Box120', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].PROPRIETOR_DETAILS, 'T') },
  //       { field: 'Check Box121', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].PROPRIETOR_DETAILS, 'E') },
  //       { field: 'Check Box122', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].PROPRIETOR_DETAILS, 'V') },
  //       { field: 'Check Box123', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].PROPRIETOR_DETAILS, 'S') },
  //       { field: 'Check Box124', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].PROPRIETOR_DETAILS, 'O') },



  //       { field: 'Check Box125', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].BUSINESS_DETAIL, 'P') },
  //       { field: 'Check Box126', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].BUSINESS_DETAIL, 'N') },
  //       { field: 'Check Box127', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].BUSINESS_DETAIL, 'A') },

  //       { field: 'Check Box128', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].BUSINESS_DETAIL, 'R') },
  //       { field: 'Check Box129', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].BUSINESS_DETAIL, 'T') },
  //       { field: 'Check Box130', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[2].BUSINESS_DETAIL, 'O') },

  //     ]

  //     this.fieldMap3[2] = []
  //   }


  //   if (this.ApplicantFinancial.length >= 3) {
  //     this.fieldMap3[2] = [

  //       { field: 'Check Box131', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[2].INCOME, '1') },
  //       { field: 'Check Box132', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[2].INCOME, '3') },
  //       { field: 'Check Box133', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[2].INCOME, '5') },
  //       { field: 'Check Box134', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[2].INCOME, '7') },
  //       { field: 'Check Box135', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[2].INCOME, '2') },
  //       { field: 'Check Box136', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[2].INCOME, '4') },
  //       { field: 'Check Box137', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[2].INCOME, '6') },
  //       { field: 'Check Box138', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[2].INCOME, '8') },

  //     ]
  //   }
  //   if (this.ApplicantProperty.length >= 3) {
  //     this.fieldMap3[2] = [...this.fieldMap3[2],

  //     { field: 'Check Box139', type: 'checkbox', value: this.ApplicantProperty[2].IS_FOUR_WHEELER },
  //     { field: 'Check Box140', type: 'checkbox', value: this.ApplicantProperty[2].IS_TWO_WHEELER },
  //     { field: 'Check Box141', type: 'checkbox', value: this.ApplicantProperty[2].IS_HOME_THEATER },
  //     { field: 'Check Box142', type: 'checkbox', value: this.ApplicantProperty[2].IS_AC },
  //     { field: 'Check Box143', type: 'checkbox', value: this.ApplicantProperty[2].IS_DIGITAL_CAMERA },
  //     { field: 'Check Box144', type: 'checkbox', value: this.ApplicantProperty[2].IS_VIDEO_PLAYER },
  //     { field: 'Check Box145', type: 'checkbox', value: this.ApplicantProperty[2].IS_MICROWAVE },
  //     { field: 'Check Box146', type: 'checkbox', value: this.ApplicantProperty[2].IS_LCD_TV },
  //     { field: 'Check Box147', type: 'checkbox', value: this.ApplicantProperty[2].IS_COMPUTER },
  //     { field: 'Check Box148', type: 'checkbox', value: this.ApplicantProperty[2].IS_WASHING_MACHINE },

  //     { field: 'Check Box149', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[2].HOUSE_DETAIL, 'O') },
  //     { field: 'Check Box150', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[2].HOUSE_DETAIL, 'H') },
  //     { field: 'Check Box151', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[2].HOUSE_DETAIL, 'D') },
  //     { field: 'Check Box152', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[2].HOUSE_DETAIL, 'G') },
  //     { field: 'Check Box153', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[2].HOUSE_DETAIL, 'P') },

  //     ]
  //   }

  //   if (this.ApplicantLoanInfo.length >= 3) {
  //     this.fieldMap3[2] = [...this.fieldMap3[2],

  //     { field: 'Check Box154', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN },
  //     { field: 'Check Box155', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_HOME_LOAN },
  //     { field: 'Check Box156', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN },
  //     { field: 'Check Box157', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN },
  //     { field: 'Check Box158', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN },
  //     { field: 'Check Box159', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_TOUR_LOAN },
  //     { field: 'Check Box160', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN },

  //     { field: 'Check Box161', type: 'checkbox', value: !this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN },
  //     { field: 'Check Box162', type: 'checkbox', value: !this.ApplicantLoanInfo[2].IS_HOME_LOAN },
  //     { field: 'Check Box163', type: 'checkbox', value: !this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN },
  //     { field: 'Check Box164', type: 'checkbox', value: !this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN },
  //     { field: 'Check Box165', type: 'checkbox', value: !this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN },
  //     { field: 'Check Box166', type: 'checkbox', value: !this.ApplicantLoanInfo[2].IS_TOUR_LOAN },
  //     { field: 'Check Box167', type: 'checkbox', value: !this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN },

  //     { field: 'Check Box168', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box169', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_HOME_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_HOME_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box170', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box171', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box172', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box173', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_TOUR_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_TOUR_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box174', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN_YEAR, '1') : false },

  //     { field: 'Check Box175', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box176', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_HOME_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_HOME_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box177', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box178', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box179', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box180', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_TOUR_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_TOUR_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box181', type: 'checkbox', value: this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN_YEAR, '2') : false },

  //     { field: 'Check Box182', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN_YEAR,'3'):false },
  //     { field: 'Check Box183', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_HOME_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[2].IS_HOME_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box184', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box185', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box186', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box187', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_TOUR_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[2].IS_TOUR_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box188', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN_YEAR,'3'):false},

  //     { field: 'Check Box189', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN_REQUIRED },
  //     { field: 'Check Box190', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_HOME_LOAN_REQUIRED },
  //     { field: 'Check Box191', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN_REQUIRED },
  //     { field: 'Check Box192', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN_REQUIRED },
  //     { field: 'Check Box193', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN_REQUIRED },
  //     { field: 'Check Box194', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_TOUR_LOAN_REQUIRED },
  //     { field: 'Check Box195', type: 'checkbox' , value: this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN_REQUIRED },

  //     { field: 'Check Box196', type: 'checkbox' , value: !this.ApplicantLoanInfo[2].IS_VEHICLE_LOAN_REQUIRED },
  //     { field: 'Check Box197', type: 'checkbox' , value: !this.ApplicantLoanInfo[2].IS_HOME_LOAN_REQUIRED },
  //     { field: 'Check Box198', type: 'checkbox' , value: !this.ApplicantLoanInfo[2].IS_CONSUMER_LOAN_REQUIRED },
  //     { field: 'Check Box199', type: 'checkbox' , value: !this.ApplicantLoanInfo[2].IS_BUSINESS_LOAN_REQUIRED },
  //     { field: 'Check Box200', type: 'checkbox' , value: !this.ApplicantLoanInfo[2].IS_INSURANCE_LOAN_REQUIRED },
  //     { field: 'Check Box201', type: 'checkbox' , value: !this.ApplicantLoanInfo[2].IS_TOUR_LOAN_REQUIRED },
  //     { field: 'Check Box202', type: 'checkbox' , value: !this.ApplicantLoanInfo[2].IS_EDUCATION_LOAN_REQUIRED },

  //     ]
  //   }

  //   if (this.ApplicantOtherBank.length >= 3) {
  //     this.fieldMap3[2] = [...this.fieldMap3[2],
  //     { field: 'NAME_OF_BANK_1', type: 'text'  ,value:this.validateValue(this.ApplicantOtherBank[2].NAME_OF_BANK) },
  //     { field: 'NAME_OF_BRANCH_1', type: 'text',value:this.validateValue(this.ApplicantOtherBank[2].BRANCH_NAME) },
  //     { field: 'ACCOUNT_NO_1', type: 'text'    ,value:this.validateValue(this.ApplicantOtherBank[2].ACCOUNT_NO) },     

  //     { field: 'NAME_OF_BANK_2', type: 'text'  ,value:this.validateValue(this.ApplicantOtherBank[2].NAME_OF_BANK2) },
  //     { field: 'NAME_OF_BRANCH_2', type: 'text',value:this.validateValue(this.ApplicantOtherBank[2].BRANCH_NAME2) },
  //     { field: 'ACCOUNT_NO_2', type: 'text'    ,value:this.validateValue(this.ApplicantOtherBank[2].ACCOUNT_NO2) }, 

  //     { field: 'DEBIT_OR_CREDIT_CARD_NO_1', type: 'text' ,value:this.validateValue(this.ApplicantOtherBank[2].DEBIT_CARD)},
  //     { field: 'NAME_OF_BANK_3', type: 'text'            ,value:this.validateValue(this.ApplicantOtherBank[2].NAME_OF_BANK3)},

  //     { field: 'DEBIT_OR_CREDIT_CARD_NO_2', type: 'text' ,value:this.validateValue(this.ApplicantOtherBank[2].DEBIT_CARD2)},
  //     { field: 'NAME_OF_BANK_4', type: 'text'            ,value:this.validateValue(this.ApplicantOtherBank[2].NAME_OF_BANK4)},

  //     ]
  //   }

  //   // index 4
  //   if (this.ApplicantPersonal.length >= 4) {
  //     this.fieldMap2[3] = [

  //       { field: 'BRANCH_NAME1', type: 'text' },
  //       { field: 'D71,D78', type: 'block' },
  //       { field: 'C51,C512', type: 'block' },
  //       { field: 'TYPE_OF_ACCOUNT', type: 'text' },
  //       { field: 'APPLICANT_LAST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].LAST_NAME) },
  //       { field: 'APPLICANT_FIRST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].FIRST_NAME) },
  //       { field: 'APPLICANT_MIDDLE_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].MIDDLE_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_LAST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].F_OR_H_LAST_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_FIRST_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].F_OR_H_FIRST_NAME) },
  //       { field: 'FATHER_OR_HUSBAND_MIDDLE_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].F_OR_H_MIDDLE_NAME) },

  //       { field: 'CURRENT_ADDRESS_LINE_1', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].CURRENT_ADDRESS) },
  //       { field: 'CURRENT_ADDRESS_LINE_2', type: 'text' },
  //       { field: 'CURRENT_ADDRESS_LINE_3', type: 'text' },
  //       { field: 'C_CITY', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].CURRENT_CITY) },
  //       { field: 'C_TALUKA', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].CURRENT_TALUKA) },
  //       { field: 'C_DISTRICT', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].CURRENT_DISTRICT) },
  //       { field: 'C_BIG_SIGN_NEARBY', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].CURRENT_LANDMARK) },
  //       { field: 'C_STATE', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].CURRENT_STATE) },
  //       { field: 'C_P1,C_P6', type: 'block', value: this.validateBlock(this.ApplicantPersonal[3].CURRENT_PINCODE, 6) },

  //       { field: 'PERMANENT_ADDRESS_LINE_1', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].PERMANENT_ADDRESS) },
  //       { field: 'PERMANENT_ADDRESS_LINE_2', type: 'text' },
  //       { field: 'PERMANENT_ADDRESS_LINE_3', type: 'text' },
  //       { field: 'P_CITY', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].PERMANENT_CITY) },
  //       { field: 'P_TALUKA', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].PERMANENT_TALUKA) },
  //       { field: 'P_DISTRICT', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].PERMANENT_DISTRICT) },
  //       { field: 'P_BIG_SIGN_NEARBY', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].PERMANENT_LANDMARK) },
  //       { field: 'P_STATE', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].PERMANENT_STATE) },
  //       { field: 'P_P1,P_P6', type: 'block', value: this.validateBlock(this.ApplicantPersonal[3].PERMANENT_PINCODE, 6) },

  //       { field: 'H_L1,H_L12', type: 'block', value: this.validateBlock(this.ApplicantPersonal[3].HOUSE_PHONE, 12) },
  //       { field: 'O_L1,O_L12', type: 'block', value: this.validateBlock(this.ApplicantPersonal[3].OFFICE_PHONE, 12) },

  //       { field: 'EMAIL_ID', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].EMAIL_ID) },
  //       { field: 'M1,M10', type: 'block', value: this.validateBlock(this.ApplicantPersonal[3].MOBILE_NUMBER, 10) },

  //       { field: 'Check Box61', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].WORK, 'E') },
  //       { field: 'Check Box62', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].WORK, 'S') },
  //       { field: 'Check Box63', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].WORK, 'B') },
  //       { field: 'Check Box64', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].WORK, 'R') },
  //       { field: 'Check Box65', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].WORK, 'T') },
  //       { field: 'Check Box66', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].WORK, 'H') },
  //       { field: 'Check Box67', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].WORK, 'O') },

  //       { field: 'Check Box71', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].ESTABLISHMENT, 'L') },
  //       { field: 'Check Box72', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].ESTABLISHMENT, 'R') },
  //       { field: 'Check Box73', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].ESTABLISHMENT, 'E') },
  //       { field: 'Check Box74', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].ESTABLISHMENT, 'Y') },
  //       { field: 'Check Box75', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].ESTABLISHMENT, 'N') },
  //       { field: 'Check Box76', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].ESTABLISHMENT, 'T') },
  //       { field: 'Check Box77', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].ESTABLISHMENT, 'O') },

  //       { field: 'Check Box81', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].RELIGION, 'H') },
  //       { field: 'Check Box82', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].RELIGION, 'M') },
  //       { field: 'Check Box83', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].RELIGION, 'C') },
  //       { field: 'Check Box84', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].RELIGION, 'B') },
  //       { field: 'Check Box85', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].RELIGION, 'P') },
  //       { field: 'Check Box86', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].RELIGION, 'S') },
  //       { field: 'Check Box87', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].RELIGION, 'O') },

  //       { field: 'Check Box91', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].CASTE, 'N') },
  //       { field: 'Check Box92', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].CASTE, 'T') },
  //       { field: 'Check Box93', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].CASTE, 'S') },
  //       { field: 'Check Box94', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].CASTE, 'C') },
  //       { field: 'Check Box95', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].CASTE, 'O') },

  //       { field: 'Check Box101', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].MARITAL_STATUS, 'M') },
  //       { field: 'OFFSPRING', type: 'text', value: this.validateRadioButton(this.ApplicantPersonal[3].MARITAL_STATUS, 'M') ? this.validateValue(this.ApplicantPersonal[3].FAMILY_COUNT) : ' ' },
  //       { field: 'Check Box102', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].MARITAL_STATUS, 'U') },
  //       { field: 'TOTAL_FAMILY_MEMBERS', type: 'text', value: this.validateRadioButton(this.ApplicantPersonal[3].MARITAL_STATUS, 'U') ? this.validateValue(this.ApplicantPersonal[3].FAMILY_COUNT) : ' ' },


  //       { field: 'Check Box103', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EDUCATION, 'S') },
  //       { field: 'Check Box104', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EDUCATION, 'H') },
  //       { field: 'Check Box105', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EDUCATION, 'D') },
  //       { field: 'Check Box106', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EDUCATION, 'G') },
  //       { field: 'Check Box107', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EDUCATION, 'P') },
  //       { field: 'Check Box108', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EDUCATION, 'O') },

  //       { field: 'Check Box109', type: 'checkbox', value: this.ApplicantPersonal[3].IS_INSURED },
  //       { field: 'INSURANCE_AMOUNT', type: 'text', value: this.ApplicantPersonal[3].IS_INSURED ? this.validateValue(this.ApplicantPersonal[3].INSURANCE_YEAR) : ' ' },
  //       { field: 'POLICY_TYPE', type: 'text', value: this.ApplicantPersonal[3].IS_INSURED ? this.validateValue(this.ApplicantPersonal[3].POLICY_TYPE) : ' ' },
  //       { field: 'INSURANCE_COMPANY', type: 'text', value: this.ApplicantPersonal[3].IS_INSURED ? this.validateValue(this.ApplicantPersonal[3].INSURANCE_COMPANY) : ' ' },

  //       { field: 'UID1,UID18', type: 'block', value: this.validateBlock(this.ApplicantPersonal[3].AADHAAR_NUMBER, 18) },

  //       { field: 'BG_1', type: 'text', value: this.ApplicantPersonal[3].BLOOD_TYPE_SIGN == '+' ? this.validateValue(this.ApplicantPersonal[3].BLOOD_TYPE) : ' ' },
  //       { field: 'BG_2', type: 'text', value: this.ApplicantPersonal[3].BLOOD_TYPE_SIGN == '-' ? this.validateValue(this.ApplicantPersonal[3].BLOOD_TYPE) : ' ' },

  //       { field: 'Check Box111', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EMPLOYMENT_DETAIL, 'P') },
  //       { field: 'Check Box112', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EMPLOYMENT_DETAIL, 'C') },
  //       { field: 'Check Box113', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EMPLOYMENT_DETAIL, 'J') },

  //       { field: 'Check Box114', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EMPLOYMENT_DETAIL, 'E') },
  //       { field: 'Check Box115', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EMPLOYMENT_DETAIL, 'M') },
  //       { field: 'Check Box116', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].EMPLOYMENT_DETAIL, 'O') },

  //       { field: 'COMPANY_OR_OWNER_NAME', type: 'text', value: this.validateValue(this.ApplicantPersonal[3].EMPLOYMENT_COMPANY) },
  //       { field: 'DESIGNATION', type: 'text' },

  //       { field: 'Check Box117', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].PROPRIETOR_DETAILS, 'C') },
  //       { field: 'Check Box118', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].PROPRIETOR_DETAILS, 'D') },
  //       { field: 'Check Box119', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].PROPRIETOR_DETAILS, 'A') },
  //       { field: 'Check Box120', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].PROPRIETOR_DETAILS, 'T') },
  //       { field: 'Check Box121', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].PROPRIETOR_DETAILS, 'E') },
  //       { field: 'Check Box122', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].PROPRIETOR_DETAILS, 'V') },
  //       { field: 'Check Box123', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].PROPRIETOR_DETAILS, 'S') },
  //       { field: 'Check Box124', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].PROPRIETOR_DETAILS, 'O') },



  //       { field: 'Check Box125', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].BUSINESS_DETAIL, 'P') },
  //       { field: 'Check Box126', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].BUSINESS_DETAIL, 'N') },
  //       { field: 'Check Box127', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].BUSINESS_DETAIL, 'A') },

  //       { field: 'Check Box128', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].BUSINESS_DETAIL, 'R') },
  //       { field: 'Check Box129', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].BUSINESS_DETAIL, 'T') },
  //       { field: 'Check Box130', type: 'checkbox', value: this.validateRadioButton(this.ApplicantPersonal[3].BUSINESS_DETAIL, 'O') },

  //     ]

  //     this.fieldMap3[3] = []
  //   }

  //   if (this.ApplicantFinancial.length >= 4) {
  //     this.fieldMap3[3] = [

  //       { field: 'Check Box131', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[3].INCOME, '1') },
  //       { field: 'Check Box132', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[3].INCOME, '3') },
  //       { field: 'Check Box133', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[3].INCOME, '5') },
  //       { field: 'Check Box134', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[3].INCOME, '7') },
  //       { field: 'Check Box135', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[3].INCOME, '2') },
  //       { field: 'Check Box136', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[3].INCOME, '4') },
  //       { field: 'Check Box137', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[3].INCOME, '6') },
  //       { field: 'Check Box138', type: 'checkbox', value: this.validateRadioButton(this.ApplicantFinancial[3].INCOME, '8') },

  //     ]
  //   }
  //   if (this.ApplicantProperty.length >= 4) {
  //     this.fieldMap3[3] = [...this.fieldMap3[3],

  //     { field: 'Check Box139', type: 'checkbox', value: this.ApplicantProperty[3].IS_FOUR_WHEELER },
  //     { field: 'Check Box140', type: 'checkbox', value: this.ApplicantProperty[3].IS_TWO_WHEELER },
  //     { field: 'Check Box141', type: 'checkbox', value: this.ApplicantProperty[3].IS_HOME_THEATER },
  //     { field: 'Check Box142', type: 'checkbox', value: this.ApplicantProperty[3].IS_AC },
  //     { field: 'Check Box143', type: 'checkbox', value: this.ApplicantProperty[3].IS_DIGITAL_CAMERA },
  //     { field: 'Check Box144', type: 'checkbox', value: this.ApplicantProperty[3].IS_VIDEO_PLAYER },
  //     { field: 'Check Box145', type: 'checkbox', value: this.ApplicantProperty[3].IS_MICROWAVE },
  //     { field: 'Check Box146', type: 'checkbox', value: this.ApplicantProperty[3].IS_LCD_TV },
  //     { field: 'Check Box147', type: 'checkbox', value: this.ApplicantProperty[3].IS_COMPUTER },
  //     { field: 'Check Box148', type: 'checkbox', value: this.ApplicantProperty[3].IS_WASHING_MACHINE },

  //     { field: 'Check Box149', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[3].HOUSE_DETAIL, 'O') },
  //     { field: 'Check Box150', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[3].HOUSE_DETAIL, 'H') },
  //     { field: 'Check Box151', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[3].HOUSE_DETAIL, 'D') },
  //     { field: 'Check Box152', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[3].HOUSE_DETAIL, 'G') },
  //     { field: 'Check Box153', type: 'checkbox', value: this.validateRadioButton(this.ApplicantProperty[3].HOUSE_DETAIL, 'P') },

  //     ]
  //   }

  //   if (this.ApplicantLoanInfo.length >= 4) {
  //     this.fieldMap3[3] = [...this.fieldMap3[3],

  //     { field: 'Check Box154', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN },
  //     { field: 'Check Box155', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_HOME_LOAN },
  //     { field: 'Check Box156', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN },
  //     { field: 'Check Box157', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN },
  //     { field: 'Check Box158', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN },
  //     { field: 'Check Box159', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_TOUR_LOAN },
  //     { field: 'Check Box160', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN },

  //     { field: 'Check Box161', type: 'checkbox', value: !this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN },
  //     { field: 'Check Box162', type: 'checkbox', value: !this.ApplicantLoanInfo[3].IS_HOME_LOAN },
  //     { field: 'Check Box163', type: 'checkbox', value: !this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN },
  //     { field: 'Check Box164', type: 'checkbox', value: !this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN },
  //     { field: 'Check Box165', type: 'checkbox', value: !this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN },
  //     { field: 'Check Box166', type: 'checkbox', value: !this.ApplicantLoanInfo[3].IS_TOUR_LOAN },
  //     { field: 'Check Box167', type: 'checkbox', value: !this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN },

  //     { field: 'Check Box168', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box169', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_HOME_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_HOME_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box170', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box171', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box172', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box173', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_TOUR_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_TOUR_LOAN_YEAR, '1') : false },
  //     { field: 'Check Box174', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN_YEAR, '1') : false },

  //     { field: 'Check Box175', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box176', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_HOME_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_HOME_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box177', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box178', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box179', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box180', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_TOUR_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_TOUR_LOAN_YEAR, '2') : false },
  //     { field: 'Check Box181', type: 'checkbox', value: this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN ? this.validateRadioButton(this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN_YEAR, '2') : false },

  //     { field: 'Check Box182', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN_YEAR,'3'):false },
  //     { field: 'Check Box183', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_HOME_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[3].IS_HOME_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box184', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box185', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box186', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box187', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_TOUR_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[3].IS_TOUR_LOAN_YEAR,'3'):false},
  //     { field: 'Check Box188', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN ?this.validateRadioButton(this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN_YEAR,'3'):false},

  //     { field: 'Check Box189', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN_REQUIRED },
  //     { field: 'Check Box190', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_HOME_LOAN_REQUIRED },
  //     { field: 'Check Box191', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN_REQUIRED },
  //     { field: 'Check Box192', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN_REQUIRED },
  //     { field: 'Check Box193', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN_REQUIRED },
  //     { field: 'Check Box194', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_TOUR_LOAN_REQUIRED },
  //     { field: 'Check Box195', type: 'checkbox' , value: this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN_REQUIRED },

  //     { field: 'Check Box196', type: 'checkbox' , value: !this.ApplicantLoanInfo[3].IS_VEHICLE_LOAN_REQUIRED },
  //     { field: 'Check Box197', type: 'checkbox' , value: !this.ApplicantLoanInfo[3].IS_HOME_LOAN_REQUIRED },
  //     { field: 'Check Box198', type: 'checkbox' , value: !this.ApplicantLoanInfo[3].IS_CONSUMER_LOAN_REQUIRED },
  //     { field: 'Check Box199', type: 'checkbox' , value: !this.ApplicantLoanInfo[3].IS_BUSINESS_LOAN_REQUIRED },
  //     { field: 'Check Box200', type: 'checkbox' , value: !this.ApplicantLoanInfo[3].IS_INSURANCE_LOAN_REQUIRED },
  //     { field: 'Check Box201', type: 'checkbox' , value: !this.ApplicantLoanInfo[3].IS_TOUR_LOAN_REQUIRED },
  //     { field: 'Check Box202', type: 'checkbox' , value: !this.ApplicantLoanInfo[3].IS_EDUCATION_LOAN_REQUIRED },

  //     ]
  //   }

  //   if (this.ApplicantOtherBank.length >= 4) {
  //     this.fieldMap3[3] = [...this.fieldMap3[3],
  //     { field: 'NAME_OF_BANK_1', type: 'text'  ,value:this.validateValue(this.ApplicantOtherBank[3].NAME_OF_BANK) },
  //     { field: 'NAME_OF_BRANCH_1', type: 'text',value:this.validateValue(this.ApplicantOtherBank[3].BRANCH_NAME) },
  //     { field: 'ACCOUNT_NO_1', type: 'text'    ,value:this.validateValue(this.ApplicantOtherBank[3].ACCOUNT_NO) },     

  //     { field: 'NAME_OF_BANK_2', type: 'text'  ,value:this.validateValue(this.ApplicantOtherBank[3].NAME_OF_BANK2) },
  //     { field: 'NAME_OF_BRANCH_2', type: 'text',value:this.validateValue(this.ApplicantOtherBank[3].BRANCH_NAME2) },
  //     { field: 'ACCOUNT_NO_2', type: 'text'    ,value:this.validateValue(this.ApplicantOtherBank[3].ACCOUNT_NO2) }, 

  //     { field: 'DEBIT_OR_CREDIT_CARD_NO_1', type: 'text' ,value:this.validateValue(this.ApplicantOtherBank[3].DEBIT_CARD)},
  //     { field: 'NAME_OF_BANK_3', type: 'text'            ,value:this.validateValue(this.ApplicantOtherBank[3].NAME_OF_BANK3)},

  //     { field: 'DEBIT_OR_CREDIT_CARD_NO_2', type: 'text' ,value:this.validateValue(this.ApplicantOtherBank[3].DEBIT_CARD2)},
  //     { field: 'NAME_OF_BANK_4', type: 'text'            ,value:this.validateValue(this.ApplicantOtherBank[3].NAME_OF_BANK4)},

  //     ]
  //   }

  // }

  // async fillPdf() {
  //   // console.error("In pdfFill");
  //   const formPdfBytes = await fetch(this.pdfSrc).then(res => res.arrayBuffer());

  //   const formPdfBytes2 = await fetch(this.pdfSrc2).then(res => res.arrayBuffer());





  //   this.MergedPdf = await PDFDocument.create();

  //   this.pdfDoc = await PDFDocument.load(formPdfBytes);
  //   this.pdfDoc2 = await PDFDocument.load(formPdfBytes2);




  //   const form = this.pdfDoc.getForm();
  //   const form2 = this.pdfDoc2.getForm();
  //   let form3;
  //   let form4;
  //   let form5;


  //   if (this.ApplicantPersonal.length >= 2) {
  //     const formPdfBytes3 = await fetch(this.pdfSrc2).then(res => res.arrayBuffer())
  //     this.pdfDoc3 = await PDFDocument.load(formPdfBytes3);
  //     form3 = this.pdfDoc3.getForm();
  //   }

  //   if (this.ApplicantPersonal.length >= 3) {
  //     const formPdfBytes4 = await fetch(this.pdfSrc2).then(res => res.arrayBuffer())
  //     this.pdfDoc4 = await PDFDocument.load(formPdfBytes4);
  //     form4 = this.pdfDoc4.getForm();
  //   }

  //   if (this.ApplicantPersonal.length >= 4) {
  //     const formPdfBytes5 = await fetch(this.pdfSrc2).then(res => res.arrayBuffer())
  //     this.pdfDoc5 = await PDFDocument.load(formPdfBytes5);
  //     form5 = this.pdfDoc5.getForm();
  //   }


  //   for (let field of this.fieldMap) {
  //     if (field.type == 'text') {
  //       if (field.value) {
  //         form.getTextField(field.field).setText(field.value);
  //       }

  //     }

  //     if (field.type == 'image') {
  //       if (field.value) {
  //         let emblemImageBytes = await fetch(field.value).then(res => res.arrayBuffer())
  //         let applicantImage = await this.pdfDoc.embedJpg(emblemImageBytes);
  //         form.getButton(field.field).setImage(applicantImage);
  //       }
  //     }

  //   }

  //   for (let i = 0; i < this.ApplicantPersonal.length; i++) {
  //     if (i == 0) {
  //       for (let field of this.fieldMap2[i]) {
  //         if (field.type == 'text') {
  //           if (field.value) {
  //             form2.getTextField(field.field).setText(field.value)
  //           }
  //         }
  //         if (field.type == 'checkbox') {
  //           if (field.value) {
  //             form2.getCheckBox(field.field).check()
  //           }
  //         }
  //       }

  //       for (let field of this.fieldMap3[i]) {
  //         if (field.type == 'text') {
  //           if (field.value) {
  //             form2.getTextField(field.field).setText(field.value)
  //           }
  //         }
  //         if (field.type == 'checkbox') {
  //           if (field.value) {
  //             form2.getCheckBox(field.field).check()
  //           }
  //         }
  //       }
  //     }

  //     if (i == 1) {
  //       for (let field of this.fieldMap2[i]) {
  //         if (field.type == 'text') {
  //           if (field.value) {
  //             form3.getTextField(field.field).setText(field.value)
  //           }
  //         }
  //         if (field.type == 'checkbox') {
  //           if (field.value) {
  //             form3.getCheckBox(field.field).check()
  //           }
  //         }
  //       }

  //       for (let field of this.fieldMap3[i]) {
  //         if (field.type == 'text') {
  //           if (field.value) {
  //             form3.getTextField(field.field).setText(field.value)
  //           }
  //         }
  //         if (field.type == 'checkbox') {
  //           if (field.value) {
  //             form3.getCheckBox(field.field).check()
  //           }
  //         }
  //       }
  //     }

  //     if (i == 2) {
  //       for (let field of this.fieldMap2[i]) {
  //         if (field.type == 'text') {
  //           if (field.value) {
  //             form4.getTextField(field.field).setText(field.value)
  //           }
  //         }
  //         if (field.type == 'checkbox') {
  //           if (field.value) {
  //             form4.getCheckBox(field.field).check()
  //           }
  //         }
  //       }

  //       for (let field of this.fieldMap3[i]) {
  //         if (field.type == 'text') {
  //           if (field.value) {
  //             form4.getTextField(field.field).setText(field.value)
  //           }
  //         }
  //         if (field.type == 'checkbox') {
  //           if (field.value) {
  //             form4.getCheckBox(field.field).check()
  //           }
  //         }
  //       }
  //     }

  //     if (i == 3) {
  //       for (let field of this.fieldMap2[i]) {
  //         if (field.type == 'text') {
  //           if (field.value) {
  //             form5.getTextField(field.field).setText(field.value)
  //           }
  //         }
  //         if (field.type == 'checkbox') {
  //           if (field.value) {
  //             form5.getCheckBox(field.field).check()
  //           }
  //         }
  //       }

  //       for (let field of this.fieldMap3[i]) {
  //         if (field.type == 'text') {
  //           if (field.value) {
  //             form5.getTextField(field.field).setText(field.value)
  //           }
  //         }
  //         if (field.type == 'checkbox') {
  //           if (field.value) {
  //             form5.getCheckBox(field.field).check()
  //           }
  //         }
  //       }
  //     }


  //   }



  //   if (this.basicInfo.IS_MINOR) {
  //     let gName: string[] = this.splitName(this.basicInfo.GUARDIAN_NAME);
  //     if (gName.length == 3) {
  //       form.getTextField('G_FIRST_NAME').setText(gName[0]);
  //       form.getTextField('G_MIDDLE_NAME').setText(gName[1]);
  //       form.getTextField('G_LAST_NAME').setText(gName[2]);
  //     }
  //     else if (gName.length == 4) {
  //       form.getTextField('TITLE').setText(gName[0]);
  //       form.getTextField('G_FIRST_NAME').setText(gName[1]);
  //       form.getTextField('G_MIDDLE_NAME').setText(gName[2]);
  //       form.getTextField('G_LAST_NAME').setText(gName[3]);
  //     }

  //     if (this.basicInfo.MINOR_DOB) {
  //       let dob = this.splitDate(this.basicInfo.MINOR_DOB);
  //       form.getTextField('D11').setText(dob[0]);
  //       form.getTextField('D12').setText(dob[1]);
  //       form.getTextField('D13').setText(dob[2]);
  //       form.getTextField('D14').setText(dob[3]);
  //       form.getTextField('D15').setText(dob[4]);
  //       form.getTextField('D16').setText(dob[5]);
  //       form.getTextField('D17').setText(dob[6]);
  //       form.getTextField('D18').setText(dob[7]);
  //     }
  //     if (this.basicInfo.GUARDIAN_DOB) {
  //       let dob = this.splitDate(this.basicInfo.GUARDIAN_DOB);
  //       form.getTextField('D21').setText(dob[0]);
  //       form.getTextField('D22').setText(dob[1]);
  //       form.getTextField('D23').setText(dob[2]);
  //       form.getTextField('D24').setText(dob[3]);
  //       form.getTextField('D25').setText(dob[4]);
  //       form.getTextField('D26').setText(dob[5]);
  //       form.getTextField('D27').setText(dob[6]);
  //       form.getTextField('D28').setText(dob[7]);
  //     }
  //     if (this.basicInfo.RELATION_WITH_MINOR == 'F') {
  //       form.getCheckBox('Check Box3').check();
  //     }
  //     else if (this.basicInfo.RELATION_WITH_MINOR == 'M') {
  //       form.getCheckBox('Check Box4').check();
  //     }
  //     else if (this.basicInfo.RELATION_WITH_MINOR == 'C') {
  //       form.getCheckBox('Check Box5').check();
  //     }
  //     else if (this.basicInfo.RELATION_WITH_MINOR == 'O') {
  //       form.getCheckBox('Check Box6').check();
  //     }



  //   }
  //   if (this.basicInfo.IS_INTRODUCED) {
  //     form.getCheckBox('Check Box34').check();
  //     if (this.basicInfo.E_CUSTOMER_NAME) {
  //       let exName: string[] = this.splitName(this.basicInfo.E_CUSTOMER_NAME);
  //       if (exName.length > 2) {
  //         form.getTextField('I_FIRST_NAME').setText(exName[0]);
  //         form.getTextField('I_MIDDLE_NAME').setText(exName[1]);
  //         form.getTextField('I_LAST_NAME').setText(exName[2]);
  //       }
  //     }
  //     if (this.basicInfo.E_CUSTOMER_ID) {
  //       let costomer_id: string[] = this.splitInBlock(this.basicInfo.E_CUSTOMER_ID);
  //       if (costomer_id.length <= 10) {
  //         for (let i = 0; i < costomer_id.length; i++) {
  //           form.getTextField('I' + (i + 1).toString()).setText(costomer_id[i]);
  //         }
  //       }
  //     }
  //     if (this.basicInfo.E_ACCOUNT_NUMBER) {
  //       let account_no: string[] = this.splitInBlock(this.basicInfo.E_ACCOUNT_NUMBER);
  //       if (account_no.length <= 16) {
  //         for (let i = 0; i < account_no.length; i++) {
  //           form.getTextField('A1' + (i + 1).toString()).setText(account_no[i]);

  //         }
  //       }
  //     }
  //     if (this.basicInfo.E_YEARS) {
  //       form.getTextField('I_YEARS').setText(this.basicInfo.E_YEARS.toString())
  //     }
  //   }

  //   if (this.basicInfo.ACCOUNT_TYPE) {
  //     if (this.basicInfo.ACCOUNT_TYPE == 'S') {
  //       form.getCheckBox('Check Box2').check();
  //     }
  //     else if (this.basicInfo.ACCOUNT_TYPE == 'F') {
  //       form.getCheckBox('Check Box49').check();
  //     }
  //     else if (this.basicInfo.ACCOUNT_TYPE == 'R') {
  //       form.getCheckBox('Check Box50').check();
  //     }
  //     else if (this.basicInfo.ACCOUNT_TYPE == 'P') {
  //       form.getCheckBox('Check Box51').check();
  //     }
  //   }

  //   if (this.depositInfo.DEPOSIT_AMOUNT) {
  //     let deposit_amount: string[] = this.splitInBlock(this.depositInfo.DEPOSIT_AMOUNT.toString());
  //     if (deposit_amount.length <= 10) {
  //       for (let i = 0; i < deposit_amount.length; i++) {
  //         form.getTextField('DA' + (i + 1).toString()).setText(deposit_amount[i]);
  //       }
  //     }
  //   }

  //   if (this.depositInfo.RATE_OF_INTEREST) {
  //     form.getTextField('RATE_OF_INTEREST').setText(this.depositInfo.RATE_OF_INTEREST.toString());
  //   }

  //   if (this.depositInfo.TANURE_DAYS) {
  //     form.getTextField('T_DAYS').setText(this.depositInfo.TANURE_DAYS.toString());
  //   }
  //   if (this.depositInfo.TANURE_MONTHS) {
  //     form.getTextField('T_MONTHS').setText(this.depositInfo.TANURE_MONTHS.toString());
  //   }
  //   if (this.depositInfo.TANURE_YEARS) {
  //     form.getTextField('T_YEARS').setText(this.depositInfo.TANURE_YEARS.toString());
  //   }

  //   if (this.depositInfo.DEPOSIT_ACCOUNT_NUMBER) {
  //     let d_account = this.splitInBlock(this.depositInfo.DEPOSIT_ACCOUNT_NUMBER);
  //     if (d_account.length <= 16) {
  //       for (let i = 0; i < d_account.length; i++) {
  //         form.getTextField('ACC' + (i + 1).toString()).setText(d_account[i]);
  //       }
  //     }
  //   }


  //   if (this.depositInfo.DEPOSIT_BANK_NAME) {
  //     let d_account = this.splitInBlock(this.depositInfo.DEPOSIT_BANK_NAME);
  //     if (d_account.length <= 25) {
  //       for (let i = 0; i < d_account.length; i++) {
  //         form.getTextField('B_NAME' + (i + 1).toString()).setText(d_account[i]);
  //       }
  //     }
  //   }

  //   if (this.depositInfo.DEPOSIT_BRANCH_NAME) {
  //     let d_account = this.splitInBlock(this.depositInfo.DEPOSIT_BRANCH_NAME);
  //     if (d_account.length <= 25) {
  //       for (let i = 0; i < d_account.length; i++) {
  //         form.getTextField('BR_NAME' + (i + 1).toString()).setText(d_account[i]);
  //       }
  //     }
  //   }
  //   if (this.depositInfo.DEPOSIT_IFSC_CODE) {
  //     let d_account = this.splitInBlock(this.depositInfo.DEPOSIT_IFSC_CODE);
  //     if (d_account.length <= 11) {
  //       for (let i = 0; i < d_account.length; i++) {
  //         form.getTextField('IFSC' + (i + 1).toString()).setText(d_account[i]);
  //       }
  //     }
  //   }



  //   if (this.nominationInfo.IS_MINOR) {
  //     // form.getCheckBox('Check Box32').check();

  //     if (this.nominationInfo.DOB) {
  //       let dob = this.splitDate(this.nominationInfo.DOB);
  //       if (dob.length <= 8) {
  //         for (let i = 0; i < dob.length; i++) {
  //           form.getTextField('D' + (i + 31).toString()).setText(dob[i]);
  //         }
  //       }
  //     }

  //     if (this.nominationInfo.APONITED_NAME) {
  //       form.getTextField('ADDRESS_LINE_1').setText(this.nominationInfo.APONITED_NAME);
  //     }
  //     if (this.nominationInfo.APONITED_ADDRESS) {
  //       form.getTextField('ADDRESS_LINE_2').setText(this.nominationInfo.APONITED_ADDRESS);
  //     }
  //   }
  //   if (this.nominationInfo.RELATION) {
  //     form.getTextField('RELATION_WTH_APPLICANT').setText(this.nominationInfo.RELATION);
  //   }
  //   if (this.nominationInfo.NOMINEE_NAME) {
  //     form.getTextField('NOMINEE_ADDRESS_LINE_1').setText(this.nominationInfo.NOMINEE_NAME);
  //   }
  //   if (this.nominationInfo.NOMINEE_ADDRESS) {
  //     form.getTextField('NOMINEE_ADDRESS_LINE_2').setText(this.nominationInfo.NOMINEE_ADDRESS);
  //   }

  //   if (this.serviceInfo.CHEQUE_BOOK) {
  //     form.getCheckBox('Check Box42').check();
  //   }
  //   if (this.serviceInfo.PASS_BOOK) {
  //     form.getCheckBox('Check Box43').check();
  //   }
  //   if (this.serviceInfo.SMS_ALERT) {
  //     form.getCheckBox('Check Box46').check();
  //   }
  //   if (this.serviceInfo.STATEMENT_BY_EMAIL) {
  //     form.getCheckBox('Check Box44').check();
  //   }
  //   if (this.serviceInfo.CONSENT_NEW_PRODUCT) {
  //     form.getCheckBox('Check Box45').check();
  //   }

  //   if (this.serviceInfo.ATM_CARD) {
  //     form.getCheckBox('Check Box47').check();
  //     if (this.serviceInfo.APPLICANT1_NAME) {
  //       let app_name = this.splitInBlock(this.serviceInfo.APPLICANT1_NAME);
  //       if (app_name.length <= 20) {
  //         for (let i = 0; i < app_name.length; i++) {
  //           form.getTextField('AP1' + (i + 1).toString()).setText(app_name[i]);
  //         }
  //       }
  //     }

  //     if (this.serviceInfo.ADDON_CARD) {
  //       form.getCheckBox('Check Box48').check();
  //       if (this.serviceInfo.APPLICANT2_NAME) {
  //         let app_name = this.splitInBlock(this.serviceInfo.APPLICANT2_NAME);
  //         if (app_name.length <= 20) {
  //           for (let i = 0; i < app_name.length; i++) {
  //             form.getTextField('AP2' + (i + 1).toString()).setText(app_name[i]);
  //           }
  //         }
  //       }

  //       if (this.serviceInfo.APPLICANT3_NAME) {
  //         let app_name = this.splitInBlock(this.serviceInfo.APPLICANT3_NAME);
  //         if (app_name.length <= 20) {
  //           for (let i = 0; i < app_name.length; i++) {
  //             form.getTextField('AP3' + (i + 1).toString()).setText(app_name[i]);
  //           }
  //         }
  //       }

  //       if (this.serviceInfo.APPLICANT4_NAME) {
  //         let app_name = this.splitInBlock(this.serviceInfo.APPLICANT4_NAME);
  //         if (app_name.length <= 20) {
  //           for (let i = 0; i < app_name.length; i++) {
  //             form.getTextField('AP4' + (i + 1).toString()).setText(app_name[i]);
  //           }
  //         }
  //       }

  //     }

  //   }

  //   if (this.depositInfo.INTEREST_PAYOUT == 'M') {
  //     form.getCheckBox('Check Box19').check();
  //   }
  //   else if (this.depositInfo.INTEREST_PAYOUT == 'Q') {
  //     form.getCheckBox('Check Box20').check();
  //   }
  //   else if (this.depositInfo.INTEREST_PAYOUT == 'H') {
  //     form.getCheckBox('Check Box21').check();
  //   }
  //   else if (this.depositInfo.INTEREST_PAYOUT == 'Y') {
  //     form.getCheckBox('Check Box22').check();
  //   }
  //   else if (this.depositInfo.INTEREST_PAYOUT == 'O') {
  //     form.getCheckBox('Check Box23').check();
  //   }



  //   if (this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'S') {
  //     form.getCheckBox('Check Box25').check();
  //   }
  //   else if (this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'E') {
  //     form.getCheckBox('Check Box26').check();
  //   }
  //   else if (this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'P') {
  //     form.getCheckBox('Check Box27').check();
  //   }
  //   else if (this.depositInfo.MODE_OF_INTEREST_PAYOUT == 'O') {
  //     form.getCheckBox('Check Box24').check();
  //   }


  //   if (this.depositInfo.AUTO_RENEWAL) {
  //     form.getCheckBox('Check Box28').check();
  //   }


  //   if (this.depositInfo.TDS == 'T') {
  //     form.getCheckBox('Check Box30').check();
  //   }
  //   else if (this.depositInfo.TDS == 'N') {
  //     form.getCheckBox('Check Box31').check();
  //   }

  //   form.flatten();

  //   form2.flatten();

  //   if (this.ApplicantPersonal.length >= 2) {
  //     form3.flatten();
  //   }

  //   if (this.ApplicantPersonal.length >= 3) {
  //     form4.flatten();
  //   }

  //   if (this.ApplicantPersonal.length >= 4) {
  //     form5.flatten();
  //   }


  //   const firstPage = await this.MergedPdf.copyPages(this.pdfDoc, this.pdfDoc.getPageIndices());
  //   firstPage.forEach((page: any) => this.MergedPdf.addPage(page));

  //   const secondPage = await this.MergedPdf.copyPages(this.pdfDoc2, this.pdfDoc2.getPageIndices());
  //   secondPage.forEach((page: any) => this.MergedPdf.addPage(page));


  //   if (this.ApplicantPersonal.length >= 2) {
  //     const ThirdPage = await this.MergedPdf.copyPages(this.pdfDoc3, this.pdfDoc3.getPageIndices());
  //     ThirdPage.forEach((page: any) => this.MergedPdf.addPage(page));
  //   }

  //   if (this.ApplicantPersonal.length >= 3) {
  //     const forthPage = await this.MergedPdf.copyPages(this.pdfDoc4, this.pdfDoc4.getPageIndices());
  //     forthPage.forEach((page: any) => this.MergedPdf.addPage(page));
  //   }

  //   if (this.ApplicantPersonal.length >= 4) {
  //     const fifthPage = await this.MergedPdf.copyPages(this.pdfDoc5, this.pdfDoc5.getPageIndices());
  //     fifthPage.forEach((page: any) => this.MergedPdf.addPage(page));
  //   }





  //   // this.pdfByte2 = await this.pdfDoc2.save();
  //   // this.pdfByte = await this.pdfDoc.save()

  //   this.pdfByte = await this.MergedPdf.save();

  //   this.showPdf = true;
  // }