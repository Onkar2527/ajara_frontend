import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  radioValue = 'S';
  deposit = 'O';
  intPayout = 'M';
  payoutMode = 'S';
  tds = 'T';

  constructor() { }

  ngOnInit(): void {
  }

}
