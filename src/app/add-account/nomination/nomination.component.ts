import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-nomination',
  templateUrl: './nomination.component.html',
  styleUrls: ['./nomination.component.css']
})
export class NominationComponent implements OnInit {

  constructor(private api: ApiService, private message: NzNotificationService) { }

  nomineeInfo:NomineeDetails = new NomineeDetails();
  ngOnInit(): void {
  }
  
  save(){
    let nominee:Subject<any> = new Subject();
    this.api.addNominee(this.nomineeInfo).subscribe({
           next:(res)=>{
               if(res.code==200){
                   this.message.success("Nominee Information added successfully!",'');
                   nominee.next(res);
               }
               else{
                   this.message.error('Failed to add Nominee info','');
                   nominee.next(res);
               }
           },
           error:(err)=>{
               this.message.error("Internal Server Error!",err);
               nominee.error('err')
           },
           complete:()=>{
              console.info("Add Nominee Info Request Completed!");
              nominee.complete();
           }
       })
       return nominee;
   }
}
