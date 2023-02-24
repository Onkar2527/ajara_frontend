import { ApiService } from "../service/api.service";
import { PanMeta } from "./pan-meta";
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { Subject } from "rxjs";

class Aadhaar_Data {
    dob: string = '';
    full_name: string = '';
    gender: string = '';
    address: AadhaarAddress = new AadhaarAddress();
    profile_image: string = '';
    age!: number;
    aadhaar_no: string = '';
  }
  
  class AadhaarAddress {
    dist: string = '';
    house: string = '';
    country: string = '';
    subdist: string = '';
    vtc: string = '';
    po: string = '';
    state: string = '';
    street: string = '';
    loc: string = '';
  }
  
  export class AadhaarMeta {
    id_number: string = '';
    client_id: string = '';
    otp_sent?: boolean;
    if_number?: boolean;
    otp: string = '';
  }

  export class CommonData {
    aadhaar_no: string = '';
    address: string = '';
    age !: number;
    dob: string = '';
    full_name: string = '';
    gender: string = ' ';
    profile_image: string = '';
  }

  export class Aadhaar {
    subject = new Subject();
    otpSubject = new Subject();
    constructor(private api: ApiService, private message: NzNotificationService) { }
    isok = false
    showOtp = false;
    showAadhaar: boolean = false;
    showPan: boolean = false;
    meta: AadhaarMeta = new AadhaarMeta();
    data: Aadhaar_Data = new Aadhaar_Data();
    meta1: PanMeta = new PanMeta();
    common: CommonData = new CommonData();
  
  
    getOTP() {
      this.api.Aadhaar_GetOTP(this.meta)
        .subscribe({next: (res) => {
          if (res['status_code'] == 200) {
            const RequestedData = res['data']
            // console.log(RequestedData);
            // console.log(this);
            this.meta.client_id = RequestedData["client_id"];
            this.message.success('OTP sent!', 'The unique otp has been sent to user\'s registered mobile number');
            this.showOtp = true;
            this.otpSubject.next(true);
          }
          else{
            this.message.error('Network Error❗','Please try again after sometimes');
            this.showOtp = false;
            this.otpSubject.next(res);
          }
        },
        error : (err)=>{
          this.message.error('Network Error❗','Please try again after sometimes');
          this.showOtp = false;
          this.otpSubject.error(err);
        }
      });

      return this.otpSubject;
    }
  
    getData(){
      if (this.meta.otp_sent == true) {
        if (this.meta.otp == undefined && this.meta.otp == '' && this.meta.client_id == undefined && this.meta.client_id == '') {
          this.message.error('please enter otp or client_id first', 'OTP or client_id feilds are probabily empty!')
        }
      }
      else {
        this.api.Aadhaar_GetData(this.meta)
          .subscribe({next:(res) => {
            if (res['status_code'] == "200") {
              this.data.dob = res['data']['dob'];
              this.data.full_name = res['data']['full_name'];
              this.data.gender = this.getGender(res['data']['gender']);
              this.data.address.dist = res['data']['address']['dist'];
              this.data.address.house = res['data']['address']['house'];
              this.data.address.country = res['data']['address']['country'];
              this.data.address.subdist = res['data']['address']['subdist'];
              this.data.address.vtc = res['data']['address']['vtc'];
              this.data.address.po = res['data']['address']['po'];
              this.data.address.state = res['data']['address']['state'];
              this.data.address.street = res['data']['address']['street'];
              this.data.address.loc = res['data']['address']['loc']
              this.data.profile_image = "data:image/png;base64," + res['data']['profile_image']
              this.data.age = this.FindAge(res['data']['dob']);
              this.common.aadhaar_no = this.meta.id_number;
              this.data.aadhaar_no = this.SplitAadhaarNo(this.meta.id_number);
              // console.log(this.data);
              this.showAadhaar = true;
              this.MakeHistory(this.data);
              this.api.PostAadharData(this.common).subscribe(res => {
                // console.log(res);
                
              });
              this.message.success('Infomation fetched  successfully', '');
              this.subject.next(true);
            }
            else {
              // console.log(res)
              this.showAadhaar = false;
              this.message.error('Failed', "");
              this.subject.next(res);
            }
          },
        error: (err)=>{
          this.showAadhaar = false;
          this.subject.error(err);
          this.message.error('Something went wrong', "Please try again after sometimes");
        }
        });
      }
      return this.subject;
  
    }
  
    private MakeHistory(data: Aadhaar_Data) {
      this.common.full_name = data.full_name;
      this.common.age = data.age;
      this.common.dob = data.dob;
      //this.common.aadhaar_no = data.aadhaar_no;
      this.common.profile_image = data.profile_image;
      this.common.gender = data.gender;
      this.common.address = `${data.address.vtc}, ${data.address.street}, ${data.address.loc}, ${data.address.dist}
      , ${data.address.state}, ${data.address.country}`
  
    }
  
    verifyPan() {
      let panverify = new Subject();
      this.api.Pan_Verify(this.meta1)
        .subscribe({next:(res) => {
          if (res['status_code'] == 200) {
            this.meta1.full_name = res['data']['full_name'];
            // console.log(res['data']);
            // console.log(this.meta1.full_name);
            this.isok = true;
            this.showPan = true;
            panverify.next(true);
            this.message.success('PAN Verified', `Name on PAN : ${this.meta1.full_name }`);
          }
          else {
            this.showPan = false;
            this.message.error('PAN Verification Failed', 'Entered Pan Number is not Valid');
            panverify.next(res);
          }
        },
      error:(err)=>{
        this.showPan = false;
        this.message.error('PAN Verification Failed', 'Please try again after sometimes');
        panverify.error(err);
      }
      });
      return panverify;
    }
  
    private getGender(genderCode: string): string {
      if (genderCode == 'M') {
        return 'Male';
      }
      else if (genderCode == 'F') {
        return 'Female'
      }
      else {
        return 'Other'
      }
    }
  
    private FindAge(Age: string): number {
      if (Age != undefined && Age != '') {
        let ageArray = Age.split('-');
        let year = ~~ageArray[0];
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        return currentYear - year;
      }
      else {
        console.error('Age is undefined of empty in (func : FindAge,class : Aaadhaar,comp : adharkyc');
        return 0;
      }
  
    }
  
    private SplitAadhaarNo(no: string): string {
      if (no != undefined || no != '') {
        return `${no.charAt(0)}${no.charAt(1)}${no.charAt(2)}${no.charAt(3)} ${no.charAt(4)}${no.charAt(5)}${no.charAt(6)}${no.charAt(7)} ${no.charAt(8)}${no.charAt(9)}${no.charAt(10)}${no.charAt(11)}`
      }
      else {
        console.error('no is undefined or empty in (func : SplitAadhaarNo, class : Aadhaar, comp : adharkyc)');
        return '';
      }
  
    }
  
  }