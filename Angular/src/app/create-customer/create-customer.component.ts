import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import { UploadFileService } from "../providers/uploadfile.service";
import { HttpResponse, HttpEventType } from "@angular/common/http";
import { AuthService } from "../providers/auth.service";
import { environment } from "../../environments/environment.prod";
import { ConstantPool } from "@angular/compiler/src/constant_pool";
import { Router, NavigationExtras } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
@Component({
  selector: "app-create-customer",
  templateUrl: "./create-customer.component.html",
  styleUrls: ["./create-customer.component.css"]
})
export class CreateCustomerComponent implements OnInit {
  /*Employeeid = new FormControl("", [Validators.required]);
  firstname = new FormControl("", [Validators.required]);
  middlename = new FormControl("");
  lastname = new FormControl("", [Validators.required]);
  employeetype = new FormControl("", [Validators.required]);
  desigination = new FormControl("", [Validators.required]);
  practice = new FormControl("", [Validators.required]);
  officeemail = new FormControl("", [Validators.required, Validators.email]);
  department = new FormControl("", [Validators.required]);
  personalemail = new FormControl("", [Validators.required, Validators.email]);
  reportingmanager = new FormControl("", [Validators.required]);
  deliverymanager = new FormControl("");
  mentor = new FormControl("");
  dob = new FormControl("", [Validators.required]);
  JoiningDate = new FormControl("", [Validators.required]);
  careerStartingDate = new FormControl("", [Validators.required]);
  adhar = new FormControl("", [Validators.required]);
  pan = new FormControl("", [Validators.required]);
  passport = new FormControl("", [Validators.required]);
  sex = new FormControl("", [Validators.required]);
  Marraige = new FormControl("", [Validators.required]);
  Bloodgroup = new FormControl("", [Validators.required]);
  presentadd = new FormControl("", [Validators.required]);
  premenantadd = new FormControl("", [Validators.required]);
  phonenumber = new FormControl("", [Validators.required]);*/
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  uploadImage: boolean = false;
  maxDate = new Date();
  registerform: FormGroup;
  spin = false;
  private fieldArray: Array<any> = [];
  private newAttribute: any = {};
  private healthArray: Array<any> = [];
  private healthAttribute: any = {};
  private skills: Array<any> = [];
  newArr = [];
  managerlist = [];
  private previousexperince: Array<any> = [];
  private experinceAttribute: any = {};
  step = 0;
  public loading = false;
  public emailregex = "/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@aaravsolutions.com+$/";
  public healthdate: Date;
  isfresher = false;
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private uploadService: UploadFileService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.auth
      .getManagerlist()
      .pipe(first())
      .subscribe(
        result => {
          this.managerlist = result._source.managerlist;
        },
        err => {
          console.log(err);
        }
      );
    this.healthdate = new Date();
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
      officeemail: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            "^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@aaravsolutions.com+$"
          )
        ]
      ],
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
      phonenumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          Validators.maxLength(10)
        ]
      ],
      adminaccess: [false],
      manager: [false],
      extension: ["", [Validators.required]],
      totalexperince: ["", [Validators.required]],
      fresher: [false],
      itadmin: [false]
    });
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
    this.healthArray.splice(index, 1);
  }

  addhealthValue() {
    if (!this.healthAttribute.nominee) {
      alert("Nominee cannot be empty");
      return;
    }
    if (!this.healthAttribute.relation) {
      alert("Relation cannot be empty");
      return;
    }
    if (!this.healthAttribute.dob) {
      alert("DOB cannot be empty");
      return;
    }
    if (!this.healthAttribute.Adharno) {
      alert("Adhar Number cannot be empty");
      return;
    }
    this.healthArray.push(this.healthAttribute);
    this.healthAttribute = {};
    //console.log('fieldArray',this.fieldArray)
  }

  addexperinceValue() {
    if (!this.experinceAttribute.companyname) {
      alert("Comapany Name cannot be empty");
      return;
    }
    if (!this.experinceAttribute.desigination) {
      alert("Designation cannot be empty");
      return;
    }
    if (!this.experinceAttribute.startdate) {
      alert("Start Date cannot be empty");
      return;
    }
    if (!this.experinceAttribute.enddate) {
      alert("End Date cannot be empty");
      return;
    }
    if (this.experinceAttribute.startdate > this.experinceAttribute.enddate) {
      alert("End Date cannot be less that start date");
      return;
    }
    this.previousexperince.push(this.experinceAttribute);
    this.experinceAttribute = {};
    //console.log('fieldArray',this.fieldArray)
  }

  deleteexperinceValue(index) {
    this.previousexperince.splice(index, 1);
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

  onSubmit() {
    if (this.registerform.invalid) {
      return;
    }
    //validation on expreince
    if (this.isfresher === false && this.previousexperince.length === 0) {
      alert("Employee is not a Fresher Please add Expreince");
      return;
    }
    this.loading = true;
    var object: any = {};
    object = this.registerform.value;
    object["password"] = "password";
    object["createddate"] = new Date();
    object["status"] = "active";
    object["emailverified"] = "No";
    if (this.uploadImage === true) {
      object["imageURL"] = this.imagepath;
    } else {
      object["imageURL"] = "";
    }

    object["projects"] = this.fieldArray;

    object["health"] = this.healthArray;
    object["leaves"] = [{
      "earnedleave": 5,
      "casualleave": 10,
      "optionalholiday": 2
      }];
    if (this.registerform.controls.fresher.value === true) {
      object["JoiningDate"] = new Date();
      object["careerStartingDate"] = new Date();
      /*this.previousexperince.push({
        companyname: "Aarav Solutions",
        desigination: this.registerform.controls.desigination.value,
        startdate: new Date(),
        enddate: new Date(),
        totalexperince: "0 Years 0 Months 0 Days "
      });*/
    }
    object["previousexpreince"] = this.previousexperince;
    object["skills"] = this.skills;

    //console.log("input", object);

    this.auth
      .register(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log("created sucessfully", result);
          alert(result.message);
          this.imagepath =
            "https://www.freeiconspng.com/uploads/no-image-icon-4.png";
          this.resetformvalues();
          this.loading = false;
        },
        err => {
          if (err.error.Adhar === false) {
            alert(err.error.message);
            this.registerform.controls.adhar.markAsTouched();
          }
          if (err.error.index === false) {
            alert(err.error.message);
          }
          if (err.error.username === false) {
            alert(err.error.message);
          }
          if (err.error.employeeid === false) {
            alert(err.error.message);
          }
          this.loading = false;
          console.log("error while creating employee", err);
        }
      );
  }
  onmanagerselect(value: any) {
    for (let i = 0; i < this.managerlist.length; i++) {
      if (this.managerlist[i].name === value) {
        this.registerform.controls.reportinmanageremail.setValue(
          this.managerlist[i].email
        );
        break;
      }
    }
  }
  resetformvalues() {
    this.registerform.patchValue({
      Employeeid: "",
      firstname: "",
      middlename: "",
      lastname: "",
      employeetype: "",
      desigination: "",
      practice: "",
      officeemail: "",
      department: "",
      personalemail: "",
      reportingmanager: "",
      reportinmanageremail: "",
      mentor: "",
      dob: "",
      JoiningDate: "",
      careerStartingDate: "",
      adhar: "",
      pan: "",
      passport: "",
      sex: "",
      Marraige: "",
      Bloodgroup: "",
      presentadd: "",
      premenantadd: "",
      phonenumber: "",
      extension: "",
      totalexperince: ""
      // formControlName2: myValue2 (can be omitted)
    });
    this.fieldArray = [];
    this.healthArray = [];
  }
  calculateage(event: MatDatepickerInputEvent<Date>) {
    var timeDiff = Math.abs(Date.now() - this.healthAttribute.dob);
    this.healthAttribute.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
  }
  calculateExp(event: MatDatepickerInputEvent<Date>) {
    var date2 = event.value;
    var date1 = new Date();
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var secs = Math.floor(diff / 1000);
    var mins = Math.floor(secs / 60);
    var hours = Math.floor(mins / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 31);
    var years = Math.floor(months / 12);
    months = Math.floor(months % 12);
    days = Math.floor(days % 31);
    hours = Math.floor(hours % 24);
    mins = Math.floor(mins % 60);
    secs = Math.floor(secs % 60);
    var message = "";
    if (days <= 0) {
      message += secs + " sec ";
      message += mins + " min ";
      message += hours + " hours ";
    } else {
      if (years > 0) {
        message += years + " Years ";
      }
      if (months > 0 || years > 0) {
        message += months + " Months ";
      }
      message += days + " Days ";
    }
    this.registerform.controls.totalexperince.setValue(message);
  }
  skiphealthins(event) {
    if (event.checked === true) {
      this.setStep(3);
    }
  }
  fresherornot(event) {
    if (event.checked === true) {
      this.registerform.controls.JoiningDate.setValue(new Date());
      this.registerform.controls.JoiningDate.disable();
      this.registerform.controls.careerStartingDate.setValue(new Date());
      this.registerform.controls.careerStartingDate.disable();
      this.registerform.controls.totalexperince.setValue(
        "0 Years 0 Months 0 Days"
      );
      this.isfresher = true;
    } else {
      this.registerform.controls.JoiningDate.setValue("");
      this.registerform.controls.JoiningDate.enable();
      this.registerform.controls.careerStartingDate.setValue("");
      this.registerform.controls.careerStartingDate.enable();
      this.registerform.controls.totalexperince.setValue("");
      this.isfresher = false;
    }
  }
  expreincetotalexp() {
    if (this.experinceAttribute.enddate && this.experinceAttribute.startdate) {
      var date2 = this.experinceAttribute.startdate;
      var date1 = this.experinceAttribute.enddate;
      var diff = Math.floor(date1.getTime() - date2.getTime());
      var secs = Math.floor(diff / 1000);
      var mins = Math.floor(secs / 60);
      var hours = Math.floor(mins / 60);
      var days = Math.floor(hours / 24);
      var months = Math.floor(days / 31);
      var years = Math.floor(months / 12);
      months = Math.floor(months % 12);
      days = Math.floor(days % 31);
      hours = Math.floor(hours % 24);
      mins = Math.floor(mins % 60);
      secs = Math.floor(secs % 60);
      var message = "";
      if (days <= 0) {
        message += secs + " sec ";
        message += mins + " min ";
        message += hours + " hours ";
      } else {
        if (years > 0) {
          message += years + " Years ";
        }
        if (months > 0 || years > 0) {
          message += months + " Months ";
        }
        message += days + " Days ";
      }
      this.experinceAttribute.totalexperince = message;
    }
  }
}
