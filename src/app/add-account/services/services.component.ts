import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  //checkOptionsOne is a temprary veriable (leter use much better alternative)
  checkOptionsOne=[
    { label: 'Cheque Book', value: 'C'},
    { label: 'Passbook', value: 'P'},
    { label: 'Statement By Email', value: 'S' },
    { label: 'SMS Alerts', value: 'SMS' },
    { label: 'Debit Cum ATM Card', value: 'D' },
    { label: 'Consent to communicate new products', value: 'N' },
    { label: 'Add on  Card', value: 'A' },
  ]

  indeterminate = true;
  allChecked = false;
  updateAllChecked(){
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
