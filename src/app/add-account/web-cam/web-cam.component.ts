import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { ImageData } from '../../models/image-data';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { Documents } from 'src/app/models/documents';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BasicInfo } from 'src/app/models/basicInfo';

@Component({
  selector: 'app-web-cam',
  templateUrl: './web-cam.component.html',
  styleUrls: ['./web-cam.component.css']
})
export class WebCamComponent implements OnInit {

  @ViewChild('webCamDrawerTemp', { static: false }) webCamDrawerTemp?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

  @ViewChild('documentAddTpl', { static: false }) documentAddTpl?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

  @ViewChild('documentShowTpl', { static: false }) documentShowTpl?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

  @ViewChild('DocumentFooter', { static: false }) DocumentFooter?: TemplateRef<{}>;

  @ViewChild('DocumentHeader', { static: false }) DocumentHeader?: TemplateRef<{}>;

  @ViewChild('SendToRefillFooter', { static: false }) SendToRefillFooter?: TemplateRef<{}>;


  fileList1: NzUploadFile[] = []
  showCamera: boolean = false;
  showImage: boolean = false;
  ApplicantData: ImageData[] = [];
  ImageData: Documents = new Documents();
  @Input() APPLICANT_ID!: number;
  @Input() basicInfo!: BasicInfo;
  ROLE_ID!: number;
  constructor(private api: ApiService, private message: NzNotificationService, private drawerService: NzDrawerService) { }



  public ngOnInit(): void {

    this.ROLE_ID = Number(sessionStorage.getItem('ROLE_ID'));


    if (this.APPLICANT_ID) {
      this.getApplicant();
    }

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  getApplicant() {
    this.api.getAllApplicantPhoto(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.ApplicantData = res['data'];
        }
      }
    })
  }

  takePicture(applicant: Documents) {
    this.ImageData = applicant;
    if (applicant.IMAGE_DATA) {
      this.showCamera = false;
      this.showImage = true;
    }

    else {
      this.showImage = false;
      this.showCamera = true;
    }
    const drawerRef = this.drawerService.create({
      nzTitle: "Webcam",
      nzContent: this.webCamDrawerTemp,
      nzWidth: 1095
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');

    });

  }
  drawerReferance: any


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
    this.ImageData.FILE_TYPE = 'image/jpeg'
    this.api.updateDocument(this.ImageData).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success("Image uploaded successfully", '');
          this.ImageData = new Documents();
          this.getDocument(this.ApplicantDetails);
          this.drawerReferance.close();
        }

      }
    });
  }

  DocumentTableData: Documents[] = []
  loadDocumentTable: boolean = false;

  drawerReferanceDoc: any;
  openDocuments(applicant: ImageData) {
    this.ApplicantDetails = applicant;

    this.getDocument(applicant);
    const drawerRef = this.drawerService.create({
      nzTitle: "Create Documents",
      nzContent: this.documentAddTpl,
      nzWidth: 1095,
      nzFooter: this.SendToRefillFooter
    });

    this.drawerReferanceDoc = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.ApplicantDetails = new ImageData();

    });
  }

  refillVisisble: boolean = false;

  showRefillButton() {
    this.refillVisisble = false;
    if (this.ROLE_ID == 2 || this.ROLE_ID == 3) {
      for (let document of this.DocumentTableData) {
        if (!document.IS_APPROVED_CHECKER) {
          this.refillVisisble = true;
          break;
        }
      }
    }

    if (this.ROLE_ID == 3) {
      for (let document of this.DocumentTableData) {
        if (!document.IS_APPROVED_VERIFIER) {
          this.refillVisisble = true;
          break;
        }
      }
    }
  }

  getDocument(applicant: ImageData) {
    this.loadDocumentTable = true
    this.api.getDocument(applicant.APPLICANT_ID, applicant.APPLICANT_NO).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.DocumentTableData = res['data'];
          this.showRefillButton();
          this.loadDocumentTable = false;
        }

        else {
          this.loadDocumentTable = false;
        }
      },
      error: () => {
        this.loadDocumentTable = false;
      }
    })
  }

  ApplicantDetails: ImageData = new ImageData();
  SingleDocument: Documents = new Documents();

  createDocMendetory = [
    { field: 'DOCUMENT_NAME', message: 'Document Name' },
    { field: 'MAKER_REMARK', message: 'Maker Remark' }
  ]

  createDocument() {

    let isOk = true;

    for (let field of this.createDocMendetory) {
      if (!this.SingleDocument[field.field as keyof Documents]) {
        this.message.error(`${field.message} is Mandetory`, '');
        isOk = false;
      }

    }

    if (isOk) {
      this.SingleDocument.APPLICANT_ID = this.ApplicantDetails.APPLICANT_ID;
      this.SingleDocument.APPLICANT_NO = this.ApplicantDetails.APPLICANT_NO;

      this.api.createDocument(this.SingleDocument).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            this.SingleDocument = new Documents();
            this.getDocument(this.ApplicantDetails);
          }
          else {
            this.message.error("Failed to create document", '');

          }

        },
        error: () => {
          this.message.error("Failed to create document", '');
        }
      })
    }

  }

  handleChange(event: any, data: Documents) {
    console.log("Files", event.target.files[0]);
    data.FILE_TYPE = event.target.files[0].type;

    let reader = new FileReader();

    reader.onloadend = () => {
      console.log(reader.result);

      data.IMAGE_DATA = reader.result;

      this.api.updateDocument(data).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            this.message.success("File uploaded Successfully", '');
          }
          else {
            this.message.error("Failed to upload File", '');
          }
        },
        error: () => {
          this.message.error("Failed to upload File", '');
        }
      })

    };
    reader.readAsDataURL(event.target.files[0]);

  }

  FileSrc = ''
  file_type: string = '';
  current_Doc: Documents = new Documents();

  ViewDocument(data: Documents) {
    console.log(data.IMAGE_DATA);
    this.FileSrc = data.IMAGE_DATA;
    this.file_type = data.FILE_TYPE;
    this.current_Doc = data;

    let footer;
    let header;

    if (this.ROLE_ID == 1) {
      footer = this.DocumentFooter
      header = ''
    }
    else {
      footer = this.DocumentFooter;
      header = this.DocumentHeader;
    }

    const drawerRef = this.drawerService.create({
      nzTitle: "Document",
      nzContent: this.documentShowTpl,
      nzWidth: 1095,
      nzFooter: footer,
      nzExtra: header
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');

    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.FileSrc = '';
      this.file_type = '';
      this.current_Doc = new Documents();
    });

  }

  Save() {
    this.api.updateSingleDocument(this.current_Doc).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.drawerReferance.close();
          this.getDocument(this.ApplicantDetails);
        }
      }
    })
  }

  SendToRefill() {

    this.basicInfo.TRACK_ID = 1;
    if (this.basicInfo.ID) {
      this.api.updateBasic(this.basicInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Sent to refill", '');
            this.drawerReferanceDoc.close();
          }
          else {
            this.message.error('Failed to Sent to refill', '');
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
        },
        complete: () => {
        }
      })
    }
  }


}
