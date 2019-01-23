import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { first } from "rxjs/operators";
import { UploadFileService } from "../../../providers/uploadfile.service";
import { HttpResponse, HttpEventType } from "@angular/common/http";
import { AuthService } from "../../../providers/auth.service";
import { environment } from "../../../../environments/environment.prod";
import { ConstantPool } from "@angular/compiler/src/constant_pool";
import { Router, NavigationExtras } from "@angular/router";
import { CreateprofilenavbarComponent } from "../createprofilenavbar/createprofilenavbar.component";

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
  public profileinfo: any;
  registerform: FormGroup;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  uploadImage: boolean = false;
  maxDate = new Date();
  spin = false;
  private fieldArray: Array<any> = [];
  private newAttribute: any = {};
  private helathArray: Array<any> = [];
  private healthAttribute: any = {};
  newArr = [];
  step = 0;

  constructor(
    private profile: AuthService,
    private formBuilder: FormBuilder,
    private uploadService: UploadFileService
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
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.upload();
  }
  imagepath = "https://www.freeiconspng.com/uploads/no-image-icon-4.png";

  get f() {
    return this.registerform.controls;
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
          this.imagepath =
            environment.Nodeserver +
            "/api/file/" +
            JSON.stringify(event.body).replace(/\"/g, "");
          this.uploadImage = true;
          console.log("File is completely uploaded!");
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
}
