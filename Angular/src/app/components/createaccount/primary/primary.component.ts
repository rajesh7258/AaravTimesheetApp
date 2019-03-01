import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { DomSanitizer } from '@angular/platform-browser';
import { first } from "rxjs/operators";
import { UploadFileService } from "../../../providers/uploadfile.service";
import { HttpResponse, HttpEventType } from "@angular/common/http";
import { AuthService } from "../../../providers/auth.service";
import { environment } from "../../../../environments/environment.prod";
import { ConstantPool } from "@angular/compiler/src/constant_pool";
import { Router, NavigationExtras } from "@angular/router";
import { CreateprofilenavbarComponent } from "../createprofilenavbar/createprofilenavbar.component";
// import { exec } from "child_process";
import { GetSafeUrl } from "./resourceurl.pipe"

export interface Sex {
  name: string;
  value: string;
}
@Component({
  selector: "app-primary",
  templateUrl: "./primary.component.html",
  styleUrls: ["./primary.component.scss"]
})
export class PrimaryComponent implements OnInit {
  controllerSrc: any;
  downloadSrc: any;
  public profileinfo: any;
  registerform: FormGroup;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  uploadFile: boolean = false;
  maxDate = new Date();
  spin = false;
  private fieldArray: Array<any> = [];
  private newAttribute: any = {};
  private helathArray: Array<any> = [];
  private healthAttribute: any = {};
  newArr = [];
  step = 0;
  resumename : string;

  constructor(
    private profile: AuthService,
    private formBuilder: FormBuilder,
    private uploadService: UploadFileService,
    private sanitizer: DomSanitizer
  ) {
    var today, todayNumber, mondayNumber, sundayNumber, monday, sunday;
    today = new Date();
    todayNumber = today.getDay();
    mondayNumber = 1 - todayNumber;
    sundayNumber = 7 - todayNumber;
    monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + mondayNumber
    );
    sunday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + sundayNumber
    );
    console.log(monday);
    console.log(sunday);

    today = new Date(sunday);
    todayNumber = today.getDay();
    mondayNumber = 1 - todayNumber;
    sundayNumber = 7 - todayNumber;
    monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + mondayNumber
    );
    sunday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + sundayNumber
    );
    var tuesday = new Date();
    var wednesday = new Date();
    var thursday = new Date();
    var friday = new Date();
    var saturday = new Date();
    tuesday.setDate(tuesday.getDate() - tuesday.getDay() + 2);
    wednesday.setDate(wednesday.getDate() - wednesday.getDay() + 3);
    thursday.setDate(thursday.getDate() - thursday.getDay() + 4);
    friday.setDate(friday.getDate() - friday.getDay() + 5);
    saturday.setDate(saturday.getDate() - saturday.getDay() + 6);
    console.log(monday);
    console.log(tuesday);
    console.log(wednesday);
    console.log(thursday);
    console.log(friday);
    console.log(saturday);
    console.log(sunday);
  }

  ngOnInit() {

    this.registerform = this.formBuilder.group({
      Employeeid: ["", [Validators.required]],
      firstname: ["", [Validators.required]],
      middlename: [""],
      lastname: ["", [Validators.required]],
      employeetype: ["", [Validators.required]],
      desigination: ["", [Validators.required]],
      practice: ["", [Validators.required]],
      officeemail: ["", [Validators.required, Validators.email]],
      department: ["", [Validators.required]],
      personalemail: ["", [Validators.required, Validators.email]],
      reportingmanager: ["", [Validators.required]],
      reportinmanageremail: ["", []],
      mentor: ["", []],
      dob: ["", [Validators.required]],
      JoiningDate: ["", [Validators.required]],
      careerStartingDate: ["", [Validators.required]],
      adhar: ["", [Validators.required]],
      pan: ["", [Validators.required]],
      passport: [""],
      sex: ["", [Validators.required]],
      Marraige: ["", [Validators.required]],
      Bloodgroup: ["", [Validators.required]],
      presentadd: ["", [Validators.required]],
      premenantadd: ["", [Validators.required]],
      phonenumber: ["", [Validators.required]],
      extension: ["", [Validators.required]]
    });
    this.profile
      .getProfile(localStorage.getItem("username"))
      .pipe(first())
      .subscribe(
        result => {
          console.log("result is:", result);
          this.profileinfo = result;
          if (this.profileinfo._source.imageURL != "") {
            this.imagepath = this.profileinfo._source.imageURL;
          }
          if (this.profileinfo._source.resumeURL != "") {
            this.resumepath = this.profileinfo._source.resumeURL;
            // this.controllerSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://view.officeapps.live.com/op/embed.aspx?src="+this.resumepath);
            // this.controllerSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url="+this.resumepath+"&embedded=true");
            // console.log('controllerSrc',this.controllerSrc);
            // console.log('santized',this.sanitizer.bypassSecurityTrustResourceUrl(this.resumepath));
            // this.controllerSrc = "https://view.officeapps.live.com/op/embed.aspx?src="+this.sanitizer.bypassSecurityTrustResourceUrl(this.resumepath);
            this.resumename = this.resumepath.substr(this.resumepath.lastIndexOf('/') + 1);
            this.controllerSrc = "https://docs.google.com/gview?url="+this.resumepath+"&embedded=true";
            // this.controllerSrc = "https://view.officeapps.live.com/op/view.aspx?src="+this.resumepath;
            console.log('controllerSrc',this.controllerSrc);
          }
          this.registerform.patchValue({
            Employeeid: this.profileinfo._source.employeeid,
            firstname: this.profileinfo._source.firstname,
            middlename: this.profileinfo._source.middlename,
            lastname: this.profileinfo._source.lastname,
            employeetype: this.profileinfo._source.employeetype,
            desigination: this.profileinfo._source.desigination,
            practice: this.profileinfo._source.practice,
            officeemail: this.profileinfo._source.username,
            department: this.profileinfo._source.department,
            personalemail: this.profileinfo._source.personalemail,
            reportingmanager: this.profileinfo._source.reportingmanager,
            reportinmanageremail: this.profileinfo._source.reportinmanageremail,
            mentor: this.profileinfo._source.mentor,
            dob: this.profileinfo._source.dob,
            JoiningDate: this.profileinfo._source.joiningdate,
            careerStartingDate: this.profileinfo._source.careerstartingdate,
            adhar: this.profileinfo._source.adhar,
            pan: this.profileinfo._source.pan,
            passport: this.profileinfo._source.passport,
            sex: this.profileinfo._source.sex,
            Marraige: this.profileinfo._source.marraige,
            Bloodgroup: this.profileinfo._source.bloodgroup,
            presentadd: this.profileinfo._source.presentadd,
            premenantadd: this.profileinfo._source.premenantadd,
            phonenumber: this.profileinfo._source.phonenumber,
            extension: this.profileinfo._source.extension
            // formControlName2: myValue2 (can be omitted)
          });
          this.fieldArray = this.profileinfo._source.projects;
          this.helathArray = this.profileinfo._source.helathinsurance;
        },
        err => {
          console.log("error is:", err);
        }
      );
    // this.execforiframe();
  }

  // execforiframe() {
  //   this.controllerSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url="+this.resumepath+"&embedded=true");
  //   console.log('controllerSrc',this.controllerSrc);
  // }
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.upload();
  }
  selectFile2(event) {
    this.selectedFiles = event.target.files;
    this.uploadResume();
  }
  imagepath = "https://www.freeiconspng.com/uploads/no-image-icon-4.png";
  resumepath = "";

  get f() {
    return this.registerform.controls;
  }

  download() {
    this.downloadSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.resumepath);

  }

  upload() {
    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService
      .pushFileToStorage(this.currentFileUpload)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event instanceof HttpResponse) {
          if (this.imagepath != null) {
            var obj: any = {};
            obj["filename"] = this.imagepath.substr(this.imagepath.lastIndexOf('/') + 1);
            this.profile.deleteFile(obj).subscribe(result => console.log('delete',result));
          }
          this.imagepath =
            environment.Nodeserver +
            "/api/file/" +
            JSON.stringify(event.body).replace(/\"/g, "");
          this.uploadFile = true;
          console.log("File is completely uploaded!",this.imagepath);
        }
      });

    this.selectedFiles = undefined;
  }

  uploadResume() {
    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService
      .pushFileToStorage(this.currentFileUpload)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event instanceof HttpResponse) {
          if (this.resumepath != null) {
            var obj: any = {};
            this.resumename = this.resumepath.substr(this.resumepath.lastIndexOf('/') + 1);
            obj["filename"] = this.resumename;
            this.profile.deleteFile(obj).subscribe(result => console.log('delete',result));
          }
          this.resumepath =
            environment.Nodeserver +
            "/api/file/" +
            JSON.stringify(event.body).replace(/\"/g, "");
          this.uploadFile = true;
          this.controllerSrc = "https://docs.google.com/gview?url="+this.resumepath+"&embedded=true";
          //this.controllerSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.resumepath);
          //this.controllerSrc = 'https://view.officeapps.live.com/op/embed.aspx?src=' + 
          //                           this.sanitizer.bypassSecurityTrustResourceUrl(this.resumepath);
          // this.execforiframe();
          // console.log('controllerSrc',this.controllerSrc);
          // console.log("File is completely uploaded!");
          // this.controllerSrc = "https://docs.google.com/gview?key=AIzaSyDcfueDpuiuMbm68leG6HNs6pB4OO83nYQ&embedded=true&url=http://192.168.5.53:8081/api/file/Nagarajesh_Venturi_BRM_Developer_Aarav.doc";
          // this.controllerSrc = "https://view.officeapps.live.com/op/view.aspx?src=http://192.168.5.53:8081/api/file/Nagarajesh_Venturi_BRM_Developer_Aarav.doc";
          // this.controllerSrc = "https://docs.google.com/gview?url=http://192.168.5.53:8081/api/file/Nagarajesh_Venturi_BRM_Developer_Aarav.doc&embedded=true&";
        }
      });

    this.selectedFiles = undefined; 
  }

  addprojectValue() {
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
    //console.log('fieldArray',this.fieldArray)
  }

  deleteprojectValue(index) {
    this.fieldArray.splice(index, 1);
  }

  deletehealthValue(index) {
    this.helathArray.splice(index, 1);
  }

  addhealthValue() {
    this.helathArray.push(this.healthAttribute);
    this.healthAttribute = {};
    //console.log('fieldArray',this.fieldArray)
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onSubmit() {}

  saveFiles() {
    var object: any = {};
    object["emplyoeeid"]
    this.profile
      .saveFile({
        employeeid: this.profileinfo._source.employeeid,
        imageURL: this.imagepath,
        resumeURL: this.resumepath
      })
      .pipe(first())
      .subscribe(
        result => {
          console.log("file upload result is:", result);
        },
        err => {
          console.log("error is:", err);
        }
      );
  }
}
