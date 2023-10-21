export class Table {
  DROPDOWN_LIST: TableData[] = [];
  LOADING: boolean = false;
  TOTAL_RECORDS!: number;
  PAGE_INDEX: number = 1;
  PAGE_SIZE: number = 10;
}

export class TableData {
  ID!: number;
  NAME!: string;
  TABLE_NAME!: string;
  FIELDS: DropdownTableFields[] = [];
  DROPDOWN_DATA:any = [];
}

export class DropdownTableFields {
  ID!: number;
  FIELD_NAME!: string;
  FIELD_TYPE!: string;
  TABLE_NAME!:string;
}

export class Drawer {
  VISIBILITY: boolean = false;
  TITLE: string = '';
  CLOSE() {
      this.VISIBILITY = false;
  }
  OPEN() {
      this.VISIBILITY = true;
  }
}

