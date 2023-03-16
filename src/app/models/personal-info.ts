export class PersonalInfo {
    ID!: number;
    APPLICANT_ID!: number;

    FIRST_NAME: string = '';
    MIDDLE_NAME: string = '';
    LAST_NAME: string = '';
    FATHER_OR_HUSBAND_NAME: string = '';

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

    WORK: string = 'P';
    ESTABLISHMENT: string = 'B';
    RELIGION: string = 'H';
    CAST: string = 'O';

    MARITAL_STATUS: string = 'M'

    FAMILY_COUNT!: number;

    EDUCATION: string = 'T';

    IS_INSURED: boolean = false;

    INSURANCE_YEAR!: number;

    POLICY_TYPE: string = '';
    INSURANCE_COMPANY: string = '';

    AADHAAR_NUMBER:string = '';

    BLOOD_TYPE:string = '';

    EMPLOYMENT_DETAIL:string = '';
    EMPLOYMENT_DESIGNATION:string = '';

    SELF_EMPLOYMENT_DETAIL:string = '';

    BUSINESS_DETAIL:string = '';

}
