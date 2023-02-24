export class TermDeposite {
    ID?:number;
    APPLICANT_ID?:number;
    ACCOUNT_TYPE?:string = 'S';
    DEPOSIT_AMOUNT?:number;
    DEPOSIT_FREQUANCY:string = 'O';
    RATE_OF_INTEREST?:number;
    TANURE_YEARS ? :number;
    TANURE_MONTHS ? :number;
    TANURE_DAYS ? :number;
    INTEREST_PAYOUT:string='M';
    MODE_OF_INTEREST_PAYOUT:string = 'S';
    AUTO_RENEWAL:boolean = false;

    DEPOSIT_BANK_NAME:string = '';
    DEPOSIT_BRANCH_NAME:string = '';
    DEPOSIT_IFSC_CODE:string = '';
    DEPOSIT_ACCOUNT_NUMBER:string = '';

    TDS:string = 'T'
    
    MATURITY_DATE ? :string
    MATURITY_AMOUNT ? :string
    

}
