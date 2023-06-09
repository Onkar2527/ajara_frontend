export class Documents {
    ID!:number;
    APPLICANT_ID!:number;
    APPLICANT_NO!:number;
    DOCUMENT_NAME!:string; 
    IMAGE_DATA:any = '';
    FILE_TYPE:string = '';
    CHECKER_REMARK:string = '';
    MAKER_REMARK:string = '';
    VERIFIER_REMARK:string = '';
    IS_APPROVED_CHECKER:boolean = false;
    IS_APPROVED_VERIFIER:boolean = false;
    REFILL_COUNT!:number;
}
