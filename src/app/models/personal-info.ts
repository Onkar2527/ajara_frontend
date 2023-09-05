export class PersonalInfo {
    ID!: number;
    APPLICANT_ID!: number;
    APPLICANT_NO!: number;

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

    // HOUSE_PHONE: string = '';
    // OFFICE_PHONE: string = '';

    EMAIL_ID: string = '';
    IS_EMAIL_VERIFIED: boolean = false;



    MOBILE_NUMBER: string = '';
    MOBILE_NUMBER_2: string = '';

    WORK: "E" | "S" | "B" | "R" | "T" | "H" | "O" = 'E';
    ESTABLISHMENT: string = ' ';

    RELIGION: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" = 'A';
    OTHER_RELIGION: string = '';

    CASTE: "A" | "B" | "C" | "D" | "E" | "F" | "G" = 'A';
    OTHER_CASTE: string = '';

    MARITAL_STATUS: "M" | "U" = 'M'

    FAMILY_COUNT!: number;

    EDUCATION: "S" | "H" | "D" | "G" | "P" | "O" = 'S';

    IS_INSURED: boolean = false;

    INSURANCE_YEAR!: number;

    POLICY_TYPE: string = '';
    INSURANCE_COMPANY: string = '';

    AADHAAR_NUMBER: string = '';

    BLOOD_TYPE: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" = 'A';
    // BLOOD_TYPE_SIGN?: string;

    EMPLOYMENT_DETAIL: "P" | "E" | "C" | "M" | "J" | "O" | " " = ' ';

    EMPLOYMENT_COMPANY: string = '';
    EMPLOYMENT_DESIGNATION: string = '';


    PROPRIETOR_DETAILS: string = ' ';

    BUSINESS_DETAIL: string = ' ';

    MOTHERS_NAME: string = '';
    MOTHERS_MIDDLE_NAME: string = '';
    MOTHERS_LAST_NAME: string = '';

    PAN_NO: string = '';
    NATIONALITY: string = '';
    DATE_OF_BIRTH: string = '';
    GENDER: "M" | "F" | "O" = 'M';

    IS_CURRENT_ADDRESS_ON_OVD: boolean = false;
    ADDRESS_DOCUMENT: string = '';
    ADDRESS_DOCUMENT_NUMBER: string = '';
    IS_DOB_MISMATCH: boolean = false;
    IS_VERNACULAR: boolean = false;

}
