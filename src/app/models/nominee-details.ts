export class NomineeDetails {
    ID?: number;
    APPLICANT_ID?: number;
    IS_MINOR: boolean = false;
    DOB: string = '';

    NOMINEE_NAME: string = ''
    RELATION:'A'|'B'|'C'|'D'|'E'|'F'|'G' | 'H' | 'I' | 'J' = 'A'
  
    NOMINEE_ADDRESS: string = ''
    NOMINEE_AGE: number = 0

    APONITED_NAME: string = ''
    APONITED_ADDRESS: string = ''
}
