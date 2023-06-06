import { Component, Input, OnInit } from '@angular/core';
import { ExtraInfo } from 'src/app/models/extra-info';

@Component({
  selector: 'app-checker-verification',
  templateUrl: './checker-verification.component.html',
  styleUrls: ['./checker-verification.component.css']
})
export class CheckerVerificationComponent implements OnInit {

  APPLICAT_ID!:number;
  TableLoading:boolean = false;
  Tabs:ExtraInfo[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
