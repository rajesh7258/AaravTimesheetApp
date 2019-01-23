import { Component, OnInit } from "@angular/core";
import { AuthService } from "../providers/auth.service";
import { first } from "rxjs/operators";
import { ConstantPool } from "@angular/compiler/src/constant_pool";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { UploadFileService } from "../providers/uploadfile.service";
import { ActivatedRoute } from "@angular/router";
import { HttpResponse, HttpEventType } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.scss"]
})
export class ViewProfileComponent implements OnInit {
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
  ) {}

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
      deliverymanager: ["", []],
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
      phonenumber: ["", [Validators.required]]
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
            Employeeid: this.profileinfo._source.Employeeid,
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
            deliverymanager: this.profileinfo._source.deliverymanager,
            mentor: this.profileinfo._source.mentor,
            dob: this.profileinfo._source.dob,
            JoiningDate: this.profileinfo._source.joiningdate,
            careerStartingDate: this.profileinfo._source.careerstartingdate,
            adhar: this.profileinfo._source.adhar,
            pan: this.profileinfo._source.pan,
            passport: this.profileinfo._source.passport,
            sex: this.profileinfo._source.sex,
            Marraige: this.profileinfo._source.Marraige,
            Bloodgroup: this.profileinfo._source.Bloodgroup,
            presentadd: this.profileinfo._source.presentadd,
            premenantadd: this.profileinfo._source.premenantadd,
            phonenumber: this.profileinfo._source.phonenumber
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
