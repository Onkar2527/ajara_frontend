import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AadhaarMeta, } from '../models/aadhaar';
import { Facilities } from '../models/facilities';
import { NomineeDetails } from '../models/nominee-details';
import { PanMeta } from '../models/pan-meta';
import { BasicInfo } from '../models/basicInfo';
import { TermDeposite } from '../models/term-deposite';
import { ImageData } from '../models/image-data';
import { PersonalInfo } from '../models/personal-info';
import { Financial } from '../models/financial';
import { keyframes } from '@angular/animations';
import { Property } from '../models/property';
import { LoanInfo } from '../models/loan-info';
import { OtherBankAccount } from '../models/other-bank-account';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders
  };

  httpHeaderMain = new HttpHeaders({ 'APIKEY': 'prasad', 'SUPPORTKEY': 'hejUJJSK99gg', 'TOKEN': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IlVTRVJfSUQiOjkwfSwiaWF0IjoxNjc2ODk1MzgzfQ.V80hoP9N4BRhC-hqrVtLz45hWTVWZrZR5FZD34YcLZE' });



  optionMain = {
    headers: this.httpHeaderMain
  }

  genAadhaarOtpUrl = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/generate-otp";
  getAadhaarDataUrl = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/submit-otp ";
  verifyPanUrl = "https://kyc-api.aadhaarkyc.io/api/v1/pan/pan";
  aadhaarBaseUrl = "http://aadharverifybackend.kredpool.in/api/addhar/";

  // baseUrl = 'https://accountopening.kredpool.in/api/';

  // baseUrl local
  baseUrl = 'http://192.168.1.9:8080/api/';


  login(username: string, password: string): Observable<any> {

    var data = {
      USER_NAME: username,
      PASSWORD: password
    }
    return this.httpClient.post('http://192.168.1.3:8080/' + "user/login", data, this.optionMain);
  }





  //personal
  addBasic(data: BasicInfo): Observable<any> {
    return this.httpClient.post(this.baseUrl + "basicDetails/create", data, this.optionMain)
  }

  updateBasic(data: BasicInfo): Observable<any> {
    return this.httpClient.post(this.baseUrl + "basicDetails/update", data, this.optionMain)
  }

  getBasic(key: any): Observable<any> {
    let data = {
      ID: key
    }
    return this.httpClient.post<any>(this.baseUrl + "basicDetails/get", data, this.optionMain)
  }

  //term deposit
  addDeposite(data: TermDeposite): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'termDeposite/create', data, this.optionMain);
  }

  updateDeposite(data: TermDeposite): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'termDeposite/update', data, this.optionMain);
  }

  getDeposite(key: any): Observable<any> {
    let data = {
      APPLICANT_ID: key
    }
    return this.httpClient.post<any>(this.baseUrl + 'termDeposite/get', data, this.optionMain);
  }

  //services
  addService(data: Facilities): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'facilities/create', data, this.optionMain);
  }

  updateService(data: Facilities): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'facilities/update', data, this.optionMain);
  }

  getService(key: any): Observable<any> {
    let data = {
      APPLICANT_ID: key
    }
    return this.httpClient.post<any>(this.baseUrl + 'facilities/get', data, this.optionMain);

  }

  //nominee
  addNominee(data: NomineeDetails): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'nomineeDetails/create', data, this.optionMain);
  }

  updateNominee(data: NomineeDetails): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'nomineeDetails/update', data, this.optionMain);
  }

  getNominee(key: any): Observable<any> {
    let data = {
      APPLICANT_ID: key
    }
    return this.httpClient.post<NomineeDetails>(this.baseUrl + 'nomineeDetails/get', data, this.optionMain);

  }


  // Applicant personal

  getAllAplicant(key: any): Observable<any> {
    let data = {
      APPLICANT_ID: key
    }
    return this.httpClient.post(this.baseUrl + 'personalInformation/get', data, this.optionMain)
  }

  updateAplicant(data: PersonalInfo): Observable<any> {

    return this.httpClient.post(this.baseUrl + 'personalInformation/update', data, this.optionMain)
  }

  // applicant Financial

  getAllFinancial(key: any): Observable<any> {
    let data = {
      APPLICANT_ID: key
    }
    return this.httpClient.post(this.baseUrl + 'financialInformation/get', data, this.optionMain);
  }

  getFinancial(applicant_id: any, applicant_no: any): Observable<any> {
    let data = {
      APPLICANT_ID: applicant_id,
      APPLICANT_NO: applicant_no
    }
    return this.httpClient.post(this.baseUrl + 'financialInformation/get', data, this.optionMain);
  }

  createFinancial(data: Financial): Observable<any> {

    return this.httpClient.post(this.baseUrl + 'financialInformation/create', data, this.optionMain);
  }

  updateFinancial(data: Financial): Observable<any> {

    return this.httpClient.post(this.baseUrl + 'financialInformation/update', data, this.optionMain);
  }

  // applicant Property
  getAllProperty(key: any): Observable<any> {
    let data = {
      APPLICANT_ID: key
    }
    return this.httpClient.post(this.baseUrl + 'propertyInformation/get', data, this.optionMain);
  }

  getProperty(applicant_id: any, applicant_no: any): Observable<any> {
    let data = {
      APPLICANT_ID: applicant_id,
      APPLICANT_NO: applicant_no
    }
    return this.httpClient.post(this.baseUrl + 'propertyInformation/get', data, this.optionMain);
  }

  createProperty(data: Property): Observable<any> {

    return this.httpClient.post(this.baseUrl + 'propertyInformation/create', data, this.optionMain);
  }

  updateProperty(data: Property): Observable<any> {

    return this.httpClient.post(this.baseUrl + 'propertyInformation/update', data, this.optionMain);
  }

  //applicant loanInfo

  getAllLoanInfo(key: any): Observable<any> {
    let data = {
      APPLICANT_ID: key
    }
    return this.httpClient.post(this.baseUrl + 'loanInformation/get', data, this.optionMain);
  }

  getLoanInfo(applicant_id: any, applicant_no: any): Observable<any> {
    let data = {
      APPLICANT_ID: applicant_id,
      APPLICANT_NO: applicant_no
    }
    return this.httpClient.post(this.baseUrl + 'loanInformation/get', data, this.optionMain);
  }

  createLoanInfo(data: LoanInfo): Observable<any> {

    return this.httpClient.post(this.baseUrl + 'loanInformation/create', data, this.optionMain);
  }

  updateLoanInfo(data: LoanInfo): Observable<any> {

    return this.httpClient.post(this.baseUrl + 'loanInformation/update', data, this.optionMain);
  }

  //applicant other Bank account

  getAllOtherAccount(key: any): Observable<any> {
    let data = {
      APPLICANT_ID: key
    }
    return this.httpClient.post(this.baseUrl + 'otherBankAccounts/get', data, this.optionMain);
  }

  getOtherAccount(applicant_id: any, applicant_no: any): Observable<any> {
    let data = {
      APPLICANT_ID: applicant_id,
      APPLICANT_NO: applicant_no
    }
    return this.httpClient.post(this.baseUrl + 'otherBankAccounts/get', data, this.optionMain);
  }

  createOtherAccount(data: OtherBankAccount): Observable<any> {

    return this.httpClient.post(this.baseUrl + 'otherBankAccounts/create', data, this.optionMain);
  }

  updateOtherAccount(data: OtherBankAccount): Observable<any> {

    return this.httpClient.post(this.baseUrl + 'otherBankAccounts/update', data, this.optionMain);
  }

  // wecam

  postImageFile(data: ImageData): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'applicantsPhoto/upload', data, this.optionMain);
  }

  getAllApplicantPhoto(key: any): Observable<any> {
    let data = {
      APPLICANT_ID: key
    }
    return this.httpClient.post(this.baseUrl + 'applicantsPhoto/getAllApplicants', data, this.optionMain);
  }

  //draft 

  getDraft(pageSize:number, pageIndex:number): Observable<any> {
    let data = {
      pageSize: pageSize,
      pageIndex: pageIndex
    }
    return this.httpClient.post(this.baseUrl + 'drafts/get', data, this.optionMain);
  }
  // aadhaar

  GetAllAadhaarData(): Observable<any> {
    return this.httpClient.get(this.aadhaarBaseUrl + "get", this.options)
  }

  PostAadharData(data: any): Observable<any> {
    return this.httpClient.post<any>(this.aadhaarBaseUrl + "create", data)
  }


  Aadhaar_GetOTP(data: AadhaarMeta): Observable<any> {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzNDMzNywianRpIjoiZDU1MGEwNzktZjYxYS00MWMzLTgxYjMtNWJmZjlkNWNlYzc4IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnRlY3Bvb2xAc3VyZXBhc3MuaW8iLCJuYmYiOjE2NTY5MzQzMzcsImV4cCI6MTk3MjI5NDMzNywidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbIndhbGxldCJdfX0.EsnCsWhjMNVUCXT3ehEUsbyGgoKhYxlOwegDHNfZedQ';
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    this.options = {
      headers: this.httpHeaders
    };
    return this.httpClient.post<any>(this.genAadhaarOtpUrl, JSON.stringify(data), this.options);
  }


  Pan_Verify(data: PanMeta): Observable<any> {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzNDMzNywianRpIjoiZDU1MGEwNzktZjYxYS00MWMzLTgxYjMtNWJmZjlkNWNlYzc4IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnRlY3Bvb2xAc3VyZXBhc3MuaW8iLCJuYmYiOjE2NTY5MzQzMzcsImV4cCI6MTk3MjI5NDMzNywidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbIndhbGxldCJdfX0.EsnCsWhjMNVUCXT3ehEUsbyGgoKhYxlOwegDHNfZedQ';
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    this.options = {
      headers: this.httpHeaders
    };
    return this.httpClient.post<any>(this.verifyPanUrl, JSON.stringify(data), this.options);
  }




  Aadhaar_GetData(data: AadhaarMeta): Observable<any> {

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzNDMzNywianRpIjoiZDU1MGEwNzktZjYxYS00MWMzLTgxYjMtNWJmZjlkNWNlYzc4IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnRlY3Bvb2xAc3VyZXBhc3MuaW8iLCJuYmYiOjE2NTY5MzQzMzcsImV4cCI6MTk3MjI5NDMzNywidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbIndhbGxldCJdfX0.EsnCsWhjMNVUCXT3ehEUsbyGgoKhYxlOwegDHNfZedQ';

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    this.options = {
      headers: this.httpHeaders
    };
    return this.httpClient.post<any>(this.getAadhaarDataUrl, JSON.stringify(data), this.options);
  }

}
