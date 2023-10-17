export class ExtraInfo {
    ID!: number;
    APPLICANT_ID!: number;
    TAB_NAME!: string;
    IS_PROVIDED: boolean = false;
    IS_CHECKED: boolean = false;
    IS_VERIFIED: boolean = false;
    SEND_TO_REFILL: boolean = false;
    disabled:boolean = true;
    INDEX!:number;
    TAB_ID!:number;
    SEND_TO_REFILL_COUNT!:number;
    CHECKER_REMARK:string = '';
    MAKER_REMARK:string = '';
    VERIFIER_REMARK:string = '';
    REFILL_BY!:number;
}

