import { Component, OnInit } from '@angular/core';
import { ExtraInfo } from 'src/app/models/extra-info';

@Component({
  selector: 'app-verifier-verification',
  templateUrl: './verifier-verification.component.html',
  styleUrls: ['./verifier-verification.component.css']
})
export class VerifierVerificationComponent implements OnInit {

  APPLICAT_ID!:number;
  TableLoading:boolean = false;
  Tabs:ExtraInfo[] = []
  
  constructor() { }

  ngOnInit(): void {
  }

}
