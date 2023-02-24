import { NzNotificationService } from "ng-zorro-antd/notification";
import { ApiService } from "../service/api.service";

export class Personal {
    ID?: number;
    APPLICANT_ID?:number;
    AADHAAR_NUMBER: string = '';
    PAN_NUMBER: string = '';
    PRIMARY_APPLICANT_NAME: string = '';
    APPLICANT2: string = '';
    APPLICANT3: string = '';
    APPLICANT4: string = '';
    GENDER: string = "M"
    DOB: any
    IS_MINOR: boolean = false
    MINOR_DOB: string = '';
    RELIGION?: string
    CAST?: string
    OCCUPATION?: string
    ANNUAL_INCOME?: string
    MOBILE_NO?: string
    EMAIL_ID?: string
    GUARDIAN_NAME: string = '';
    RELATION_WITH_MINOR?: string
    GUARDIAN_DOB: any
    IS_POLITICAL_EXPOSED_PERSON?: boolean

    IS_INTRODUCED: boolean = false;
    E_CUSTOMER_NAME: string = '';
    E_CUSTOMER_ID: string = '';
    E_ACCOUNT_NUMBER: string = '';
    E_YEARS?: number;

    changeMinor() {
        if (this.IS_MINOR) {
            this.IS_MINOR = false;
        }
        else if (!this.IS_MINOR) {
            this.IS_MINOR = true
        }

    }



}
