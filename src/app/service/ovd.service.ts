import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AadhaarMeta } from '../models/aadhaar';
import { PanMeta } from '../models/pan-meta';
import { Observable } from 'rxjs';
import { TOKENS } from '../../environments/tokens';

@Injectable({
  providedIn: 'root'
})
export class OvdService {

  constructor(private httpClient: HttpClient) { }
  
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders
  };
  
  genAadhaarOtpUrl = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/generate-otp";
  getAadhaarDataUrl = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/submit-otp ";
  verifyPanUrl = "https://kyc-api.aadhaarkyc.io/api/v1/pan/pan";


  Aadhaar_GetOTP(data: AadhaarMeta): Observable<any> {
    const token = TOKENS.AADHAAR_TOKEN;
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
    const token = TOKENS.PAN_VERIFY_TOKEN;
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

    const token = TOKENS.AADHAAR_TOKEN;

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
