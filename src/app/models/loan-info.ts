export class LoanInfo {
    ID!: number;
    APPLICANT_ID?: number;
    APPLICANT_NO?: number;

    IS_VEHICLE_LOAN: boolean = false;
    IS_HOME_LOAN: boolean = false;
    IS_CONSUMER_LOAN: boolean = false;
    IS_BUSINESS_LOAN: boolean = false;
    IS_INSURANCE_LOAN: boolean = false;
    IS_TOUR_LOAN: boolean = false;
    IS_EDUCATION_LOAN: boolean = false;


    IS_VEHICLE_LOAN_YEAR:       string = '1';
    IS_HOME_LOAN_YEAR:          string = '1';
    IS_CONSUMER_LOAN_YEAR:      string = '1';
    IS_BUSINESS_LOAN_YEAR:      string = '1';
    IS_INSURANCE_LOAN_YEAR:     string = '1';
    IS_TOUR_LOAN_YEAR:          string = '1';
    IS_EDUCATION_LOAN_YEAR:     string = '1';


    IS_VEHICLE_LOAN_REQUIRED: boolean = false;
    IS_HOME_LOAN_REQUIRED: boolean = false;
    IS_CONSUMER_LOAN_REQUIRED: boolean = false;
    IS_BUSINESS_LOAN_REQUIRED: boolean = false;
    IS_INSURANCE_LOAN_REQUIRED: boolean = false;
    IS_TOUR_LOAN_REQUIRED: boolean = false;
    IS_EDUCATION_LOAN_REQUIRED: boolean = false;

}
