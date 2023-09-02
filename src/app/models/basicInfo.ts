
export class BasicInfo {

    ID!: number;
    APPLICANT_ID?: number;
    STATUS: string = 'D';

    NO_OF_APPLICANT: number = 1;

    CUSTOMER_TYPE_1: "Mr." | "Mrs." | "Miss." | "Mast." | "Smt." | "M/s." | "Mx." = 'Mr.'
    PRIMARY_APPLICANT_FIRST_NAME: string = '';
    PRIMARY_APPLICANT_MIDDLE_NAME: string = '';
    PRIMARY_APPLICANT_LAST_NAME: string = '';
    AADHAAR_NUMBER: string = '';
    PAN_NUMBER: string = '';
    CUSTOMER_ID_1: string = '';
    CKYC_NUMBER_1: string = ''

    CUSTOMER_TYPE_2: "Mr." | "Mrs." | "Miss." | "Mast." | "Smt." | "M/s." | "Mx." = 'Mr.'
    APPLICANT2_FIRST_NAME: string = '';
    APPLICANT2_MIDDLE_NAME: string = '';
    APPLICANT2_LAST_NAME: string = '';
    AADHAAR_NUMBER2: string = '';
    PAN_NUMBER2: string = '';
    CUSTOMER_ID_2: string = '';
    CKYC_NUMBER_2: string = ''

    IS_OLD_CUSTOMER_1: boolean = false;

    IS_OLD_CUSTOMER_2: boolean = false;


    // ACCOUNT_TYPE: 'S' | 'F' | 'R' | 'P' = 'S';

    // ACCOUNT_OPERATION: "S" | "E" | "A" | "F" | "J" | "O" = 'S';

    // AADHAAR_NUMBER3: string = '';
    // PAN_NUMBER3: string = '';
    // AADHAAR_NUMBER4: string = '';
    // PAN_NUMBER4: string = '';


    // APPLICANT3_FIRST_NAME: string = '';
    // APPLICANT3_MIDDLE_NAME: string = '';
    // APPLICANT3_LAST_NAME: string = '';

    // APPLICANT4_FIRST_NAME: string = '';
    // APPLICANT4_MIDDLE_NAME: string = '';
    // APPLICANT4_LAST_NAME: string = '';

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


}
