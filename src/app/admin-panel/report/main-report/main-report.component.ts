import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-main-report',
  templateUrl: './main-report.component.html',
  styleUrls: ['./main-report.component.css']
})
// export class MainReportComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

export class MainReportComponent implements OnInit, OnChanges {

  reportData: any[] = [];
  allReportData: any[] = []; // Store raw data for client-side filtering
  loading = false;
  @Input() reportId: number | null = null;

  // Filter Models
  filterBranch: any = null;
  filterStage: any = null;
  filterDateRange: Date[] = [];

  // Master Lists
  branchList: any[] = [];
  stageList: any[] = [];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadMasters();
  }

  loadMasters() {
    // Load Branches
    this.api.getAllBranch().subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.branchList = res.data;
        }
      }
    });

    // Load Stages (Status List)
    this.api.getStatusList().subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.stageList = res.data;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportId'] && this.reportId !== null && this.reportId !== undefined) {
      this.loadReport();
    }
  }

  loadReport() {
    this.loading = true;
    this.reportData = []; // Clear previous data

    console.log('Loading report for ID:', this.reportId);

    this.api.getStageWiseReport(this.reportId).subscribe({
      next: (res) => {
        console.log('MainReportComponent: API Response:', res);
        if (res.code === 200 || res.code === '200') {
          // Normalize data structure (handle both uppercase and lowercase keys if needed)
          const rawData = res.data || [];
          const normalizedData = (Array.isArray(rawData) ? rawData : []).map((item: any) => {
            const normalizedItem: any = {};
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                normalizedItem[key.toUpperCase()] = item[key];
              }
            }
            return normalizedItem;
          });

          this.allReportData = normalizedData;
          this.applyFilter(); // Initial filter apply
          this.cdr.detectChanges(); // Force UI update

          console.log('Processed (normalized) reportData:', this.allReportData);
        } else {
          console.error('API returned non-200 code:', res.code);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('getStageWiseReport error:', err);
        this.loading = false;
      }
    });
  }

  applyFilter() {
    let filtered = [...this.allReportData];

    if (this.filterBranch) {
      filtered = filtered.filter(item => item.BRANCH_NAME === this.filterBranch);
    }

    if (this.filterStage) {
      filtered = filtered.filter(item => item.STAGE_NAME === this.filterStage);
    }

    if (this.filterDateRange && this.filterDateRange.length === 2) {
      const start = new Date(this.filterDateRange[0]);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.filterDateRange[1]);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.FILLED_DATE_TIME);
        return itemDate >= start && itemDate <= end;
      });
    }

    this.reportData = filtered;
    this.cdr.detectChanges();
  }

  resetFilter() {
    this.filterBranch = null;
    this.filterStage = null;
    this.filterDateRange = [];
    this.applyFilter();
  }

  exportToExcel() {
    if (this.reportData.length === 0) return;

    const exportData = this.reportData.map((item, index) => ({
      "Sr No": index + 1,
      "Branch": item.BRANCH_NAME,
      "Account No": item.ACCOUNT_NUMBER,
      "Applicant Name": `${item.PRIMARY_APPLICANT_FIRST_NAME || ''} ${item.PRIMARY_APPLICANT_MIDDLE_NAME || ''} ${item.PRIMARY_APPLICANT_LAST_NAME || ''}`,
      "Account Type": item.ACCOUNT_TYPE,
      "Stage": item.STAGE_NAME,
      "Date": item.FILLED_DATE_TIME
    }));

    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Stage Wise Report');
    // XLSX.writeFile(wb, `Stage_Wise_Report_${new Date().getTime()}.xlsx`);
  }

  exportToPdf() {
    if (this.reportData.length === 0) return;

    const element = document.getElementById('report-table-to-export');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `Stage_Wise_Report_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // html2pdf().from(element).set(opt).save();
  }

}
