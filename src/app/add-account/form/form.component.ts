import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Facilities } from 'src/app/models/facilities';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { Personal } from 'src/app/models/personal';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  personalInfo: Personal = new Personal();
  depositInfo: TermDeposite = new TermDeposite();
  serviceInfo: Facilities = new Facilities();
  nominationInfo: NomineeDetails = new NomineeDetails();

  constructor(private api: ApiService, private message: NzNotificationService) { }
  APPLICANT_ID?: number;
  ngOnInit(): void {
  }
  pdfSrc = '../../../assets/FACO Adobe Form.pdf'

  getAllData() {
    let personal = this.getPersonal();
    let deposit = this.getDeposit();
    let service = this.getService();
    let nominee = this.getNominee();

    personal.subscribe({
      next: (res) => {
        if (res == 200) {
          deposit.subscribe({
            next: (res1) => {
              if (res1 == 200) {
                service.subscribe({
                  next: (res2) => {
                    if (res2 == 200) {
                      nominee.subscribe({
                        next: (res3) => {
                          if (res3 == 200) {
                           
                          }
                          else {
                            this.message.error('Something went wrong!', '');
                          }
                        },
                        error: () => {
                          this.message.error('Something went wrong!', '');
                        }
                      })
                    }
                    else {
                      this.message.error('Something went wrong!', '');
                    }
                  },
                  error: () => {
                    this.message.error('Something went wrong!', '');
                  }
                })
              }
              else {
                this.message.error('Something went wrong!', '');
              }
            },
            error: () => {
              this.message.error('Something went wrong!', '');
            }
          })
        }
        else {
          this.message.error('Something went wrong!', '');
        }
      },
      error: () => {
        this.message.error('Something went wrong!', '');
      }
    })
  }

  getPersonal() {
    let personal: Subject<any> = new Subject();
    this.api.getPersonal(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.personalInfo = res['data'][0];
          personal.next(200);
        }
        else {
          personal.next(res);
        }
      },
      error: (err) => {
        personal.error(err);
      },
      complete: () => {
        personal.complete();
      }
    });
    return personal;
  }

  getDeposit() {
    let deposit: Subject<any> = new Subject();
    this.api.getDeposite(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.depositInfo = res['data'][0];
          deposit.next(200);
        }
        else {
          deposit.next(res);
        }
      },
      error: (err) => {
        deposit.error(err);
      },
      complete: () => {
        deposit.complete();
      }
    });
    return deposit;
  }

  getService() {
    let service: Subject<any> = new Subject();
    this.api.getService(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.serviceInfo = res['data'][0];
          service.next(200);
        }
        else {
          service.next(res);
        }
      },
      error: (err) => {
        service.error(err);
      },
      complete: () => {
        service.complete();
      }
    });
    return service;
  }
  getNominee() {
    let nominee: Subject<any> = new Subject();
    this.api.getNominee(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.serviceInfo = res['data'][0];
          nominee.next(200);
        }
        else {
          nominee.next(res);
        }
      },
      error: (err) => {
        nominee.error(err);
      },
      complete: () => {
        nominee.complete();
      }
    });
    return nominee;
  }
}
