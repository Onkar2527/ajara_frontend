import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { ImageData } from '../../models/image-data';

@Component({
  selector: 'app-web-cam',
  templateUrl: './web-cam.component.html',
  styleUrls: ['./web-cam.component.css']
})
export class WebCamComponent implements OnInit {
  Drawervisible: boolean = false;
  showCamera: boolean = false;
  showImage: boolean = false;
  ApplicantData: ImageData[] = [];
  ImageData: ImageData = new ImageData();
  @Input() APPLICANT_ID!:number;
  constructor(private api: ApiService, private message: NzNotificationService) { }

  getApplicant(){
    this.api.getAllApplicantPhoto(this.APPLICANT_ID).subscribe({
      next:(res)=>{
        if(res['code']==200){
          this.ApplicantData = res['data'];
        }
      }
    })
  }

  takePicture(applicant: ImageData) {
    this.ImageData = applicant;
    if (applicant.IMAGE_DATA) {
      this.showCamera = false;
      this.showImage = true;
    }

    else {
      this.showImage = false;
      this.showCamera = true;
    }
    this.Drawervisible = true;

  }

  close() {
    this.Drawervisible = false;
    this.showCamera = false;
  }
  reCapture() {
    this.showCamera = true;
    this.ImageData.IMAGE_DATA = ''
    this.showImage = false;
  }

  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage!: WebcamImage;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  public ngOnInit(): void {
    if(this.APPLICANT_ID){
      this.getApplicant();
    }

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.showCamera = false;
    this.showImage = true;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.ImageData.IMAGE_DATA = webcamImage.imageAsDataUrl;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }


  save() {
    this.api.postImageFile(this.ImageData).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success("Image uploaded successfully", '');
          this.close();
        }

      }
    });
  }

}
