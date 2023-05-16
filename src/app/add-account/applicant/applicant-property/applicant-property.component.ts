import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Property } from 'src/app/models/property';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-applicant-property',
  templateUrl: './applicant-property.component.html',
  styleUrls: ['./applicant-property.component.css']
})
export class ApplicantPropertyComponent implements OnInit {
  propertyInfo:Property = new Property();
  @Input() APPLICANT_ID?:number
  @Input() APPLICANT_NO?:number
  checkOptionsOne: checkInterface[] = [
    { label: 'Four Wheeler', checked: this.propertyInfo.IS_FOUR_WHEELER?true:false},
    { label: 'Two Wheeler', checked: this.propertyInfo.IS_TWO_WHEELER?true:false},
    { label: 'Home Theater', checked: this.propertyInfo.IS_HOME_THEATER?true:false},
    { label: 'Air Conditionar', checked: this.propertyInfo.IS_AC?true:false},
    { label: 'Digital Camera', checked: this.propertyInfo.IS_DIGITAL_CAMERA?true:false},
    { label: 'Video Player', checked: this.propertyInfo.IS_VIDEO_PLAYER?true:false},
    { label: 'Microwave', checked: this.propertyInfo.IS_MICROWAVE?true:false},
    { label: 'LCD TV', checked: this.propertyInfo.IS_LCD_TV?true:false},
    { label: 'Computer', checked: this.propertyInfo.IS_COMPUTER?true:false},
    { label: 'Washing Machine', checked: this.propertyInfo.IS_WASHING_MACHINE?true:false}
  ]
  changeInOption() {
    let j = 0;
    let count = 0;
    console.log(this.checkOptionsOne);
    for (let option of this.checkOptionsOne) {
      if (j == 0) {
        this.propertyInfo.IS_FOUR_WHEELER = option.checked;
      }
      if (j == 1) {
        this.propertyInfo.IS_TWO_WHEELER = option.checked;
      }
      if (j == 2) {
        this.propertyInfo.IS_HOME_THEATER = option.checked;
      }
      if (j == 3) {
        this.propertyInfo.IS_AC = option.checked;
      }
      if (j == 4) {
        this.propertyInfo.IS_DIGITAL_CAMERA = option.checked;
      }
      if (j == 5) {
        this.propertyInfo.IS_VIDEO_PLAYER = option.checked;
      }
      if (j == 6) {
        this.propertyInfo.IS_MICROWAVE = option.checked;
      }
      if (j == 7) {
        this.propertyInfo.IS_LCD_TV = option.checked;
      }
      if (j == 8) {
        this.propertyInfo.IS_COMPUTER = option.checked;
      }
      if (j == 9) {
        this.propertyInfo.IS_WASHING_MACHINE = option.checked;
      }
      if (option.checked) {
        count++;
      }
      if (count == 10) {
        this.indeterminate = false;
        this.allChecked = true;
      } else if (count == 0) {
        this.allChecked = false;
        this.indeterminate = false;
      } else {
        this.allChecked = false;
        this.indeterminate = true;
      }
      j++;
    }
  }
  indeterminate = false;
  allChecked = false;
  updateAllChecked() {
    if (this.allChecked) {
      for (let option of this.checkOptionsOne) {
        option.checked = true
        this.changeInOption();
      }
    } else {
      for (let option of this.checkOptionsOne) {
        option.checked = false
        this.changeInOption();
      }
    }
  }
  constructor(private api:ApiService,private message:NzNotificationService) { }

  ngOnInit(): void {

  }

  getApplicantProperty(){
   this.api.getProperty(this.APPLICANT_ID,this.APPLICANT_NO).subscribe({
    next:(res)=>{
      if(res['code']==200 && res['data'].length > 0){
        this.propertyInfo = res['data'][0]
      }
      else{

      }
    },
    error:() =>{

    },
    complete:() =>{
      
    }
   })
  }

  save() {
    let property: Subject<any> = new Subject();

    if (this.propertyInfo.ID) {
      this.api.updateProperty(this.propertyInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Property Information updated successfully!", '');
            this.getApplicantProperty();
            property.next(res);
          }
          else {
            this.message.error('Failed to update Property info', '');
            property.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          property.error('err')
        },
        complete: () => {
          console.info("Add Property Info Request Completed!");
          property.complete();
        }
      })
    }
    else {
      this.propertyInfo.APPLICANT_ID = this.APPLICANT_ID;
      this.propertyInfo.APPLICANT_NO = this.APPLICANT_NO;
      this.api.createProperty(this.propertyInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Property Information created successfully!", '');
            this.getApplicantProperty();
            property.next(res);
          }
          else {
            this.message.error('Failed to create Property info', '');
            property.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          property.error('err')
        },
        complete: () => {
          console.info("Add Property Info Request Completed!");
          property.complete();
        }
      })
    }
    return property;
  }

}

interface checkInterface {
  label: string;
  checked: boolean;
}
