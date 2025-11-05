import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import { Aadhaar } from 'src/app/models/aadhaar';
import { PersonalInfo } from 'src/app/models/personal-info';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-applicant-personal',
  templateUrl: './applicant-personal.component.html',
  styleUrls: ['./applicant-personal.component.css']
})
export class ApplicantPersonalComponent implements OnInit, OnChanges {
  @Input() personalInfo!: PersonalInfo;
  @Output() isMinor = new EventEmitter<boolean>();
  constructor(private api: ApiService, private message: NzNotificationService) { }

  loadOtpButton: boolean = false;
  loadVerificationButton: boolean = false;

  OTP: string = '';

  spinningAll: boolean = false;

  ngOnInit(): void {
    // this.getAllAddress();

    this.getMasters()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personalInfo']) {
      this.getAddressDropDowns();
      this.getAadhaarData();
    }
  }

  onMinorChange(isMinor: boolean) {
    this.isMinor.emit(isMinor);
  }

  //masters 

  MASTERS = [
    { id: 3, data: <any>[], name: "occupation" },
    { id: 4, data: <any>[], name: "address proof" },
    { id: 5, data: <any>[], name: "id proof" },
    { id: 6, data: <any>[], name: "risk category" },
    { id: 13, data: <any>[], name: "state" },
    { id: 14, data: <any>[], name: "district" },
    { id: 15, data: <any>[], name: "taluka" },
    { id: 16, data: <any>[], name: "city" },
    { id: 17, data: <any>[], name: "area" },
    { id: 19, data: <any>[], name: "constitution" },
    { id: 8, data: <any>[], name: "religion" },
    { id: 9, data: <any>[], name: "caste" },
    { id: 2, data: <any>[], name: "title" },
  ]

  getAddressDropDowns() {
    this.getStateC();
    this.filterDistrictC();
    this.filterTalukaC();
    this.filterCityC();
    this.filterAreaC();


    this.getStateP();
    this.filterDistrictP();
    this.filterTalukaP();
    this.filterCityP();
    this.filterAreaP();
  }

  async getStateCode(id: number) {

    let filter = ` AND ID = ${id}`;

    let res = await lastValueFrom(this.api.getMasters(13, filter));

    if (res['code'] == 200 && res['data'].length > 0) {
      return res['data'][0].STATEID;
    }
    else {
      return 0;
    }
  }

  async getDistCode(id: number) {
    // let distArr = this.MASTERS[19].data.filter((val: any) => val.ID == id);
    // if (distArr.length > 0) {
    //   return distArr[0].DISTRICTID;
    // }
    // else {
    //   return 0;
    // }

    let filter = ` AND ID = ${id}`;

    let res = await lastValueFrom(this.api.getMasters(14, filter));

    if (res['code'] == 200 && res['data'].length > 0) {
      return res['data'][0].DISTRICTID;
    }
    else {
      return 0;
    }
  }

  async getTalukaCode(id: number) {
    // let talArr = this.MASTERS[20].data.filter((val: any) => val.ID == id);
    // if (talArr.length > 0) {
    //   return talArr[0].TALUKAID;
    // }
    // else {
    //   return 0;
    // }

    let filter = ` AND ID = ${id}`;

    let res = await lastValueFrom(this.api.getMasters(15, filter));

    if (res['code'] == 200 && res['data'].length > 0) {
      return res['data'][0].TALUKAID;
    }
    else {
      return 0;
    }

  }

  async getCityCode(id: number) {
    // let cityArr = this.MASTERS[21].data.filter((val: any) => val.ID == id);
    // if (cityArr.length > 0) {
    //   return cityArr[0].CITYID;
    // }
    // else {
    //   return 0;
    // }

    let filter = ` AND ID = ${id}`;

    let res = await lastValueFrom(this.api.getMasters(16, filter));

    if (res['code'] == 200 && res['data'].length > 0) {
      return res['data'][0].CITYID;
    }
    else {
      return 0;
    }

  }

  addressMaster = {
    current_state: {
      data: <any>[], loading: false
    },
    current_dist: {
      data: <any>[], loading: false
    },
    current_taluka: {
      data: <any>[], loading: false
    },
    current_city: {
      data: <any>[], loading: false
    },
    current_area: {
      data: <any>[], loading: false
    },


    permanent_state: {
      data: <any>[], loading: false
    },
    permanent_dist: {
      data: <any>[], loading: false
    },
    permanent_taluka: {
      data: <any>[], loading: false
    },
    permanent_city: {
      data: <any>[], loading: false
    },
    permanent_area: {
      data: <any>[], loading: false
    }
  }

  getStateC() {
    this.addressMaster.current_state.loading = true;
    this.api.getMasters(13).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.current_state.data = res['data'];
          this.addressMaster.current_state.loading = false;
        }
        else {
          this.addressMaster.current_state.loading = false;
        }
      },
      error: () => {
        this.addressMaster.current_state.loading = false;
      }
    })
  }

  async filterDistrictC() {
    // this.MASTERS[5].data = this.MASTERS[19].data.filter((val: any) => {
    //   return await this.getStateCode(this.personalInfo.CURRENT_STATE) == val.STATEID;
    // })
    this.addressMaster.current_dist.loading = true;

    let filter = ` AND STATEID = ${await this.getStateCode(this.personalInfo.CURRENT_STATE)}`;

    this.api.getMasters(14, filter).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.current_dist.data = res['data'];
          this.addressMaster.current_dist.loading = false;
        }
        else {
          this.addressMaster.current_dist.loading = false;
        }
      },
      error: () => {
        this.addressMaster.current_dist.loading = false;
      }
    })

  }

  async filterTalukaC() {
    // this.MASTERS[6].data = this.MASTERS[20].data.filter((val: any) => {
    //   return (await this.getStateCode(this.personalInfo.CURRENT_STATE) == val.STATEID) && (await this.getDistCode(this.personalInfo.CURRENT_DISTRICT) == val.DISTRICTID);
    // })

    this.addressMaster.current_taluka.loading = true;

    let filter = ` AND STATEID = ${await this.getStateCode(this.personalInfo.CURRENT_STATE)} AND DISTRICTID = ${await this.getDistCode(this.personalInfo.CURRENT_DISTRICT)}`;

    this.api.getMasters(15, filter).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.current_taluka.data = res['data'];
          this.addressMaster.current_taluka.loading = false;
        }
        else {
          this.addressMaster.current_taluka.loading = false;
        }
      },
      error: () => {
        this.addressMaster.current_taluka.loading = false;
      }
    })

  }

  async filterCityC() {
    // this.MASTERS[7].data = this.MASTERS[21].data.filter((val: any) => {
    //   return (await this.getStateCode(this.personalInfo.CURRENT_STATE) == val.STATEID) &&
    //     (await this.getDistCode(this.personalInfo.CURRENT_DISTRICT) == val.DISTRICTID) &&
    //     (await this.getTalukaCode(this.personalInfo.CURRENT_TALUKA) == val.TALUKAID);
    // })

    this.addressMaster.current_city.loading = true;

    let filter = ` AND STATEID = ${await this.getStateCode(this.personalInfo.CURRENT_STATE)}  AND DISTRICTID = ${await this.getDistCode(this.personalInfo.CURRENT_DISTRICT)}  AND TALUKAID = ${await this.getTalukaCode(this.personalInfo.CURRENT_TALUKA)}`;

    this.api.getMasters(16, filter).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.current_city.data = res['data'];
          this.addressMaster.current_city.loading = false;
        }
        else {
          this.addressMaster.current_city.loading = false;
        }
      },
      error: () => {
        this.addressMaster.current_city.loading = false;
      }
    });

  }

  async filterAreaC() {
    // this.MASTERS[8].data = this.MASTERS[22].data.filter((val: any) => {
    //   return (await this.getStateCode(this.personalInfo.CURRENT_STATE) == val.STATEID) &&
    //     (await this.getDistCode(this.personalInfo.CURRENT_DISTRICT) == val.DISTRICTID) &&
    //     (await this.getTalukaCode(this.personalInfo.CURRENT_TALUKA) == val.TALUKAID) &&
    //     (await this.getCityCode(this.personalInfo.CURRENT_CITY) == val.CITYID);
    // })

    this.addressMaster.current_area.loading = true;
    let filter = ` AND STATEID = ${await this.getStateCode(this.personalInfo.CURRENT_STATE)}  AND DISTRICTID = ${await this.getDistCode(this.personalInfo.CURRENT_DISTRICT)}   AND TALUKAID = ${await this.getTalukaCode(this.personalInfo.CURRENT_TALUKA)}  AND CITYID = ${await this.getCityCode(this.personalInfo.CURRENT_CITY)}`;

    this.api.getMasters(17, filter).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.current_area.data = res['data'];
          this.addressMaster.current_area.loading = false;
        }
        else {
          this.addressMaster.current_area.loading = false;
        }
      },
      error: () => {
        this.addressMaster.current_area.loading = false;
      }
    });

  }

  getStateP() {
    this.addressMaster.permanent_state.loading = true;
    this.api.getMasters(13).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.permanent_state.data = res['data'];
          this.addressMaster.permanent_state.loading = false;
        }
        else {
          this.addressMaster.permanent_state.loading = false;
        }
      },
      error: () => {
        this.addressMaster.permanent_state.loading = false;
      }
    })
  }

  async filterDistrictP() {
    // console.log("State ID", await this.getStateCode(this.personalInfo.PERMANENT_STATE))
    // this.MASTERS[14].data = this.MASTERS[19].data.filter((val: any) => {
    //   console.log(val);
    //   return await this.getStateCode(this.personalInfo.PERMANENT_STATE) == val.STATEID;
    // })

    // console.log("district list", this.MASTERS[14].data);

    this.addressMaster.permanent_dist.loading = true;

    let filter = ` AND STATEID = ${await this.getStateCode(this.personalInfo.PERMANENT_STATE)}`;

    this.api.getMasters(14, filter).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.permanent_dist.data = res['data'];
          this.addressMaster.permanent_dist.loading = false;
        }
        else {
          this.addressMaster.permanent_dist.loading = false;
        }
      },
      error: () => {
        this.addressMaster.permanent_dist.loading = false;
      }
    })

  }

  async filterTalukaP() {
    // this.MASTERS[15].data = this.MASTERS[20].data.filter((val: any) => {
    //   return (await this.getStateCode(this.personalInfo.PERMANENT_STATE) == val.STATEID) &&
    //     (await this.getDistCode(this.personalInfo.PERMANENT_DISTRICT) == val.DISTRICTID);
    // })

    this.addressMaster.permanent_taluka.loading = true;

    let filter = ` AND STATEID = ${await this.getStateCode(this.personalInfo.PERMANENT_STATE)} AND DISTRICTID = ${await this.getDistCode(this.personalInfo.PERMANENT_DISTRICT)}`;

    this.api.getMasters(15, filter).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.permanent_taluka.data = res['data'];
          this.addressMaster.permanent_taluka.loading = false;
        }
        else {
          this.addressMaster.permanent_taluka.loading = false;
        }
      },
      error: () => {
        this.addressMaster.permanent_taluka.loading = false;
      }
    })

  }

  async filterCityP() {
    // this.MASTERS[16].data = this.MASTERS[21].data.filter((val: any) => {
    //   return (await this.getStateCode(this.personalInfo.PERMANENT_STATE) == val.STATEID) &&
    //     (await this.getDistCode(this.personalInfo.PERMANENT_DISTRICT) == val.DISTRICTID) &&
    //     (await this.getTalukaCode(this.personalInfo.PERMANENT_TALUKA) == val.TALUKAID);
    // })
    this.addressMaster.permanent_city.loading = true;

    let filter = ` AND STATEID = ${await this.getStateCode(this.personalInfo.PERMANENT_STATE)}  AND DISTRICTID = ${await this.getDistCode(this.personalInfo.PERMANENT_DISTRICT)}  AND TALUKAID = ${await this.getTalukaCode(this.personalInfo.PERMANENT_TALUKA)}`;

    this.api.getMasters(16, filter).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.permanent_city.data = res['data'];
          this.addressMaster.permanent_city.loading = false;
        }
        else {
          this.addressMaster.permanent_city.loading = false;
        }
      },
      error: () => {
        this.addressMaster.permanent_city.loading = false;
      }
    });
  }

  async filterAreaP() {
    // this.MASTERS[17].data = this.MASTERS[22].data.filter((val: any) => {
    //   return (await this.getStateCode(this.personalInfo.PERMANENT_STATE) == val.STATEID) &&
    //     (await this.getDistCode(this.personalInfo.PERMANENT_DISTRICT) == val.DISTRICTID) &&
    //     (await this.getTalukaCode(this.personalInfo.PERMANENT_TALUKA) == val.TALUKAID) &&
    //     (await this.getCityCode(this.personalInfo.PERMANENT_CITY) == val.CITYID);
    // })

    this.addressMaster.permanent_area.loading = true;

    let filter = ` AND STATEID = ${await this.getStateCode(this.personalInfo.PERMANENT_STATE)}  AND DISTRICTID = ${await this.getDistCode(this.personalInfo.PERMANENT_DISTRICT)}   AND TALUKAID = ${await this.getTalukaCode(this.personalInfo.PERMANENT_TALUKA)}  AND CITYID = ${await this.getCityCode(this.personalInfo.PERMANENT_CITY)}`;

    this.api.getMasters(17, filter).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.addressMaster.permanent_area.data = res['data'];
          this.addressMaster.permanent_area.loading = false;
        }
        else {
          this.addressMaster.permanent_area.loading = false;
        }
      },
      error: () => {
        this.addressMaster.permanent_area.loading = false;
      }
    });
  }


  async getMasters() {

    this.spinningAll = true;

    for (let i = 0; i < this.MASTERS.length; i++) {
      if (!([13, 14, 15, 16, 17].includes(this.MASTERS[i].id))) {
        let result = await lastValueFrom(this.api.getMasters(this.MASTERS[i].id));

        if (result['code'] == 200 && result["data"].length > 0) {
          this.MASTERS[i].data = result['data'];
          this.checkForAadhaarID();
          this.checkForAadharAddress();
          this.filterCaste();
        }
      }
    }

    this.spinningAll = false;

    console.log('MASTERS', this.MASTERS);

  }

  CasteList: any[] = []

  filterCaste() {
    let rel_id = this.personalInfo.RELIGION;
    this.CasteList = this.MASTERS[11].data.filter((value: any) => value.CST_RELGCD == rel_id);

  }


  mendetory_all = [
    { field: 'RISK_CATEGORY', message: "Risk Category" },
    { field: 'BLOOD_TYPE', message: 'Blood Type' },

    { field: 'FIRST_NAME', message: "Applicant First Name" },
    { field: 'MIDDLE_NAME', message: "Applicant Middle Name" },
    { field: 'LAST_NAME', message: "Applicant Last Name" },

    { field: 'F_OR_H_FIRST_NAME', message: "Father / Husband First Name" },
    { field: 'F_OR_H_MIDDLE_NAME', message: "Father / Husband Middle Name" },
    { field: 'F_OR_H_LAST_NAME', message: "Father / Husband Last Name" },

    { field: 'MOTHERS_NAME', message: "Mother's First Name" },
    { field: 'MOTHERS_MIDDLE_NAME', message: "Mother's Middle Name" },
    { field: 'MOTHERS_LAST_NAME', message: "Mother's Last Name" },

    { field: 'DATE_OF_BIRTH', message: "Date of Birth" },

    { field: 'NATIONALITY', message: "Nationality" },

    { field: 'GENDER', message: "Gender" },

    { field: 'PERMANENT_ADDRESS', message: "Permanent Address Flat No, Name of Building" },
    { field: 'PERMANENT_CITY', message: "Permanent Address City / Village" },
    { field: 'PERMANENT_TALUKA', message: "Permanent Address Taluka" },
    { field: 'PERMANENT_DISTRICT', message: "Permanent Address District" },
    { field: 'PERMANENT_LANDMARK', message: "Permanent Address Road, Area Name" },
    { field: 'PERMANENT_STATE', message: "Permanent Address State" },
    { field: 'PERMANENT_PINCODE', message: "Permanent Address Pincode" },

    { field: 'CURRENT_ADDRESS', message: "Current Address Flat No, Name of Building" },
    { field: 'CURRENT_CITY', message: "Current Address City / Village" },
    { field: 'CURRENT_TALUKA', message: "Current Address Taluka" },
    { field: 'CURRENT_DISTRICT', message: "Current Address District" },
    { field: 'CURRENT_LANDMARK', message: "Current Address Road, Area Name" },
    { field: 'CURRENT_STATE', message: "Current Address State" },
    { field: 'CURRENT_PINCODE', message: "Current Address Pincode" },

    { field: 'MOBILE_NUMBER', message: "Mobile Number 1" },

    { field: 'EMAIL_ID', message: "Email ID" },

    { field: 'RELIGION', message: "Religion" },

    { field: 'CASTE', message: "Caste" },

    { field: 'ID_PROOF', message: "Identity Proof" },

    { field: 'ID_PROOF_NUMBER', message: "Identity Proof Number" },

    { field: 'PERMANENT_ADDRESS_PROOF_NUMBER', message: "Permanent Address Proof Number" },

    { field: 'PERMANENT_AREA', message: "Permanent Area" },

    { field: 'CURRENT_AREA', message: "Current Area" },

    { field: 'CONSTITUTION', message: "Constitution" }

  ]

  mendetory_religion = [
    { field: 'OTHER_RELIGION', message: "Other Religion" }
  ]

  mendentory_cast = [
    { field: 'OTHER_CASTE', message: "Other Caste" }
  ]

  mendentory_minor = [
    // { field: 'GUARDIAN_NAME', message: "Name of the Guardian" },
    // { field: 'GUARDIAN_RELATION', message: "Relationship with minor" },
    // { field: 'GUARDIAN_PAN', message: "Guardian's PAN number" }
  ]

  optionList = [
    {
      label: 'Indian',
      value: 'A'
    }
  ]

  addressList = [
    {
      label: '',
      value: ''
    }
  ]

  relationList = [
    {
      label: 'Father',
      value: 'A',
    },
    {
      label: 'Mother',
      value: 'B',
    },
    {
      label: 'Brother',
      value: 'C',
    },
    {
      label: 'Sister',
      value: 'D',
    },
    {
      label: 'Son',
      value: 'E',
    },
    {
      label: 'Daughter',
      value: 'F',
    },
    {
      label: 'Husband',
      value: 'G',
    },

    {
      label: 'Wife',
      value: 'H',
    }
  ]

  //Address Module

  STATE_LIST: ADDRESS_STATE[] = [];
  PERMANENT_DISTRICT_LIST: ADDRESS_DISTRICT[] = [];
  PERMANENT_TALUKA_LIST: ADDRESS_TALUKA[] = [];
  PERMANENT_VILLAGE_LIST: ADDRESS_VILLAGE[] = [];

  CURRENT_DISTRICT_LIST: ADDRESS_DISTRICT[] = [];
  CURRENT_TALUKA_LIST: ADDRESS_TALUKA[] = [];
  CURRENT_VILLAGE_LIST: ADDRESS_VILLAGE[] = [];


  state_loading: boolean = false;
  permanent_district_loading: boolean = false;
  permanent_taluka_loading: boolean = false;
  permanent_village_loading: boolean = false;

  current_district_loading: boolean = false;
  current_taluka_loading: boolean = false;
  current_village_loading: boolean = false;

  getStateList() {
    this.state_loading = true;
    this.api.getState().subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.state_loading = false;
          this.STATE_LIST = res['data'];
        }
        else {
          this.state_loading = false;
        }
      },
      error: () => {
        this.state_loading = false;
      }
    })
  }

  changeDistrictLoadingStatus(address_type: 'P' | 'C', value: boolean = false) {
    switch (address_type) {
      case 'P':
        this.permanent_district_loading = value;
        break;

      case 'C':
        this.current_district_loading = value;
        break;
    }
  }

  getDistrictList(address_type: 'P' | 'C') { // 'P' is permanet address and 'C' is Current Address
    let state_name = '';

    this.changeDistrictLoadingStatus(address_type, true);

    switch (address_type) {
      case 'P':
        state_name = this.personalInfo.PERMANENT_STATE;
        break;

      case 'C':
        state_name = this.personalInfo.CURRENT_STATE;
        break;
    }

    this.api.getDistrict(state_name).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {

          switch (address_type) {
            case 'P':
              this.PERMANENT_DISTRICT_LIST = res['data'];
              break;

            case 'C':
              this.CURRENT_DISTRICT_LIST = res['data'];
              break;
          }

          this.changeDistrictLoadingStatus(address_type);

        }
        else {
          this.changeDistrictLoadingStatus(address_type);
        }
      },
      error: () => {
        this.changeDistrictLoadingStatus(address_type);
      }
    })

  }

  changeTalukaLoadingStatus(address_type: 'P' | 'C', value: boolean = false) {
    switch (address_type) {
      case 'P':
        this.permanent_taluka_loading = value;
        break;

      case 'C':
        this.current_taluka_loading = value;
        break;
    }
  }

  getTalukaList(address_type: 'P' | 'C') {
    this.changeTalukaLoadingStatus(address_type, true);

    let district_name = address_type == 'P' ? this.personalInfo.PERMANENT_DISTRICT : this.personalInfo.CURRENT_DISTRICT;

    this.api.getTaluka(district_name).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          switch (address_type) {
            case 'P':
              this.PERMANENT_TALUKA_LIST = res['data'];
              break;

            case 'C':
              this.CURRENT_TALUKA_LIST = res['data'];
              break;
          }
          this.changeTalukaLoadingStatus(address_type, false);

        }
        else {
          this.changeTalukaLoadingStatus(address_type, false);
        }
      },
      error: () => {
        this.changeTalukaLoadingStatus(address_type, false);
      }
    })
  }

  changeVillageLoadingStatus(address_type: 'P' | 'C', value: boolean = false) {
    switch (address_type) {
      case 'P':
        this.permanent_village_loading = value;
        break;

      case 'C':
        this.current_village_loading = value;
        break;
    }
  }

  getVillageList(address_type: 'P' | 'C') {
    this.changeVillageLoadingStatus(address_type, true);

    let taluka_list = address_type == 'P' ? this.personalInfo.PERMANENT_TALUKA : this.personalInfo.CURRENT_TALUKA;

    this.api.getVillage(taluka_list).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {

          switch (address_type) {
            case 'P':
              this.PERMANENT_VILLAGE_LIST = res['data'];
              break;

            case 'C':
              this.CURRENT_VILLAGE_LIST = res['data'];
              break;
          }
          this.changeVillageLoadingStatus(address_type, false);
        }
        else {
          this.changeVillageLoadingStatus(address_type, false);
        }
      },
      error: () => {
        this.changeVillageLoadingStatus(address_type, false);
      }
    })

  }

  getAllAddress() {
    this.getStateList();
    this.getDistrictList('P');
    this.getTalukaList('P');
    this.getVillageList('P');
    this.getDistrictList('C');
    this.getTalukaList('C');
    this.getVillageList('C');
  }

  //Address Module

  getApplicantPersonal() {

  }

  copyClick() {
    this.personalInfo.CURRENT_ADDRESS = this.personalInfo.PERMANENT_ADDRESS;
    this.personalInfo.CURRENT_CITY = this.personalInfo.PERMANENT_CITY;
    this.personalInfo.CURRENT_TALUKA = this.personalInfo.PERMANENT_TALUKA;
    this.personalInfo.CURRENT_DISTRICT = this.personalInfo.PERMANENT_DISTRICT;
    this.personalInfo.CURRENT_LANDMARK = this.personalInfo.PERMANENT_LANDMARK;
    this.personalInfo.CURRENT_STATE = this.personalInfo.PERMANENT_STATE;
    this.personalInfo.CURRENT_PINCODE = this.personalInfo.PERMANENT_PINCODE;
    this.personalInfo.CURRENT_AREA = this.personalInfo.PERMANENT_AREA;

    this.getAddressDropDowns();
    // this.getAllAddress();
  }

  convertToString() {
    this.personalInfo.CURRENT_AREA = this.personalInfo.CURRENT_AREA.toString()
    this.personalInfo.PERMANENT_AREA = this.personalInfo.PERMANENT_AREA.toString()
    this.personalInfo.CURRENT_CITY = this.personalInfo.CURRENT_CITY.toString()
    this.personalInfo.PERMANENT_CITY = this.personalInfo.PERMANENT_CITY.toString()
    this.personalInfo.CURRENT_TALUKA = this.personalInfo.CURRENT_TALUKA.toString()
    this.personalInfo.PERMANENT_TALUKA = this.personalInfo.PERMANENT_TALUKA.toString()
    this.personalInfo.CURRENT_DISTRICT = this.personalInfo.CURRENT_DISTRICT.toString()
    this.personalInfo.PERMANENT_DISTRICT = this.personalInfo.PERMANENT_DISTRICT.toString()
    this.personalInfo.CURRENT_STATE = this.personalInfo.CURRENT_STATE.toString()
    this.personalInfo.PERMANENT_STATE = this.personalInfo.PERMANENT_STATE.toString()
  }

  convertToNumber() {
    this.personalInfo.CURRENT_AREA = Number(this.personalInfo.CURRENT_AREA)
    this.personalInfo.PERMANENT_AREA = Number(this.personalInfo.PERMANENT_AREA)
    this.personalInfo.CURRENT_CITY = Number(this.personalInfo.CURRENT_CITY)
    this.personalInfo.PERMANENT_CITY = Number(this.personalInfo.PERMANENT_CITY)
    this.personalInfo.CURRENT_TALUKA = Number(this.personalInfo.CURRENT_TALUKA)
    this.personalInfo.PERMANENT_TALUKA = Number(this.personalInfo.PERMANENT_TALUKA)
    this.personalInfo.CURRENT_DISTRICT = Number(this.personalInfo.CURRENT_DISTRICT)
    this.personalInfo.PERMANENT_DISTRICT = Number(this.personalInfo.PERMANENT_DISTRICT)
    this.personalInfo.CURRENT_STATE = Number(this.personalInfo.CURRENT_STATE)
    this.personalInfo.PERMANENT_STATE = Number(this.personalInfo.PERMANENT_STATE)
  }


  save() {
    let personal: Subject<any> = new Subject();

    let isOk = true;

    for (let field of this.mendetory_all) {
      if (!this.personalInfo[field.field as keyof PersonalInfo]) {
        this.message.error(`${field.message} is Mandatory`, '');
        isOk = false;
      }
    }

    if (this.personalInfo.RELIGION == 'G') {
      for (let field of this.mendetory_religion) {
        if (!this.personalInfo[field.field as keyof PersonalInfo]) {
          this.message.error(`${field.message} is Mandatory`, '');
          isOk = false;
        }
      }
    }

    if (this.personalInfo.CASTE == 'G') {
      for (let field of this.mendentory_cast) {
        if (!this.personalInfo[field.field as keyof PersonalInfo]) {
          this.message.error(`${field.message} is Mandatory`, '');
          isOk = false;
        }
      }
    }

    // if (this.personalInfo.IS_MINOR) {
    //   for (let field of this.mendentory_minor) {
    //     if (!this.personalInfo[field.field as keyof PersonalInfo]) {
    //       this.message.error(`${field.message} is Mandatory`, '');
    //       isOk = false;
    //     }
    //   }
    // }

    if (isOk) {
      if (this.personalInfo.ID) {
        // this.convertToString();
        this.api.updateAplicant(this.personalInfo).subscribe({
          next: (res) => {
            if (res.code == 200) {
              this.message.success("Personal Information updated successfully!", '');
              // this.convertToNumber();
              this.getApplicantPersonal();
              personal.next(res);
            }
            else {
              this.message.error('Failed to update personal info', '');
              personal.next(res);
            }
          },
          error: (err) => {
            this.message.error("Internal Server Error!", err);
            personal.error('err')
          },
          complete: () => {
            console.info("Add Personal Info Request Completed!");
            personal.complete();
          }
        })
      }
      else {

      }
    }
    else {
      personal.error("All mendetory fields are not filled");
    }

    return personal;
  }

  showOtpField: boolean = false;

  getOtp() {
    this.api.getEmailOtp(this.personalInfo.EMAIL_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success("OTP has been sent.", 'Please check your inbox');
          this.showOtpField = true;
        }
        else {
          this.message.error("Something Went Wrong!", "");
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  verifyEmail() {
    this.api.verifyEmail(this.OTP, this.personalInfo.EMAIL_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success("Email Verified Successfully!", "");
          this.showOtpField = false;
          this.personalInfo.IS_EMAIL_VERIFIED = true;
          this.OTP = '';
        }
        else {
          this.message.error("Something Went Wrong!", "");
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  PROFESSION_LIST = [
    { value: 'A', lable: 'Employee' },
    { value: 'B', lable: 'Self Employeed' },
    { value: 'C', lable: 'Business' },
    { value: 'D', lable: 'Retired' },
    { value: 'E', lable: 'Student' },
    { value: 'F', lable: 'House Wife' },
    { value: 'G', lable: 'Other' },
    { value: ' ', lable: 'None' }
  ];


  NATURE_OF_SERVICE_LIST = [
    { value: 'A', lable: 'Central/State Government' },
    { value: 'B', lable: 'Private Company' },
    { value: ' ', lable: 'None' }
  ];

  SELF_EMPLOYED_LIST = [
    { value: 'A', lable: 'CA' },
    { value: 'B', lable: 'Doctor' },
    { value: 'C', lable: 'Advisor' },
    { value: 'D', lable: 'Trader' },
    { value: 'E', lable: 'Engineer' },
    { value: 'F', lable: 'Advocate' },
    { value: 'G', lable: 'Software' },
    { value: 'H', lable: 'Other' },
    { value: ' ', lable: 'None' }

  ];

  NATURE_OF_BUSINESS_LIST = [
    { value: 'A', lable: 'Agriculture' },
    { value: 'B', lable: 'Trader' },
    { value: 'C', lable: 'Manufacture' },
    { value: 'D', lable: 'Retailer' },
    { value: 'E', lable: 'Wholesaler' },
    { value: 'F', lable: 'Businessman' },
    { value: ' ', lable: 'None' }
  ];

  SOURCE_OF_FUNDS_LIST = [
    { value: 'A', lable: 'Business income' },
    { value: 'B', lable: 'Commission Income' },
    { value: 'C', lable: 'Salary Income' },
    { value: 'D', lable: 'Rent Income' },
    { value: 'E', lable: 'Agri Income' },
    { value: 'F', lable: 'Pension Income' },
    { value: 'G', lable: 'Family Income' },
    { value: ' ', lable: 'None' }
  ];

  showFund: boolean = true;
  showBusiness: boolean = false;
  showService: boolean = false;
  showSelfEmployed: boolean = false;

  changeProfession() {
    if (this.personalInfo.PROFESSION == 'A') {
      this.showService = true;
      this.showBusiness = false;
      this.showSelfEmployed = false;
      this.personalInfo.SELF_EMPLOYED = ' ';
      this.personalInfo.NATURE_OF_BUSINESS = ' '
    }
    else if (this.personalInfo.PROFESSION == 'B') {
      this.showService = false;
      this.showBusiness = false;
      this.showSelfEmployed = true;
      this.personalInfo.NATURE_OF_SERVICE = ' ';
      this.personalInfo.NATURE_OF_BUSINESS = ' '
    }
    else if (this.personalInfo.PROFESSION == 'C') {
      this.showService = false;
      this.showBusiness = true;
      this.showSelfEmployed = false;
      this.personalInfo.NATURE_OF_SERVICE = ' ';
      this.personalInfo.SELF_EMPLOYED = ' '
    }
    else {
      this.showService = false;
      this.showBusiness = false;
      this.showSelfEmployed = false;
      this.personalInfo.NATURE_OF_SERVICE = ' ';
      this.personalInfo.SELF_EMPLOYED = ' '
      this.personalInfo.NATURE_OF_BUSINESS = ' '
    }
  }

  id_mask: string = ''
  copyDocumentNoInIDProof() {
    this.personalInfo.ID_PROOF_NUMBER = ''

    if (this.checkForAadhaarID()) {
      this.personalInfo.ID_PROOF_NUMBER = this.personalInfo.AADHAAR_NUMBER;

    }

  }

  address_mask: string = ''
  copyDocumentNoInAddressProof() {

    this.personalInfo.PERMANENT_ADDRESS_PROOF_NUMBER = ''


    if (this.checkForAadharAddress()) {
      this.personalInfo.PERMANENT_ADDRESS_PROOF_NUMBER = this.personalInfo.AADHAAR_NUMBER;
    }

  }

  checkForAadhaarID() {
    this.id_mask = ''
    let id = this.personalInfo.ID_PROOF;

    let id_proof_arr = this.MASTERS[2].data.filter((value: any) => id == value.IDTPROOFID);

    if (id_proof_arr.length == 0) {
      return false;
    }

    let value = id_proof_arr[0].IDTPROOFDESC;

    let lower_value = value.toLowerCase();

    if ((lower_value.search("aadhaar") != -1 || lower_value.search("adhar") != -1 || lower_value.search("uid") != -1) && this.personalInfo.AADHAAR_NUMBER) {
      this.id_mask = 'XXXX XXXX 0000'
      return true

    }

    return false;

  }

  checkForAadharAddress() {
    let id = this.personalInfo.PERMANENT_ADDRESS_PROOF;
    this.address_mask = ''

    let address_proof_arr = this.MASTERS[1].data.filter((value: any) => id == value.ADDPROOFID);

    if (address_proof_arr.length == 0) {
      return false;
    }

    let value = address_proof_arr[0].ADDPROOFDESC;

    let lower_value = value.toLowerCase();

    if ((lower_value.search("aadhaar") != -1 || lower_value.search("aadhar") != -1 || lower_value.search("uid") != -1) && this.personalInfo.AADHAAR_NUMBER) {
      this.address_mask = 'XXXX XXXX 0000'
      return true;
    }

    return false;
  }

  aadhaarVerify: Aadhaar = new Aadhaar(this.api, this.message);

  getAadhaarData() {
    if (this.personalInfo.AADHAAR_NUMBER) {

    }
    this.api.getAadhaarData(this.personalInfo.APPLICANT_NO, this.personalInfo.AADHAAR_NUMBER).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {

          this.aadhaarVerify.aadhar_history = res['data'][0];
          if (this.aadhaarVerify.aadhar_history.ADDRESS_ID.length > 0) {
            this.aadhaarVerify.aadhar_address = this.aadhaarVerify.aadhar_history.ADDRESS_ID[0];
          }
          // this.hideAadhar = true;
          this.aadhaarVerify.MakeHistory();

        }
      }
    })
  }

}

interface ADDRESS_STATE {
  STATE: string;
}


interface ADDRESS_DISTRICT {
  DISTRICT: string;
}

interface ADDRESS_TALUKA {
  TALUKA: string;
}

interface ADDRESS_VILLAGE {
  VILLAGE: string;
}
