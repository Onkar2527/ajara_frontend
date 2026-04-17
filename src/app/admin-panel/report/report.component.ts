import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
// export class ReportComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
export class ReportComponent implements OnInit {

  //  reportList: any[] = [];
  // loading = false;

  constructor(
    private api: ApiService
  ) { }





  reportList: any[] = [];
  loading = false;

  isDrawerVisible = false;
  selectedReportId: number | null = null;
  selectedReport: any = null;

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;

    this.api.getAllReports().subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.reportList = res.data;
          console.log('Available Reports in List:', this.reportList);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  closeDrawer() {
    this.isDrawerVisible = false;
    this.selectedReportId = null;
    this.selectedReport = null;
    console.log('Drawer Closed. selectedReportId reset to null.');
  }

  openReport(report: any) {
    console.log('Clicked report object:', report);

    this.selectedReport = report;
    this.selectedReportId = report.ID;
    this.isDrawerVisible = true;

    console.log('selectedReportId:', this.selectedReportId);
    console.log('Drawer Open:', this.isDrawerVisible);
  }


  // openReport(report: any) {
  //   this.router.navigate(['/report-view'], {
  //     queryParams: { key: report.REPORT_KEY }
  //   });
  // }




}