import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AadhaarMeta } from '../models/aadhaar';
import { PanMeta } from '../models/pan-meta';
import { Observable } from 'rxjs';

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
