
export class BasicInfo {
    [key: string]: any;

    ID!: number;
    APPLICANT_ID?: number;

    NO_OF_APPLICANT: number = 1;

    CUSTOMER_TYPE_1: string = ''
    PRIMARY_APPLICANT_FIRST_NAME: string = '';
    PRIMARY_APPLICANT_MIDDLE_NAME: string = '';
    PRIMARY_APPLICANT_LAST_NAME: string = '';
    // AADHAAR_NUMBER: string = '';
    PAN_NUMBER: string = '';
    CUSTOMER_ID_1: string = '';
    CKYC_NUMBER_1: string = '';
    VOTER_ID_1: string = '';
    LICENSE_NO_1: string = '';

    CUSTOMER_TYPE_2: "A" | "B" | "C" | "D" | "E" | "F" | "G" = 'A'
    APPLICANT2_FIRST_NAME: string = '';
    APPLICANT2_MIDDLE_NAME: string = '';
    APPLICANT2_LAST_NAME: string = '';
    // AADHAAR_NUMBER2: string = '';
    PAN_NUMBER2: string = '';
    CUSTOMER_ID_2: string = '';
    CKYC_NUMBER_2: string = '';
    VOTER_ID_2: string = '';
    LICENSE_NO_2: string = '';

    IS_OLD_CUSTOMER_1: boolean = false;

    IS_OLD_CUSTOMER_2: boolean = false;

    AADHAAR_NO_1: string = '';
    AADHAAR_NO_2: string = '';

    APPLICANT3_FIRST_NAME: string = '';
    APPLICANT3_MIDDLE_NAME: string = '';
    APPLICANT3_LAST_NAME: string = '';
    AADHAAR_NUMBER3: string = '';
    PAN_NUMBER3: string = '';

    //new field
    IS_OLD_CUSTOMER_3: boolean = false;
    CUSTOMER_ID_3: string = '';
    CKYC_NUMBER_3: string = '';
    VOTER_ID_3: string = '';
    LICENSE_NO_3: string = '';
    CUSTOMER_TYPE_3: "A" | "B" | "C" | "D" | "E" | "F" | "G" = 'A'

    APPLICANT4_FIRST_NAME: string = '';
    APPLICANT4_MIDDLE_NAME: string = '';
    APPLICANT4_LAST_NAME: string = '';
    AADHAAR_NUMBER4: string = '';
    PAN_NUMBER4: string = '';

    //new field
    IS_OLD_CUSTOMER_4: boolean = false;
    CUSTOMER_ID_4: string = '';
    CKYC_NUMBER_4: string = '';
    VOTER_ID_4: string = '';
    LICENSE_NO_4: string = '';
    CUSTOMER_TYPE_4: "A" | "B" | "C" | "D" | "E" | "F" | "G" = 'A'

    APPLICATION_DATE: string = '';

    CREATED_BRANCH_ID?: number;

    MAKER_USER_ID?: number;
    CHACKER_USER_ID?: number;
    VERIFIER_USER_ID?: number | null;

    TRACK_ID?: number;

    ROLE_ID?: number;


    FILLED_DATE_TIME: string = '';
    VERIFIED_DATE_TIME: string = '';

    DOB_1: string = '';
    GENDER_1: "M" | "F" | "O" = "M";
    MOBILE_1: string = '';
    AGE_1!: number;

    DOB_2: string = '';
    GENDER_2: "M" | "F" | "O" = "M";
    MOBILE_2: string = '';
    AGE_2!: number;



    DOB_3: string = '';
    GENDER_3: "M" | "F" | "O" = "M";
    MOBILE_3: string = '';
    AGE_3!: number;



    DOB_4: string = '';
    GENDER_4: "M" | "F" | "O" = "M";
    MOBILE_4: string = '';
    AGE_4!: number;


    OTP_AUTH_1: 'A' | 'B' | 'C' = 'C'
    OTP_AUTH_2: 'A' | 'B' | 'C' = 'C'

    ACCOUNT_NUMBER: string = '';

    // new fields
    DOCUMENTS_AUTHORITY: string = 'Government of India'
    DOCUMENTS_ISSUE_PLACE: string = ''

    IS_AADHAAR_DBT: boolean = false;

    NO_OF_APPLICANT_JOINT: number = 1;   // by default ek applicant
    IS_JOINT: boolean = false;
    NO_OF_JOINT: number = 0;

    // ACCOUNT_TYPE: 'S' | 'F' | 'R' | 'P' = 'S';
    ACCOUNT_TYPE: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" = "A";

    // ACCOUNT_OPERATION: "S" | "E" | "A" | "F" | "J" | "O" = 'S';

    // AADHAAR_NUMBER3: string = '';
    // PAN_NUMBER3: string = '';
    // AADHAAR_NUMBER4: string = '';
    // PAN_NUMBER4: string = '';




    // IS_MINOR: boolean = false
    // MINOR_DOB: string = '';

    // GUARDIAN_NAME: string = '';
    // RELATION_WITH_MINOR: "F" | "M" | "C" | "O" = "F"
    // GUARDIAN_DOB: any

    // IS_INTRODUCED: boolean = false;
    // E_CUSTOMER_NAME: string = '';
    // E_CUSTOMER_ID: string = '';
    // E_ACCOUNT_NUMBER: string = '';
    // E_YEARS?: number;

    // changeMinor() {
    //     if (this.IS_MINOR) {
    //         this.IS_MINOR = false;
    //     }
    //     else if (!this.IS_MINOR) {
    //         this.IS_MINOR = true
    //     }

    // }

    // constructor() {
    //     this.NO_OF_APPLICANT = 1;
    // }



    NAME:string = '';
    ADDHAR:number=0;
    MOBILE_NO :number=0;

}
