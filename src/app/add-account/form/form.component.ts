import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import { Facilities } from 'src/app/models/facilities';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { BasicInfo } from 'src/app/models/basicInfo';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';
import { PDFDocument } from 'pdf-lib';
import { PersonalInfo } from 'src/app/models/personal-info';
import { Financial } from 'src/app/models/financial';
import { Property } from 'src/app/models/property';
// import { LoanInfo } from 'src/app/models/loan-info';
// import { OtherBankAccount } from 'src/app/models/other-bank-account';
import { ImageData } from 'src/app/models/image-data';
const html2pdf = require('html2pdf.js');
import { HttpClient } from '@angular/common/http';
import { Documents } from 'src/app/models/documents';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {
  @Input() APPLICANT_ID!: number;

  @Output() pdfButtonLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  basicInfo: BasicInfo = new BasicInfo();
  depositInfo: TermDeposite = new TermDeposite();
  serviceInfo: Facilities = new Facilities();
  nominationInfo: NomineeDetails = new NomineeDetails();

  ApplicantPersonal: PersonalInfo[] = []
  ApplicantFinancial: Financial[] = []
  ApplicantProperty: Property[] = []
  // ApplicantLoanInfo: LoanInfo[] = []
  // ApplicantOtherBank: OtherBankAccount[] = []




  ApplicantPhoto: ImageData[] = [];
  documentData: Documents[] = [];

  branchData: any;

  makerUserData: any = {
    NAME: ''
  };
  checkerUserData: any = {
    NAME: ''
  };



  PHOTOS: any[] = [];

  account_type = {
    'A': 'Saving',
    'B': 'Janata Deposite',
    'C': 'Current Account',
    'D': 'Fixed Deposit',
    'E': 'Fixed Deposit (Reinvestment)',
    'F': "Recurring Deposit",
    'G': "Pigmy Deposit",
    'H': "Other"
  }

  religion = {
    "A": "Hindu",
    "B": "Muslim",
    "C": "Sikh",
    "D": "Christian",
    "E": "Buddist",
    "F": "Zoroastrian",
    "G": "Other"
  }

  caste = {
    "A": "General",
    "B": "OBC",
    "C": "SC",
    "D": "ST",
    "E": "NT",
    "F": "VJNT",
    "G": "Other"
  }


  education = {
    "S": "10th class",
    "H": "12th class",
    "D": "Degree",
    "G": "Graduate",
    "P": "Post Graduate",
    "O": "Other"
  }

  income = {
    "A": "Upto ₹60000",
    "B": "₹60001 to ₹120000",
    "C": "₹120001 to ₹240000",
    "D": "₹240001 to ₹360000",
    "E": "₹360001 to ₹600000",
    "F": "₹600001 to ₹1200000",
    "G": "₹1200001 to ₹1800000",
    "H": "Above ₹1800001",

  }

  residential_status = {
    "A": "Owned",
    "B": "Rented",
    "C": "Occupied"
  }

  relation = {
    'A': 'Father',
    'B': 'Mother',
    'C': 'Brother',
    'D': 'Sister',
    'E': 'Son',
    'F': 'Daughter',
    'G': 'Husband',
    'H': 'Wife',
  }
  account_operation = {
    "A": "Individual",
    "B": "Joint",
    "C": "Either or Survivor",
    "D": "Formar of Survivor",
    "E": "Any One",
    "F": "Any Two"
  }

  interest_payout = {
    "M": "Monthly",
    "Q": "Quarterly",
    "H": "Half Yearly",
    "Y": "Yearly",
    "O": "On Maturity"
  }

  work = {
    "E": "Employee",
    "S": "Self Employeed",
    "B": "Business",
    "R": "Retired",
    "T": "Student",
    "H": "House Wife",
    "O": "Other"
  }

  employee = {
    "P": "Public Company",
    "E": "Private Company",
    "C": "Centeral/State Goverment",
    "M": "Multi-Purpose Company",
    "J": "Private Job",
    "O": "Other",
    " ": "None"
  }

  proprieter = {
    "C": "CA",
    "D": "Doctor",
    "A": "Advisor",
    "T": "Trader",
    "E": "Engineer",
    "V": "Advocate",
    "S": "Software",
    "O": "Other",
    " ": "None"
  }

  customer_type = {
    "A": "Mr.",
    "B": "Mrs.",
    "C": "Miss.",
    "D": "Mast.",
    "E": "Smt.",
    "F": "M/s.",
    "G": "Mx."
  }

  risk_type = {
    "A": "High Risk 1",
    "B": "Medium Risk 2",
    "C": "Low Risk 3",
  }

  gender = {
    'M': "Male",
    'F': "Female",
    'T': "Transgender"
  }


  profession = {
    'A': 'Employee',
    'B': 'Self Employeed',
    'C': 'Business',
    'D': 'Retired',
    'E': 'Student',
    'F': 'House Wife',
    'G': 'Other',
    ' ': ' '
  };


  nature_of_service = {
    'A': 'Central/State Government',
    'B': 'Private Company',
    ' ': ' '
  };

  self_employed = {
    'A': 'CA',
    'B': 'Doctor',
    'C': 'Advisor',
    'D': 'Trader',
    'E': 'Engineer',
    'F': 'Advocate',
    'G': 'Software',
    'H': 'Other',
    ' ': ' '
  };

  nature_of_business = {
    'A': 'Agriculture',
    'B': 'Trader',
    'C': 'Manufacture',
    'D': 'Retailer',
    'E': 'Wholesaler',
    'F': 'Businessman',
    ' ': ' '
  };

  source_of_fund = {
    'A': 'Business income',
    'B': 'Commission Income',
    'C': 'Salary Income',
    'D': 'Rent Income',
    'E': 'Agri Income',
    'F': 'Pension Income',
    'G': 'Family Income',
    ' ': 'None'
  };

  consent_options = {
    "A": "Yes",
    "B": "No",
    "C": "Not Applicable"
  }

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    if (this.APPLICANT_ID) {
      this.getAllData();
      this.convertImageUrlToBase64();
    }
  }
  ngAfterViewInit(): void {

  }


  MASTERS = [
    { id: 2, data: <any>[], name: "title", valueField: "", lableField: "" },
    { id: 3, data: <any>[], name: "occupation", valueField: "OCCUPATIONID", lableField: "OCCUPATIONDESC" },
    { id: 4, data: <any>[], name: "address proof", valueField: "ADDPROOFID", lableField: "ADDPROOFDESC" },
    { id: 5, data: <any>[], name: "id proof", valueField: "IDTPROOFID", lableField: "IDTPROOFDESC" },
    { id: 6, data: <any>[], name: "risk category", valueField: "CAT_CODE", lableField: "CAT_DESC" },
    { id: 13, data: <any>[], name: "state", valueField: "ID", lableField: "STATEDESC" },
    { id: 14, data: <any>[], name: "district", valueField: "ID", lableField: "DISTRICTDESC" },
    { id: 15, data: <any>[], name: "taluka", valueField: "ID", lableField: "TALUKADESC" },
    { id: 16, data: <any>[], name: "city", valueField: "ID", lableField: "CITYDESC" },
    { id: 17, data: <any>[], name: "area", valueField: "ID", lableField: "AREADESC" },
    { id: 18, data: <any>[], name: "scheme", valueField: "", lableField: "" },
    { id: 19, data: <any>[], name: "constitution", valueField: "OWP_CODE", lableField: "OWP_DESC" },
    { id: 21, data: <any>[], name: "operation", valueField: "OPRINSTID", lableField: "OPRINSTDTLS" },
    { id: 22, data: <any>[], name: "payment instruction", valueField: "PAYINSTID", lableField: "PAYINSTDTLS" },
  ]


  async getMasters() {
    for (let i = 0; i < this.MASTERS.length; i++) {
      let result = await lastValueFrom(this.api.getMasters(this.MASTERS[i].id));

      if (result['code'] == 200 && result["data"].length > 0) {
        this.MASTERS[i].data = result['data'];
      }
    }

    this.mapMasters()

    console.log('MASTERS', this.MASTERS);

  }

  applicantPersonalMasterData = {
    occupation: "",
    address_proof: "",

    risk_cat: "",
    permanent_state: "",
    permanent_area: "",
    permanent_dist: "",
    permanent_taluka: "",
    permanent_city: "",

    current_state: "",
    current_area: "",
    current_dist: "",
    current_taluka: "",
    current_city: "",
    operation: ""

  }

  mapMasters() {
    this.assignValueFromMaster(this.filterValues(1, this.ApplicantPersonal[0].PROFESSION), "occupation");
    this.assignValueFromMaster(this.filterValues(5, Number(this.ApplicantPersonal[0].PERMANENT_STATE)), "permanent_state");
    this.assignValueFromMaster(this.filterValues(9, Number(this.ApplicantPersonal[0].PERMANENT_AREA)), "permanent_area");
    this.assignValueFromMaster(this.filterValues(6, Number(this.ApplicantPersonal[0].PERMANENT_DISTRICT)), "permanent_dist");
    this.assignValueFromMaster(this.filterValues(7, Number(this.ApplicantPersonal[0].PERMANENT_TALUKA)), "permanent_taluka");
    this.assignValueFromMaster(this.filterValues(8, Number(this.ApplicantPersonal[0].PERMANENT_CITY)), "permanent_city");

    this.assignValueFromMaster(this.filterValues(5, Number(this.ApplicantPersonal[0].CURRENT_STATE)), "current_state");
    this.assignValueFromMaster(this.filterValues(9, Number(this.ApplicantPersonal[0].CURRENT_AREA)), "current_area");
    this.assignValueFromMaster(this.filterValues(6, Number(this.ApplicantPersonal[0].CURRENT_DISTRICT)), "current_dist");
    this.assignValueFromMaster(this.filterValues(7, Number(this.ApplicantPersonal[0].CURRENT_TALUKA)), "current_taluka");
    this.assignValueFromMaster(this.filterValues(8, Number(this.ApplicantPersonal[0].CURRENT_CITY)), "current_city");

    this.assignValueFromMaster(this.filterValues(2, this.ApplicantPersonal[0].PERMANENT_ADDRESS_PROOF), "address_proof");

    this.assignValueFromMaster(this.filterValues(4, this.ApplicantPersonal[0].RISK_CATEGORY), "risk_cat");

    this.assignValueFromMaster(this.filterValues(12, this.depositInfo.ACCOUNT_OPERATION), "operation");

    console.log(this.applicantPersonalMasterData)
  }

  allowedTypes!: "operation" | "risk_cat" | "address_proof" | "occupation" | "permanent_state" | "permanent_area" | "permanent_dist" | "permanent_taluka" | "permanent_city" | "current_state" | "current_area" | "current_dist" | "current_taluka" | "current_city"

  assignValueFromMaster(res: any, label: typeof this.allowedTypes) {

    this.applicantPersonalMasterData[label] = res;
    console.log(res);

  }

  filterValues(index: any, pro_value: any) {
    let res = this.MASTERS[index].data.filter((value: any) => { return value[this.MASTERS[index].valueField] == pro_value });
    console.log(res, pro_value, this.MASTERS[index].data, this.MASTERS[index].valueField);
    if (res.length > 0) {
      return res[0][this.MASTERS[index].lableField];
    }
    else {
      return "";
    }
  }




  save() {
    const img = new Image();
    img.src = this.base64Image;
    img.onload = () => {
      this.generatePDF();
    };
    // this.generatePDF();
  }


  async getAllData() {
    let personal = this.getPersonal();
    let deposit = this.getDeposit();
    let service = this.getService();
    let nominee = this.getNominee();

    let applicantPersonal = this.getApplicantPersonal();
    let applicantFinancial = this.getApplicantFinancial();
    let applicantProperty = this.getApplicantProperty();
    // let applicantLoanInfo = this.getApplicantLoanInfo();
    // let applicantOtherAccount = this.getApplicantOtherAccount();
    let applicantPhoto = this.getApplicantPhoto();
    let applicantDocument = this.getDocuments();
    let count = 0;

    personal.subscribe({
      next: (res) => {
        if (res == 200) {

          count++;
          console.log("count in p", count);
          if (count >= 9) {

          }

        }
        else {
          // this.message.warning('Something went wrong! while getting Basic Information.', '');
        }
      },
      error: () => {
        // this.message.warning('Something went wrong! while getting Basic Information.', '');
      },
      complete: () => {

      }
    })

    let deposit_success = await lastValueFrom(deposit)
    if (deposit_success == 200) {

      count++;
      console.log("count in d", count);
      if (count >= 10) {
        //this.fillField()
        //this.fillPdf();
      }
    }

    let applicanP_success = await lastValueFrom(applicantPersonal)

    if (applicanP_success == 200) {

      count++;
      console.log("count in p", count);
      if (count >= 10) {
        //this.fillField()
        //this.fillPdf();
      }


    }


    this.getMasters();



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
          // this.message.warning('Nominee Information is not filled.', '');
        }
      },
      error: () => {
        // this.message.warning('Something went wrong! While getting nominee Information.', '');
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
          // this.message.warning('Information about required service is not filled.', '');
        }
      },
      error: () => {
        // this.message.warning('Something went wrong! while getting service information.', '');
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
          // this.message.warning('Applicant Financial Information is not Filled.', '');
        }
      },
      error: () => {
        // this.message.warning('Something went wrong! While getting Applicant Financial Information.', '');
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
          // this.message.warning('Applicant Property Information is not Filled.', '');
        }
      },
      error: () => {
        // this.message.warning('Something went wrong! While getting Applicant Property Information.', '');
      },
      complete: () => {

      }
    })

    // applicantLoanInfo.subscribe({
    //   next: (res2) => {
    //     if (res2 == 200) {

    //       count++;
    //       console.log("count in p", count);
    //       if (count >= 10) {
    //         //this.fillField()
    //         //this.fillPdf();
    //       }
    //     }
    //     else {
    //       // this.message.warning('Applicant Earlier Loan Information is not Filled.', '');
    //     }
    //   },
    //   error: () => {
    //     // this.message.warning('Something went wrong! While getting Applicant Earlier Loan Information.', '');
    //   },
    //   complete: () => {

    //   }
    // })

    // applicantOtherAccount.subscribe({
    //   next: (res2) => {
    //     if (res2 == 200) {

    //       count++;
    //       console.log("count in p", count);
    //       if (count >= 10) {
    //         //this.fillField()
    //         //this.fillPdf();
    //       }
    //     }
    //     else {
    //       // this.message.warning('Applicant Other Account Details is not Filled.', '');
    //     }
    //   },
    //   error: () => {
    //     // this.message.warning('Something went wrong! While getting Applicant Other Account Details.', '');
    //   },
    //   complete: () => {

    //   }
    // })

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
          // this.message.warning('Applicant Photo is not Uploaded.', '');
        }
      },
      error: () => {
        // this.message.warning('Something went wrong! While getting Applicant Photo.', '');
      },
      complete: () => {

      }
    })

    applicantDocument.subscribe({
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
          // this.message.warning('Something went wrong! while getting Document Information.', '');
        }
      },
      error: () => {
        // this.message.warning('Something went wrong! while getting Document Information.', '');
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
          this.getBranchData();
          this.getUserMaker();
          this.getUserChecker();
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
          this.changeCatagory();
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

  catagoryA = false;
  catagoryB = false;

  getAccountCatA() {
    let con = (['A', 'B', 'G', 'C', 'H'].indexOf(this.depositInfo.ACCOUNT_TYPE) + 1) ? true : false;

    this.catagoryA = con
  }

  getAccountCatB() {
    let con = (['D', 'E', 'F'].indexOf(this.depositInfo.ACCOUNT_TYPE) + 1) ? true : false;

    this.catagoryB = con
  }

  changeCatagory() {
    this.getAccountCatA();
    this.getAccountCatB();
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
          if (this.ApplicantPersonal.length < 2) {
            this.ApplicantPersonal.push(new PersonalInfo())
          }
          this.getOVD();
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

  // getApplicantLoanInfo() {
  //   let applicantLoanInfo: Subject<any> = new Subject();
  //   this.api.getAllLoanInfo(this.APPLICANT_ID).subscribe({
  //     next: (res) => {
  //       if (res['code'] == 200 && res['data'].length > 0) {
  //         this.ApplicantLoanInfo = res['data'];
  //         console.log("applicant property:", this.ApplicantLoanInfo);
  //         applicantLoanInfo.next(200);
  //       }
  //       else {
  //         applicantLoanInfo.next(res);
  //       }
  //     },
  //     error: (err) => {
  //       applicantLoanInfo.error(err);
  //     },
  //     complete: () => {
  //       applicantLoanInfo.complete();
  //     }
  //   });
  //   return applicantLoanInfo;
  // }

  // getApplicantOtherAccount() {
  //   let applicantOtherAccount: Subject<any> = new Subject();
  //   this.api.getAllOtherAccount(this.APPLICANT_ID).subscribe({
  //     next: (res) => {
  //       if (res['code'] == 200 && res['data'].length > 0) {
  //         this.ApplicantOtherBank = res['data'];
  //         console.log("applicant property:", this.ApplicantOtherBank);
  //         applicantOtherAccount.next(200);
  //       }
  //       else {
  //         applicantOtherAccount.next(res);
  //       }
  //     },
  //     error: (err) => {
  //       applicantOtherAccount.error(err);
  //     },
  //     complete: () => {
  //       applicantOtherAccount.complete();
  //     }
  //   });
  //   return applicantOtherAccount;
  // }

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

  getDocuments() {
    this.PHOTOS = [];
    let document: Subject<any> = new Subject();
    this.api.getDocument(this.APPLICANT_ID, null).subscribe({
      next: (res) => {
        if (200 == res.code && res.data.length > 0) {
          this.documentData = res.data;
          for (let document of this.documentData) {
            if (document.DOCUMENT_NAME == 'Applicant Photo') {
              this.PHOTOS.push(document.IMAGE_DATA)

            }
          }

          console.log("IMAGE DATA", this.PHOTOS)
          document.next(200)

        }

        else {
          document.next(res);
        }
      },
      error: err => {
        document.error(err)
      },

      complete: () => {
        document.complete()
      }
    })
    return document;

  }

  getBranchData() {
    this.api.getUserBranch(Number(this.basicInfo.CREATED_BRANCH_ID)).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.branchData = res['data'][0]
        }
      }
    })
  }

  getUserMaker() {
    this.api.getUser({ user_id: this.basicInfo.MAKER_USER_ID }).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.makerUserData = res['data'][0]
        }
      }
    })
  }

  getUserChecker() {
    if (this.basicInfo.CHACKER_USER_ID) {
      this.api.getUser({ user_id: this.basicInfo.CHACKER_USER_ID }).subscribe({
        next: (res) => {
          if (res['code'] == 200 && res['data'].length > 0) {
            this.checkerUserData = res['data'][0]
          }
        }
      })
    }

  }



  imageUrl = '../assets/Bank-Name-Shade.png';
  base64Image: string = '';

  convertImageUrlToBase64() {
    const img = new Image();
    img.src = this.imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        this.base64Image = canvas.toDataURL('image/svg');
      } else {
        console.error('Canvas context is null. Unable to draw the image.');
      }
      this.base64Image = canvas.toDataURL('image/svg');
    };
  }

  async generatePDF() {

    const mergedPdfDoc = await PDFDocument.create();
    //PDFDocument = pdfDocument
    let pngArray = [], jpegArray = [], pdfArray = [];

    pngArray = this.documentData.filter(Pn => "image/png" == Pn.FILE_TYPE);
    jpegArray = this.documentData.filter(Pn => ("image/jpeg" == Pn.FILE_TYPE || "image/jpg" == Pn.FILE_TYPE) && Pn.DOCUMENT_NAME != 'Applicant Photo');
    pdfArray = this.documentData.filter(Pn => "application/pdf" == Pn.FILE_TYPE && Pn.DOCUMENT_NAME != 'Applicant Photo');

    let totalImageArrayLength = pngArray.length + jpegArray.length,
      imagePages = new Array(Math.trunc(totalImageArrayLength / 6) + (totalImageArrayLength % 6 == 0 ? 0 : 1)),
      buffeeImageData = new Array(totalImageArrayLength),
      imageData = new Array(totalImageArrayLength),
      embededImageRef = new Array(totalImageArrayLength),
      index = 0;

    for (let Pn of pngArray) {
      imageData[index] = await fetch(Pn.IMAGE_DATA);
      buffeeImageData[index] = await imageData[index].arrayBuffer();
      embededImageRef[index] = await mergedPdfDoc.embedPng(buffeeImageData[index]);
      index++;
    };
    for (let Pn of jpegArray) {
      imageData[index] = await fetch(Pn.IMAGE_DATA);
      buffeeImageData[index] = await imageData[index].arrayBuffer();
      embededImageRef[index] = await mergedPdfDoc.embedJpg(buffeeImageData[index]);
      index++;
      console.log("images", embededImageRef)
    }



    let imageNo = 0;
    for (let i = 0; i < imagePages.length; i++) {
      imagePages[i] = mergedPdfDoc.addPage();

      let commonMargin = 15
      let imageWidth = Math.trunc(imagePages[i].getWidth() / 2) - commonMargin
      let imageHeight = Math.trunc(imagePages[i].getHeight() / 3) - 13

      for (let j = 0; j < 6; j++) {
        if (embededImageRef[j + imageNo]) {

          if (j == 0) {
            imagePages[i].drawImage(embededImageRef[j + imageNo],
              { x: 10, y: (2 * (Math.trunc(imagePages[i].getHeight() / 3))) + 5, width: imageWidth, height: imageHeight }
            );
          }
          else if (j == 1) {
            imagePages[i].drawImage(embededImageRef[j + imageNo],
              { x: Math.trunc(imagePages[i].getWidth() / 2) + 5, y: (2 * (Math.trunc(imagePages[i].getHeight() / 3))) + 5, width: imageWidth, height: imageHeight }
            );
          }
          else if (j == 2) {
            imagePages[i].drawImage(embededImageRef[j + imageNo],
              { x: 10, y: Math.trunc(imagePages[i].getHeight() / 3) + 7, width: imageWidth, height: imageHeight }
            );
          }
          else if (j == 3) {
            imagePages[i].drawImage(embededImageRef[j + imageNo],
              { x: Math.trunc(imagePages[i].getWidth() / 2) + 5, y: Math.trunc(imagePages[i].getHeight() / 3) + 7, width: imageWidth, height: imageHeight }
            );
          }
          else if (j == 4) {
            imagePages[i].drawImage(embededImageRef[j + imageNo],
              { x: 10, y: 10, width: imageWidth, height: imageHeight }
            );
          }
          else if (j == 5) {
            imagePages[i].drawImage(embededImageRef[j + imageNo],
              { x: Math.trunc(imagePages[i].getWidth() / 2) + 5, y: 10, width: imageWidth, height: imageHeight }
            );
          }

        }

      }

      imageNo += 6;

    };

    let pdfDataArray = new Array(pdfArray.length),
      pdfDataBuffer = new Array(pdfArray.length),
      pdfDataDoc = new Array(pdfArray.length),
      lt = 0

    for (let Pn of pdfArray) {
      pdfDataArray[lt] = await fetch(Pn.IMAGE_DATA);
      pdfDataBuffer[lt] = await pdfDataArray[lt].arrayBuffer();
      pdfDataDoc[lt] = await PDFDocument.load(pdfDataBuffer[lt]);
      lt++;
    }

    let pdfDoc = await PDFDocument.create();
    for (let Pn of pdfDataDoc) {
      (await pdfDoc.copyPages(Pn, Pn.getPageIndices())).forEach($mergedPdfDoc => pdfDoc.addPage($mergedPdfDoc))
    };

    let fetchedFormData, formDataArrayBuffer, ir,
      formHtmlRef = document.getElementById("contentToConvert"),
      formPdfData = "";

    let options = {
      margin: .3, image: { type: "jpeg", quality: .98 },
      html2canvas: { scale: 4 }, pagebreak: { after: [".page"] }, jsPDF: { unit: "in", format: "legal", orientation: "portrait" }
    }

    await html2pdf()
      .from(formHtmlRef)
      .set(options)
      .outputPdf()
      .then(function (Pn: any) {
        console.log(Pn), formPdfData = btoa(Pn)
      });

    let formPdfData_base64 = "data:application/pdf;base64," + formPdfData;

    console.log("base 64 ", formPdfData_base64);
    fetchedFormData = await fetch(formPdfData_base64);
    formDataArrayBuffer = await fetchedFormData.arrayBuffer();

    ir = await PDFDocument.load(formDataArrayBuffer);
    let pdfDoc2 = await PDFDocument.create();

    (await pdfDoc2.copyPages(ir, ir.getPageIndices())).forEach(Pn => pdfDoc2.addPage(Pn)), (await pdfDoc2.copyPages(mergedPdfDoc, mergedPdfDoc.getPageIndices())).forEach(Pn => pdfDoc2.addPage(Pn)), (await pdfDoc2.copyPages(pdfDoc, pdfDoc.getPageIndices())).forEach(Pn => pdfDoc2.addPage(Pn));

    let allMergedPDF = await pdfDoc2.save(),
      blob_AllMergedPDF = new Blob([allMergedPDF], { type: "application/pdf" }),
      finelPdf = URL.createObjectURL(blob_AllMergedPDF);

    let a = document.createElement("a");
    a.href = finelPdf;
    a.download = `${this.basicInfo.PRIMARY_APPLICANT_FIRST_NAME} ${this.basicInfo.PRIMARY_APPLICANT_MIDDLE_NAME} ${this.basicInfo.PRIMARY_APPLICANT_LAST_NAME} (${this.account_type[this.depositInfo.ACCOUNT_TYPE]}) (${this.basicInfo.ID})`;
    document.body.appendChild(a);;
    a.click();

    this.pdfButtonLoading.emit(!1)


  }

  OVD_1: any = '';
  OVD_2: any = '';
  OVD_3: any = '';
  OVD_4: any = '';

  OVD_DOCS = [
    { ID: 1, NAME: 'Aadhaar', SEQ: 1, KEY: 'AADHAAR_NUMBER' },
    { ID: 2, NAME: 'Driving License', SEQ: 2, KEY: 'DRIVING_LICENSE_NO' },
    { ID: 3, NAME: 'Voter ID', SEQ: 3, KEY: 'VOTER_ID' },
    { ID: 4, NAME: 'Passport', SEQ: 4, KEY: 'PASSPORT' },
  ]

  getOVD() {
    let sorted_OVD_arr = this.sortObjectArray(this.OVD_DOCS, 'SEQ')
    for (let applicant of this.ApplicantPersonal) {
      for (let doc of sorted_OVD_arr) {
        if (applicant[doc.KEY as keyof PersonalInfo]) {
          applicant['OVD_DOC'] = doc.NAME;
          applicant['OVD_DOC_NO'] = String(applicant[doc.KEY as keyof PersonalInfo]);
          break;
        }
      }
    }

    console.log("applicant personal", this.ApplicantPersonal);
  }

  sortObjectArray(src_array: any, sort_key: string) {
    let source = src_array;
    source.sort(function (a: any, b: any) {
      a[sort_key] - b[sort_key];
    })
    console.log("source array", source);
    return source;
  }

}
