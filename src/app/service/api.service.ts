import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, from, observable, of, switchMap, tap } from 'rxjs';
import { AadhaarMeta, Aadhaar_History, License_History, Pan_History, Voter_History, } from '../models/aadhaar';
import { Facilities } from '../models/facilities';
import { NomineeDetails } from '../models/nominee-details';
import { PanMeta } from '../models/pan-meta';
import { BasicInfo } from '../models/basicInfo';
import { TermDeposite } from '../models/term-deposite';
import { ImageData } from '../models/image-data';
import { PersonalInfo } from '../models/personal-info';
import { Financial } from '../models/financial';
// import { keyframes } from '@angular/animations';
import { Property } from '../models/property';
import { LoanInfo } from '../models/loan-info';
import { OtherBankAccount } from '../models/other-bank-account';
import * as Forge from 'node-forge';
import { Buffer } from 'buffer';
import { ExtraInfo } from '../models/extra-info';
import { Documents } from '../models/documents';
import { RemarkModel } from '../models/remark-model';

@Injectable({
  providedIn: 'root'
})
export class ApiService implements HttpInterceptor {



  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.encryptWithPublicKey(req)).pipe(
      switchMap((data: any) => {
        console.log("data of", data)
        return next.handle(data);
      }),
      // switchMap((event) =>  {
      //   from(this.decryptData(event))
      // }

      // )

      tap({
        next: (event) => {
          // if (event instanceof HttpResponse) {

          window.alert('Unauthorized access!')

          // }
          return event;
        }
      })

    );
  }


  constructor(private httpClient: HttpClient) { }


  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders
  };



  public_key = `-----BEGIN PUBLIC KEY-----
    MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgG/GWS49Yu332ZM+juJyk0pLQ2gd
    Sy/wJPA1rboqsrgRJN2VU4DZRp59ij4q59BF2ylkvCL198P+2Wbilxjw1bN8wL7Y
    KW2MimBm3bYJWqltsj2vQkbRyDxMVEtT3K1OFRW0vJbzcCybrlbnbo8EfPrnSYTU
    3t1j/cNlQ1EGDKOZAgMBAAE=
    -----END PUBLIC KEY-----`


  private_key = `-----BEGIN RSA PRIVATE KEY-----
    MIICWwIBAAKBgG/GWS49Yu332ZM+juJyk0pLQ2gdSy/wJPA1rboqsrgRJN2VU4DZ
    Rp59ij4q59BF2ylkvCL198P+2Wbilxjw1bN8wL7YKW2MimBm3bYJWqltsj2vQkbR
    yDxMVEtT3K1OFRW0vJbzcCybrlbnbo8EfPrnSYTU3t1j/cNlQ1EGDKOZAgMBAAEC
    gYBSK5vWHXTEAqgl0iCSoq5bOLdGK/rhNAbDvIKJ0Ofv31KdvzBTEegTjbD6gOpI
    N4KljJOuk+pgYNMMCtoPkMVYo8jtMhI+joXThoHPLf05r8h4zTs34hmP1oBRHR7z
    tEVBXP9jXMV4qz6Q2LeMOac74SeIgfoMVbCRQsrGi9FKgQJBALSK+AnWJEKXq8SC
    TqFvwjJQC2PPkB+5msyHHWXivVVc6w3egSzv6SsMCl3SHWVKJlWIjQxM6NthcKl7
    RGiluekCQQCefZl58b99Q5UYwaM/cpte7h/289Inc6APFcJBDuJbbcjcSR+8xdos
    5WBYRz9H0Lf9vlhGNexlDDtATObAvN4xAkBJlYZow+29coHgsteHdrxoszUhNhzg
    wU41ZDB4MUTHwPpQicqOXS3kjKDBAn1WpjUfkWsjg0k4+OrpOMN1/23ZAkByTh98
    pW/3xeAoRK+aOOv5oUAIeXzd2zRa7NR222dBjYJJ7asoGIHr01qTEH+BKfUo2jkM
    GiPuFM4+57ec1hphAkEAqjRHnKDnftiQ5wfiCXE7D+vkKSpyELLvU0linbg7fb4f
    UiYQg0JCBTJ1a/UcCWnjq4r1HleBDLU61QaEet3gFQ==
    -----END RSA PRIVATE KEY-----`

  server_publickey = `-----BEGIN PUBLIC KEY-----
    MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHUIkAuBQw3+C3lTgsQWwBR0VLQq
    hH7dCjj0ssnb976CGQPIelbamC51Ap1HtPZv/fWbHqPkGFjFnhJoVBi/y7YaCChQ
    71GbAZte8gO1Hd1/QlD9kj87HOhVPxxrbVkA6ja8L1cyVzKwO9CTn/I0qftJa2d/
    Gtn+xtdDWM9Jw3Q1AgMBAAE=
    -----END PUBLIC KEY-----`

  httpHeaderMain = new HttpHeaders(
    {
      'APIKEY': 'prasad',
      'SUPPORTKEY': 'hejUJJSK99gg',
      'TOKEN': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IlVTRVJfSUQiOjkwfSwiaWF0IjoxNjc2ODk1MzgzfQ.V80hoP9N4BRhC-hqrVtLz45hWTVWZrZR5FZD34YcLZE',

    });


  encryptWithPublicKey(valueToEncrypt: any): string {
    const rsa = Forge.pki.publicKeyFromPem(this.server_publickey);
    return window.btoa(rsa.encrypt(valueToEncrypt.toString()));
  }


  optionMain = {
    headers: this.httpHeaderMain
  }



  genAadhaarOtpUrl = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/generate-otp";
  getAadhaarDataUrl = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/submit-otp ";
  verifyPanUrl = "https://kyc-api.aadhaarkyc.io/api/v1/pan/pan";
  // aadhaarBaseUrl = "http://aadharverifybackend.kredpool.in/api/addhar/";

  // baseUrl = 'https://accountopening.kredpool.in/api/';

  // baseUrl local
  baseUrl = 'http://localhost:8079/api/';

  decryptData(data: any) {
    console.log("data in decryption", data.data)
    let data_ = Buffer.from(data.data, 'base64').toString();
    // let data_ = data;
    const rsa = Forge.pki.privateKeyFromPem(this.private_key);
    console.log("data_", data_)
    let data_2 = JSON.parse(rsa.decrypt(data_));
    console.log("data_2", data_2)
    return data_2;

  }


  login(username: string, password: string): Observable<any> {

    let data = {
      USER_NAME: username,
      PASSWORD: password
    }

    return this.httpClient.post(this.baseUrl + "user/login", data, this.optionMain);
  }





  //personal
  addBasic(data: BasicInfo): Observable<any> {
    return this.httpClient.post(this.baseUrl + "basicDetails/create", data, this.optionMain)
  }

  updateBasic(data: BasicInfo): Observable<any> {
    data.ROLE_ID = Number(sessionStorage.getItem('ROLE_ID'));
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

  getDraft(pageSize: number, pageIndex: number, user_data: any): Observable<any> {
    let data = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      user_details: user_data
    }
    return this.httpClient.post(this.baseUrl + 'basicDetails/getAll', data, this.optionMain);
  }
  // aadhaar

  // GetAllAadhaarData(): Observable<any> {
  //   return this.httpClient.get(this.aadhaarBaseUrl + "get", this.options)
  // }

  // PostAadharData(data: any): Observable<any> {
  //   return this.httpClient.post<any>(this.aadhaarBaseUrl + "create", data)
  // }


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


  getSideMenu(role_id: any) {
    let data = {
      ROLE_ID: role_id
    }

    return this.httpClient.post<any>(this.baseUrl + 'componunts/getComponunts', data, this.optionMain)
  }

  getUser(arg: { role_id?: number, branch_id?: number, user_id?: number }) {
    let data = {
      ROLE_ID: arg.role_id,
      BRANCH_ID: arg.branch_id,
      ID: arg.user_id
    }


    return this.httpClient.post<any>(this.baseUrl + 'user/getUser', data, this.optionMain);

  }

  getTabs(applicant_id: number, role_id: any, track_id: any) {
    let data = {
      APPLICANT_ID: applicant_id,
      ROLE_ID: role_id,
      TRACK_ID: track_id
    }

    return this.httpClient.post<any>(this.baseUrl + 'tabs/getTabs', data, this.optionMain);

  }

  updateTab(data: ExtraInfo) {


    return this.httpClient.post<any>(this.baseUrl + 'extraInformation/update', data, this.optionMain);
  }


  getDocument(applicant_id: number, applicant_no: number | null) {
    let data = {
      APPLICANT_ID: applicant_id,
      APPLICANT_NO: applicant_no
    }

    return this.httpClient.post<any>(this.baseUrl + 'applicantDocuments/getAllApplicants', data, this.optionMain);

  }
  createDocument(data: Documents) {

    return this.httpClient.post<any>(this.baseUrl + 'applicantDocuments/create', data, this.optionMain);

  }

  updateDocument(data: Documents) {

    return this.httpClient.post<any>(this.baseUrl + 'applicantDocuments/upload', data, this.optionMain);

  }

  updateSingleDocument(data: Documents) {

    return this.httpClient.post<any>(this.baseUrl + 'applicantDocuments/update', data, this.optionMain);

  }


  getEmailOtp(email: string) {
    let data = {
      EMAIL: email
    }

    return this.httpClient.post<any>(this.baseUrl + 'emailVerification/sendAndVerifyOtp', data, this.optionMain);
  }

  verifyEmail(otp: string, email: string) {
    let data = {
      EMAIL: email,
      OTP: otp
    }

    return this.httpClient.post<any>(this.baseUrl + 'emailVerification/verifyOtp', data, this.optionMain);

  }


  createAadhaarData(data: Aadhaar_History) {
    return this.httpClient.post<any>(this.baseUrl + 'aadhaar/create', data, this.optionMain);
  }

  getAadhaarData(applicant_no: number, aadhaar_no: string) {
    let data = {
      APPLICANT_NO: applicant_no,
      AADHAAR_NUMBER: aadhaar_no
    }

    return this.httpClient.post<any>(this.baseUrl + 'aadhaar/get', data, this.optionMain);
  }


  createPanData(data: Pan_History) {
    return this.httpClient.post<any>(this.baseUrl + 'pan/create', data, this.optionMain);
  }

  getPanData(applicant_no: number, pan_no: string) {
    let data = {
      APPLICANT_NO: applicant_no,
      PAN_NUMBER: pan_no
    }

    return this.httpClient.post<any>(this.baseUrl + 'pan/get', data, this.optionMain);
  }


  updatePanData(data: Pan_History) {
    return this.httpClient.post<any>(this.baseUrl + 'pan/update', data, this.optionMain);
  }

  //Address Api

  getState() {
    return this.httpClient.post<any>(this.baseUrl + 'pincode/getState', '', this.optionMain)
  }

  getDistrict(state_name: string) {
    let filter = {
      filter: state_name
    }
    return this.httpClient.post<any>(this.baseUrl + 'pincode/getDistrict', filter, this.optionMain)
  }

  getTaluka(district_name: string) {
    let filter = {
      filter: district_name
    }
    return this.httpClient.post<any>(this.baseUrl + 'pincode/getTaluka', filter, this.optionMain)
  }

  getVillage(taluka_name: string) {
    let filter = {
      filter: taluka_name
    }
    return this.httpClient.post<any>(this.baseUrl + 'pincode/getVillage', filter, this.optionMain)
  }

  // End Address Api

  // voter id and License api

  voterID_License_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY5Mzk4MjU0OSwianRpIjoiNjViMmQ1ODAtZTAyMC00NmU2LTgxYmYtZDUxNTEwZWZhOWI4IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmtyZWRwb29sQHN1cmVwYXNzLmlvIiwibmJmIjoxNjkzOTgyNTQ5LCJleHAiOjE2OTQ1ODczNDksInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ1c2VyIl19fQ.Dj97vyCTartwh7MEWIwCb54MJ_AqdyZDLa7c0ykIgA4';
  voterID_License_httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.voterID_License_token}`
  });
  voterID_License_options = {
    headers: this.voterID_License_httpHeaders
  };

  getVoterIDData(voter_id: string) {
    let data = {
      id_number: voter_id
    }

    return this.httpClient.post<any>("https://sandbox.surepass.io/api/v1/voter-id/voter-id", JSON.stringify(data), this.voterID_License_options);
  }

  getLicenseData(license_no: string, dob: string) {
    let data = {
      id_number: license_no,
      dob: dob
    }

    return this.httpClient.post<any>("https://sandbox.surepass.io/api/v1/driving-license/driving-license", JSON.stringify(data), this.voterID_License_options);
  }

  getPassportDetails(passportID: string) {
    let url = `https://sandbox.surepass.io/api/v1/passport/passport/${passportID}`

    return this.httpClient.get<any>(url, this.voterID_License_options);

  }

  createVoterHistory(Voter: Voter_History) {
    return this.httpClient.post<any>(this.baseUrl + 'voterId/create', Voter, this.optionMain);
  }

  getVoterHistory(voter_id: string) {
    let data = {
      EPIC_NO: voter_id
    }
    return this.httpClient.post<any>(this.baseUrl + 'voterId/get', data, this.optionMain);
  }

  updateVoterHistory(Voter: Voter_History) {
    return this.httpClient.post<any>(this.baseUrl + 'voterId/update', Voter, this.optionMain);
  }

  createLicenseHistory(License: License_History) {
    return this.httpClient.post<any>(this.baseUrl + 'license/create', License, this.optionMain);
  }

  getLicenseHistory(license_no: string) {
    let data = {
      LICENSE_NUMBER: license_no
    }
    return this.httpClient.post<any>(this.baseUrl + 'license/get', data, this.optionMain);
  }

  updateLicenseHistory(License: License_History) {
    return this.httpClient.post<any>(this.baseUrl + 'license/update', License, this.optionMain);

  }

  // End voter id and License api

  getStatusList() {
    return this.httpClient.post<any>(this.baseUrl + 'status/getList', '', this.optionMain)
  }

  getUserBranch(branch_id?: number) {
    let data = {
      BRANCH_ID: branch_id
    }
    return this.httpClient.post<any>(this.baseUrl + 'user/getUserBranch', data, this.optionMain);
  }

  getUserRole(role_id?: number) {
    let data = {
      ROLE_ID: role_id
    }
    return this.httpClient.post<any>(this.baseUrl + 'user/getUserRole', data, this.optionMain)
  }

  getAllRemark(applicant_id: number) {
    let data = {
      APPLICANT_ID: applicant_id
    }
    return this.httpClient.post<any>(this.baseUrl + 'remark/getAll', data, this.optionMain);
  }

  createRemark(data: RemarkModel) {

    return this.httpClient.post<any>(this.baseUrl + 'remark/create', data, this.optionMain);
  }

}
