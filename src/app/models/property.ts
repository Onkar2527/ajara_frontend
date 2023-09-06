export class Property {
    ID!:number;
    APPLICANT_ID?:number;
    APPLICANT_NO?:number;

    IS_FOUR_WHEELER:boolean = false;
    IS_TWO_WHEELER:boolean = false;
    IS_HOME_THEATER:boolean = false;
    IS_AC:boolean = false;
    IS_DIGITAL_CAMERA:boolean = false;
    IS_VIDEO_PLAYER:boolean = false;
    IS_MICROWAVE:boolean = false;
    IS_LCD_TV:boolean = false;
    IS_COMPUTER:boolean = false;
    IS_WASHING_MACHINE:boolean = false;

    FOUR_WHEELER_MODEL:string = '';

    HOUSE_DETAIL : "A"|"B"|"C"= 'A';
}
