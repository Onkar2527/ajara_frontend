export class NomineeDetails {
    ID?: number;
    APPLICANT_ID?: number;
    IS_MINOR: boolean = false;
    DOB: string = '';

    NOMINEE_NAME: string = ''
    RELATION:'Father'|'Mother'|'Brother'|'Sister'|'Son'|'Daughter'|'Husband' | 'Wife' = 'Father'
  
    NOMINEE_ADDRESS: string = ''
    NOMINEE_AGE: number = 0

    APONITED_NAME: string = ''
    APONITED_ADDRESS: string = ''
}
