export class TermDeposite {
    ID?: number;
    APPLICANT_ID?: number;

    ACCOUNT_TYPE: "A" | "B" | "C" | "D" | "E " | "F" | "G" | "H" = "A";
    ACCOUNT_OPERATION: "A" | "B" | "C" | "D" | "E " | "F" | "G" | "H" = "A";

    INITIAL_AMOUNT!: number;
    MODE_OF_PAYMENT: string = 'C';
    TRANSFER_ACCOUNT_NO: string = '';
    CHAQUE_NO: string = '';
    // DRAWN_BANK: string = '';
    CHEQUE_BANK_NAME:string = ''
    CHEQUE_BRANCH_NAME:string = ''
    TRANSFER_DATE: string = '';

    DEPOSIT_AMOUNT?: number;
    DEPOSIT_FREQUANCY: string = 'O';
    RATE_OF_INTEREST?: number;
    TANURE_YEARS?: number;
    TANURE_MONTHS?: number;
    TANURE_DAYS?: number;
    INTEREST_PAYOUT: "M" | "Q" | "H" | "Y" | "O" = 'M';
    MODE_OF_INTEREST_PAYOUT: string = 'S';
    AUTO_RENEWAL: boolean = false;

    DEPOSIT_BANK_NAME: string = '';
    DEPOSIT_BRANCH_NAME: string = '';
    DEPOSIT_IFSC_CODE: string = '';
    DEPOSIT_ACCOUNT_NUMBER: string = '';

    TDS: string = 'T'

    MATURITY_DATE?: string
    MATURITY_AMOUNT?: string

}
