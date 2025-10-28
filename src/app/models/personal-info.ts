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
    CURRENT_CITY: any
    CURRENT_TALUKA:any
    CURRENT_DISTRICT: any
    CURRENT_LANDMARK:string = '';
    CURRENT_STATE: any
    CURRENT_PINCODE: string = '';

    PERMANENT_ADDRESS: string = '';
    PERMANENT_CITY: any;
    PERMANENT_TALUKA: any;
    PERMANENT_DISTRICT:any;
    PERMANENT_LANDMARK: string = '';
    PERMANENT_STATE: any;
    PERMANENT_PINCODE: string = '';

    OFFICE_ADDRESS: string = '';
    OFFICE_CITY: any
    OFFICE_TALUKA:any
    OFFICE_DISTRICT: any
    OFFICE_LANDMARK:string = '';
    OFFICE_STATE: any
    OFFICE_PINCODE: string = '';
    OFFICE_AREA:any;

    // HOUSE_PHONE: string = '';
    // OFFICE_PHONE: string = '';

    EMAIL_ID: string = '';
    IS_EMAIL_VERIFIED: boolean = false;


    RISK_CATEGORY!: "A" | "B" | "C";

    MOBILE_NUMBER: string = '';
    MOBILE_NUMBER_2: string = '';

    WORK!: "E" | "S" | "B" | "R" | "T" | "H" | "O";
    ESTABLISHMENT: string = ' ';

    RELIGION!: "A" | "B" | "C" | "D" | "E" | "F" | "G";
    OTHER_RELIGION: string = '';

    CASTE!: "A" | "B" | "C" | "D" | "E" | "F" | "G";
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

    EMPLOYMENT_DETAIL!: "P" | "E" | "C" | "M" | "J" | "O" | " ";

    EMPLOYMENT_COMPANY: string = '';
    EMPLOYMENT_DESIGNATION: string = '';


    PROPRIETOR_DETAILS: string = ' ';

    BUSINESS_DETAIL: string = ' ';

    MOTHERS_NAME: string = '';
    MOTHERS_MIDDLE_NAME: string = '';
    MOTHERS_LAST_NAME: string = '';

    PAN_NO: string = '';
    NATIONALITY: string = 'A';
    DATE_OF_BIRTH: string = '';
    GENDER: "M" | "F" | "T" = "M";

   
    IS_DOB_MISMATCH: boolean = false;
    IS_VERNACULAR: boolean = false;



    IS_MINOR: boolean = false;
    GUARDIAN_NAME: string = '';
    GUARDIAN_PAN: string = '';
    GUARDIAN_RELATION!: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
    GUARDIAN_OTHER_DOCUMENT: string = ''; //dropdown
    GUARDIAN_OTHER_DOCUMENT_NUMBER: string = '';
    MINOR_DATE_OF_BIRTH_PROOF: string = ''; //dropdown


    PROFESSION!: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | ' ';
    NATURE_OF_SERVICE!: 'A' | 'B' | ' ';
    SELF_EMPLOYED!: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'H' | 'G' | ' ';
    NATURE_OF_BUSINESS!: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | ' ';
    SOURCE_OF_FUNDS!: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | ' ';


    DRIVING_LICENSE_NO: string = '';
    VOTER_ID: string = '';
    PASSPORT_NO: string = '';
    

    OVD_DOC: string = '';
    OVD_DOC_NO:string = '';

    IS_CURRENT_ADDRESS_ON_OVD: boolean = false;
    ADDRESS_DOCUMENT: string = '';
    ADDRESS_DOCUMENT_NUMBER: string = '';

    PERMANENT_ADDRESS_PROOF:string = '';
    CURRUNT_ADDRESS_PROOF:string = '';

    CONSTITUTION:string = '';

    ID_PROOF:string = '';
    ID_PROOF_NUMBER:string = '';
    CURRENT_ADDRESS_PROOF_NUMBER:string = '';
    PERMANENT_ADDRESS_PROOF_NUMBER:string = '';
    CURRENT_AREA:any;
    PERMANENT_AREA:any;
    FATHER_OR_SPOUSE:string = 'F';


    //new fields
    MOTHER_TITLE:string = '';
    FATHER_TITLE:string = '';


    NAME:string = '';
    ADDHAR:number=0;
    MOBILE_NO :number=0;
    
}