import { Component, OnInit,OnDestroy } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Aadhaar } from 'src/app/models/aadhaar';
import { Personal } from 'src/app/models/personal';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnDestroy(){
    
  }

  loadAadhaarButton = false;
  loadOtpButton = false;
  personalInfo: Personal = new Personal();
  aadhaarVerify: Aadhaar = new Aadhaar(this.api, this.message);

  getOtp() {
    this.loadOtpButton = true;
    let otpData = this.aadhaarVerify.getOTP();
    otpData.subscribe({next:(res)=>{
      if(res == true){
        this.loadOtpButton = false;
        otpData.unsubscribe();
      }
      else{
        this.loadOtpButton = false;
        otpData.unsubscribe();
      }
    },
    error:()=>{
      this.loadOtpButton = false;
      otpData.unsubscribe();
    }
  })

  }
  getAadhaarData() {
    this.loadAadhaarButton = true
    let aadhar_data = this.aadhaarVerify.getData();
    aadhar_data.subscribe({
      next: (res) => {
        if (res == true) {
          if (this.aadhaarVerify.data.age < 18) {
            this.personalInfo.IS_MINOR = true;
            this.personalInfo.MINOR_DOB = this.aadhaarVerify.data.dob;
            this.personalInfo.AADHAAR_NUMBER = this.aadhaarVerify.data.aadhaar_no;
          }
          else {
            this.personalInfo.IS_MINOR = false;
            this.personalInfo.PRIMARY_APPLICANT_NAME = this.aadhaarVerify.data.full_name;
            this.personalInfo.AADHAAR_NUMBER = this.aadhaarVerify.data.aadhaar_no;
            
          }
          aadhar_data.unsubscribe();
          this.loadAadhaarButton = false
        }
        else{
          console.log(res ,"else")
          this.loadAadhaarButton = false
        }
      },
      error:(err)=>{
        aadhar_data.unsubscribe();
        console.log(err ,"error")
        this.loadAadhaarButton = false
      }
      
    })

  }
  verifyPan(){
    let panverify = this.aadhaarVerify.verifyPan();
    panverify.subscribe({next:(res)=>{
      if(res == true){
        this.personalInfo.PAN_NUMBER = this.aadhaarVerify.meta1.id_number;
        panverify.unsubscribe();
      }
    }})
  }


  save(){
    let personal:Subject<any> = new Subject();
    this.api.addPersonal(this.personalInfo).subscribe({
           next:(res)=>{
               if(res.code==200){
                   this.message.success("Personal Information added successfully!",'');
                   personal.next(res);
               }
               else{
                   this.message.error('Failed to add personal info','');
                   personal.next(res);
               }
           },
           error:(err)=>{
               this.message.error("Internal Server Error!",err);
               personal.error('err')
           },
           complete:()=>{
              console.info("Add Personal Info Request Completed!");
              personal.complete();
           }
       })
       return personal;
   }
   
  ngOnInit(): void {
  }

}
