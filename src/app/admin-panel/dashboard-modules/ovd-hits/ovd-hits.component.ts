import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-ovd-hits',
  templateUrl: './ovd-hits.component.html',
  styleUrls: ['./ovd-hits.component.css']
})
export class OvdHitsComponent implements OnInit {

  SELECTED_BRANCH: string = 'AL';
  BRANCH_LIST = <any>[]

  REMAINING_AMOUNT: number = 0;

  TOTAL_SPENDING: number = 0;
  TOTAL_HITS: number = 0;

  Aadhaar: Hits = new Hits();
  PAN: Hits = new Hits();
  VID: Hits = new Hits();
  License: Hits = new Hits();
  Passport: Hits = new Hits();

  loading: boolean = true;

  ROLE_ID!: number;
  BRANCH_ID!: number;


  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getAllBranches();
    // this.chechSufBalance();

    this.ROLE_ID = Number(sessionStorage.getItem("ROLE_ID"));
    this.BRANCH_ID = Number(sessionStorage.getItem("BRANCH_ID"));

    if (this.ROLE_ID == 3 || this.ROLE_ID == 4) {
      this.getHitHistory(this.SELECTED_BRANCH);
    }
    else {
      this.getHitHistory(this.BRANCH_ID);
    }
  }

  async getAllBranches() {
    this.loading = true;
    let res = await lastValueFrom(this.api.getAllBranch());

    if (res['code'] == 200) {
      this.BRANCH_LIST = res['data'];
    }
    this.loading = false;
  }

  async getHitHistory(branch: any) {
    this.loading = true;
    let res = await lastValueFrom(this.api.getHitHistory(branch))

    if (res['code'] == 200) {
      this.REMAINING_AMOUNT = res['BALANCE'];
      this.TOTAL_HITS = res['TOTAL_HITS'];
      this.TOTAL_SPENDING = res['TOTAL_DEDUCTION'];

      this.Aadhaar = res['AADHAAR'];
      this.PAN = res['PAN'];
      this.VID = res['VID'];
      this.License = res['LICENSE'];
      this.Passport = res['PASSPORT'];
      // "BALANCE": rem_balance,
      // "AADHAAR": { "amount": aadhaar.amount, "hitCount": aadhaar.hits },
      // "PAN": { "amount": PAN.amount, "hitCount": PAN.hits },
      // "VID": { "amount": VID.amount, "hitCount": VID.hits },
      // "LICENSE": { "amount": license.amount, "hitCount": license.hits },
      // "PASSPORT": { "amount": passport.amount, "hitCount": passport.hits },
      // "TOTAL_HITS": total_hits,
      // "TOTAL_DEDUCTION": total_deduction
    }
    this.loading = false;
  }

  chechSufBalance() {
    let res = lastValueFrom(this.api.checkSufBal(1));

    console.log(res);
  }

}

class Hits {
  amount: number = 0;
  hitCount: number = 0;
}
