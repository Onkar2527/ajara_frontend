export class PersonalInfo {
    ID!: number;
    APPLICANT_ID!: number;
    APPLICANT_NO!:number;

    FIRST_NAME: string = '';
    MIDDLE_NAME: string = '';
    LAST_NAME: string = '';
    F_OR_H_FIRST_NAME: string = '';
    F_OR_H_MIDDLE_NAME: string = '';
    F_OR_H_LAST_NAME: string = '';

    CURRENT_ADDRESS: string = '';
    CURRENT_CITY: string = '';
    CURRENT_TALUKA: string = '';
    CURRENT_DISTRICT: string = '';
    CURRENT_LANDMARK: string = '';
    CURRENT_STATE: string = '';
    CURRENT_PINCODE: string = '';

    PERMANENT_ADDRESS: string = '';
    PERMANENT_CITY: string = '';
    PERMANENT_TALUKA: string = '';
    PERMANENT_DISTRICT: string = '';
    PERMANENT_LANDMARK: string = '';
    PERMANENT_STATE: string = '';
    PERMANENT_PINCODE: string = '';

    HOUSE_PHONE: string = '';
    OFFICE_PHONE: string = '';
    EMAIL_ID: string = '';
    MOBILE_NUMBER: string = '';

    WORK: string = 'E';
    ESTABLISHMENT: string = ' ';
    RELIGION: string = 'H';
    CAST: string = 'N';

    MARITAL_STATUS: string = 'M'

    FAMILY_COUNT!: number;

    EDUCATION: string = 'S';

    IS_INSURED: boolean = false;

    INSURANCE_YEAR!: number;

    POLICY_TYPE: string = '';
    INSURANCE_COMPANY: string = '';

    AADHAAR_NUMBER: string = '';

    BLOOD_TYPE: string = '';
    BLOOD_TYPE_SIGN?: string;

    EMPLOYMENT_DETAIL: string = ' ';
    EMPLOYMENT_COMPANY:string = '';
    EMPLOYMENT_DESIGNATION: string = '';


    PROPRIETOR_DETAILS: string = ' ';

    BUSINESS_DETAIL: string = ' ';

}
