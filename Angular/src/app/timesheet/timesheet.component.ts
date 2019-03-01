import { Component, OnInit } from "@angular/core";
import { controlNameBinding } from "@angular/forms/src/directives/reactive_directives/form_control_name";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { format } from "util";
import { AuthService } from "../providers/auth.service";
import { first } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { getLocaleEraNames } from "@angular/common";
import { leave } from "@angular/core/src/profile/wtf_impl";

function numberValidator(control: FormControl) {
  let number = control.value;
  if (number !== "") {
    if (isNaN(+number)) {
      return {
        isNumber: {
          parsedDomain: number
        }
      };
    }
    return null;
  }
}

function checkzeroValidator(control: FormControl) {
  let number = control.value;

  if (Number(number) === 0.0) {
    return {
      notzero: {
        parsedDomain: number
      }
    };
  }
  return null;
}

@Component({
  selector: "app-timesheet",
  templateUrl: "./timesheet.component.html",
  styleUrls: ["./timesheet.component.scss"]
})
export class TimesheetComponent implements OnInit {
  public timesheet: any = [];
  private newAttribute: any = {};
  public holidayentry: any = [];
  public projects: any = [];
  public clientlist = [];
  public projectlist = [];
  public clientnofound = false;
  private holidayAttribute: any = {};
  Saveandsubmit = false;
  today: any;
  todayNumber: any;
  mondayNumber: any;
  sundayNumber: any;
  tuedayNumber: any;
  wedNumber: any;
  thurNumber: any;
  fridayNumber: any;
  satNumber: any;
  monday: any;
  tuesday: any;
  wednesday: any;
  thrusday: any;
  friday: any;
  saturday: any;
  sunday: any;
  disabled: boolean = false;
  disableSelect: FormControl;
  addtimeentry: FormGroup;
  holidayentrygroup: FormGroup;
  currentdate: any;
  Datetodisplay: any;
  monthString: String;
  monthStringcontroller: FormControl;
  mondaycontroller: FormControl;
  tuesdaycontroller: FormControl;
  wednesdaycontroller: FormControl;
  thursdaycontroller: FormControl;
  fridaycontroller: FormControl;
  saturdaycontroller: FormControl;
  sundaycontroller: FormControl;
  disablenext = false;
  todaydate = new Date();
  mondaycheck = 0;
  tuesdaycheck = 0;
  wednesdaycheck = 0;
  thursdaycheck = 0;
  fridaycheck = 0;
  submitted = false;
  Managerstatus = "Not Yet Approved";
  addstatus = false;
  addid = "";
  name: string;
  managername: string;
  manageremail: string;
  spinnerConfig: object = {
    bdColor: "#333",
    size: "large",
    color: "#fff"
  };
  holidayinfo: any;
  leaveinfo: any;
  public loading = false;
  public unsubmit = false;
  public rejected = false;
  public rejectdesc = "";
  unsubmitid = "";
  enableEdit : boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private profile: AuthService,
    private spinner: NgxSpinnerService
  ) {
    /*this.profile
      .getProfile(localStorage.getItem("username"))
      .pipe(first())
      .subscribe(
        result => {
          this.managername = result._source.reportingmanager;
          this.manageremail = result._source.reportinmanageremail;
          this.projects = result._source.projects;
          for (let i = 0; i < this.projects.length; i++) {
            this.clientlist.push({ name: this.projects[i].clientname });
          }
          if (this.clientlist.length === 0) {
            this.clientlist.push({ name: "Aaravsolutions" });
            this.projectlist.push({ name: "Internal" });
            this.clientnofound = true;
          }
        },
        err => {
          alert("Error while retriving employee info contact admin");
        }
      );*/
    this.refreshprojects();
    this.name = `ngx-spinner`;
    this.disableSelect = new FormControl(true);
    this.monthStringcontroller = new FormControl();
    this.mondaycontroller = new FormControl();
    this.tuesdaycontroller = new FormControl();
    this.wednesdaycontroller = new FormControl();
    this.thursdaycontroller = new FormControl();
    this.fridaycontroller = new FormControl();
    this.saturdaycontroller = new FormControl();
    this.sundaycontroller = new FormControl();
    this.currentdate = new Date();
    this.today = new Date();
    this.todayNumber = this.today.getDay();
    this.mondayNumber = 1 - this.todayNumber;
    this.tuedayNumber = 2 - this.todayNumber;
    this.wedNumber = 3 - this.todayNumber;
    this.thurNumber = 4 - this.todayNumber;
    this.fridayNumber = 5 - this.todayNumber;
    this.satNumber = 6 - this.todayNumber;
    this.sundayNumber = 7 - this.todayNumber;

    this.monday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + this.mondayNumber
    );
    this.monday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + this.mondayNumber
    );
    this.tuesday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + this.tuedayNumber
    );
    this.wednesday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + this.wedNumber
    );
    this.thrusday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + this.thurNumber
    );
    this.friday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + this.fridayNumber
    );
    this.saturday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + this.satNumber
    );
    this.sunday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + this.sundayNumber
    );
    var object = {
      employeeid: localStorage.getItem("employeeid"),
      startdate: this.monday,
      enddate: this.sunday
    };

    this.gettimeoff(localStorage.getItem("employeeid"),this.monday, this.sunday);

    // this.getleavebydate(localStorage.getItem("employeeid"),this.monday, this.sunday);
    // this.getholidaybydate(this.monday, this.sunday);

    this.profile
      .gettimesheet(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log("timeresultis:", result);
          if (result.status === "find") {
            console.log("object", object);
            if (result.response._source.status === "submit") {
              this.submitted = true;
              this.timesheet = result.response._source.weekentry;
              this.holidayentry = result.response._source.weekendentry;
              if (result.response._source.managerstatus === "Approved") {
                this.Managerstatus = "Approved";
                this.unsubmit = false;
              }
              if (result.response._source.managerstatus === "Reject") {
                this.Managerstatus = "Rejected";
                this.unsubmit = true;
                this.rejected = true;
                this.unsubmitid = result.response._id;
                this.rejectdesc = result.response._source.rejectdescription;
              }
              if (result.response._source.managerstatus === "New") {
                this.unsubmit = true;
                this.unsubmitid = result.response._id;
              }
            }
            if (
              result.response._source.status === "save" ||
              result.response._source.status === "unsubmit"
            ) {
              if (result.response._source.status === "unsubmit") {
                this.unsubmit = true;
                this.unsubmitid = result.response._id;
              }
              this.submitted = false;
              this.timesheet = result.response._source.weekentry;
              this.holidayentry = result.response._source.weekendentry;
              this.addid = result.response._id;
              this.Saveandsubmit = true;
              this.addstatus = true;
            }
          }
        },
        err => {
          console.log("error is:", err);
        }
      );
    this.Datetodisplay = this.getmonthString(
      this.monday.getMonth(),
      this.monday.getDate(),
      this.sunday.getMonth(),
      this.sunday.getDate(),
      this.monday.getFullYear(),
      this.sunday.getFullYear()
    );
    /*this.Datetodisplay =
      this.MonthString(this.sunday.getMonth()) +
      " " +
      this.monday.getDate() +
      " - " +
      this.sunday.getDate() +
      ", " +
      this.today.getFullYear();*/
    this.monthStringcontroller.setValue(this.Datetodisplay);
    this.mondaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.monday.getDate())
    );
    this.tuesdaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.tuesday.getDate())
    );
    this.wednesdaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.wednesday.getDate())
    );
    this.thursdaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.thrusday.getDate())
    );
    this.fridaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.friday.getDate())
    );
    this.saturdaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.saturday.getDate())
    );
    this.sundaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.sunday.getDate())
    );
  }

  ngOnInit() {
    this.addtimeentry = this.formBuilder.group({
      client: ["", [Validators.required]],
      project: ["", [Validators.required]],
      task: ["", [Validators.required]],
      mon: ["", [numberValidator]],
      tue: ["", [numberValidator]],
      wed: ["", [numberValidator]],
      thu: ["", [numberValidator]],
      fri: ["", [numberValidator]],
      sat: ["", [numberValidator]],
      sun: ["", [numberValidator]],
      total: ["0.0"]
    });

    this.holidayentrygroup = this.formBuilder.group({
      task: [""],
      mon: ["", [numberValidator]],
      tue: ["", [numberValidator]],
      wed: ["", [numberValidator]],
      thu: ["", [numberValidator]],
      fri: ["", [numberValidator]],
      sat: ["", [numberValidator]],
      sun: ["", [numberValidator]],
      total: ["0.0"]
    });
  }
  enableedit() {
    this.enableEdit = true;
  }
  previous() {
    this.refreshprojects();
    this.resetvalues();
    this.today = new Date(this.monday - 1);
    this.monday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - 6
    );
    this.tuesday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - 5
    );
    this.wednesday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - 4
    );
    this.thrusday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - 3
    );
    this.friday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - 2
    );
    this.saturday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - 1
    );
    this.sunday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate()
    );
    var object = {
      employeeid: localStorage.getItem("employeeid"),
      startdate: this.monday,
      enddate: this.sunday
    };
    this.gettimeoff(localStorage.getItem("employeeid"),this.monday, this.sunday);
    this.profile
      .gettimesheet(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log("timeresultis:", result);
          if (result.status === "find") {
            if (result.response._source.status === "submit") {
              this.submitted = true;
              this.timesheet = result.response._source.weekentry;
              this.holidayentry = result.response._source.weekendentry;
              if (result.response._source.managerstatus === "Approved") {
                this.Managerstatus = "Approved";
                this.unsubmit = false;
              }
              if (result.response._source.managerstatus === "Reject") {
                this.Managerstatus = "Rejected";
                this.unsubmit = true;
                this.rejected = true;
                this.rejectdesc = result.response._source.rejectdescription;
                this.unsubmitid = result.response._id;
              }
              if (result.response._source.managerstatus === "New") {
                this.unsubmit = true;
                this.unsubmitid = result.response._id;
              }
            }
            if (
              result.response._source.status === "save" ||
              result.response._source.status === "unsubmit"
            ) {
              if (result.response._source.status === "unsubmit") {
                this.unsubmit = true;
                this.unsubmitid = result.response._id;
              }
              this.submitted = false;
              this.timesheet = result.response._source.weekentry;
              console.log("save or unsubmit", this.timesheet);
              this.holidayentry = result.response._source.weekendentry;
              this.addid = result.response._id;
              this.Saveandsubmit = true;
              this.addstatus = true;
            }
          }
        },
        err => {
          console.log("error is:", err);
        }
      );
    this.Datetodisplay = this.getmonthString(
      this.monday.getMonth(),
      this.monday.getDate(),
      this.sunday.getMonth(),
      this.sunday.getDate(),
      this.monday.getFullYear(),
      this.sunday.getFullYear()
    );
    /*this.Datetodisplay =
      this.MonthString(this.sunday.getMonth()) +
      " " +
      this.monday.getDate() +
      " - " +
      this.sunday.getDate() +
      ", " +
      this.today.getFullYear();*/

    this.monthStringcontroller.setValue(this.Datetodisplay);
    this.mondaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.monday.getDate())
    );
    this.tuesdaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.tuesday.getDate())
    );
    this.wednesdaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.wednesday.getDate())
    );
    this.thursdaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.thrusday.getDate())
    );
    this.fridaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.friday.getDate())
    );
    this.saturdaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.saturday.getDate())
    );
    this.sundaycontroller.setValue(
      this.getdate(this.monday.getMonth(), this.sunday.getDate())
    );
    if (this.sunday.getTime() < this.todaydate.getTime()) {
      this.disablenext = true;
    } else {
      this.disablenext = false;
    }
  }

  async gettimeoff( employeeid: any, fromdate: any, todate: any) {
    // var holidayinfo: any = await this.getholidaybydate(fromdate, todate);
    // var leaveinfo: any = await this.getleavebydate(employeeid, fromdate, todate);
    await this.getholidaybydate(fromdate, todate);
    await this.getleavebydate(employeeid, fromdate, todate);
    var tempArr : any = [];
    var tempHoliday : any = [];
    console.log('leaveinfo', this.leaveinfo);
    console.log('holidayinfo', this.holidayinfo);
    if( this.leaveinfo.response.hits.total > 0 ) {
      tempArr = this.leaveinfo.response.hits.hits;
      tempHoliday = this.holidayinfo.response.hits.hits[0].inner_hits.holidaylist.hits.hits;
      console.log('tempArr', tempArr);
      console.log('tempHoliday', tempHoliday);
      for( let i =0; i< tempArr.length; i++) {
        var Fromdate = new Date(tempArr[i]._source.startdate);
        var Todate = new Date(tempArr[i]._source.enddate);
        console.log('checking from date value', Fromdate);
        console.log('checkin to date value',Todate);
        var diff = Math.abs(
          Fromdate.getTime() - Todate.getTime()
        );
        var leaveentry : any = {
          "task" : "Leave",
          "mon" : 0,
          "tue" : 0,
          "wed" : 0,
          "thu" : 0,
          "fri" : 0,
          "sat" : 0,
          "sun" : 0,
          "total" : 0
        };
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        for (let j = 0; j < diffDays + 1; j++) {
          var tmpdate: Date = new Date(
            Fromdate.getFullYear(),
            Fromdate.getMonth(),
            Fromdate.getDate()
          );
          Fromdate = tmpdate;
          
          console.log(tmpdate);
          if (tmpdate.getDay() !== 0 && tmpdate.getDay() !== 6) {
            if ( this.holidayinfo.response.hits.total > 0 ) {
              for( let k =0; k < tempHoliday.length; k++) {
                if( tmpdate.getTime() !== new Date(tempHoliday[k]._source.date).getTime()) {
                  // console.log('holidays',new Date(tempHoliday[k].date));
                  console.log('leave in holiday block', tmpdate);
                  if( tmpdate.getDay() === 1 ) {
                    leaveentry["mon"] = 8;
                  }
                  if( tmpdate.getDay() === 2 ) {
                    leaveentry["tue"] = 8;
                  }
                  if( tmpdate.getDay() === 3 ) {
                    console.log('inside wednesday',leaveentry);
                    leaveentry["wed"] = 8;
                  }
                  if( tmpdate.getDay() === 4 ) {
                    leaveentry["thu"] = 8;
                  }
                  if( tmpdate.getDay() === 5 ) {
                    leaveentry["fri"] = 8;
                  }
                }
              }
            }
          }
          tmpdate = new Date(
            Fromdate.getFullYear(),
            Fromdate.getMonth(),
            Fromdate.getDate() + 1
          );
          Fromdate = tmpdate;
        }
        leaveentry.total = leaveentry.mon + leaveentry.tue + leaveentry.wed + leaveentry.thu + leaveentry.fri;
        this.holidayentry.push(leaveentry);
        console.log('holidayentry', this.holidayentry);
      }
    }
    if ( this.holidayinfo.response.hits.total > 0 ) {
      tempHoliday = this.holidayinfo.response.hits.hits[0].inner_hits.holidaylist.hits.hits;
      console.log('in holi', tempHoliday )
      var holidayentry : any = {
        "task" : "Company Holiday",
        "mon" : 0,
        "tue" : 0,
        "wed" : 0,
        "thu" : 0,
        "fri" : 0,
        "sat" : 0,
        "sun" : 0,
        "total" : 0
      };
      for( let i =0; i< tempHoliday.length; i++) {
        var dateofholiday= new Date(tempHoliday[i]._source.date);
        if( dateofholiday.getDay() === 1 ) {
          holidayentry["mon"] = 8;
        }
        if( dateofholiday.getDay() === 2 ) {
          holidayentry["tue"] = 8;
        }
        if( dateofholiday.getDay() === 3 ) {
          console.log('in wed');
          holidayentry["wed"] = 8;
        }
        if( dateofholiday.getDay() === 4 ) {
          holidayentry["thu"] = 8;
        }
        
        if( dateofholiday.getDay() === 5 ) {
          holidayentry["fri"] = 8;
        }
        holidayentry.task = tempHoliday[i]._source.occasion;
        holidayentry.total = holidayentry.mon + holidayentry.tue + holidayentry.wed + holidayentry.thu + holidayentry.fri;
        this.holidayentry.push(holidayentry);
        console.log('holidayentry', this.holidayentry);
      } 
    }
  }

  async getholidaybydate(fromdate: Date, todate: Date) {
    console.log('fromdate', fromdate);
    console.log('todate', todate);
    var object = {
      "fromdate": fromdate,
      "todate": todate
    }
    await this.profile
    .gettimesheetholidaybydate(object)
    .then(
      result => {
        console.log('holidaybydate', result);
        this.holidayinfo = result;
        //return result;
      }
    );
  }

  async getleavebydate( employeeid: any, fromdate: any, todate: any) {
    console.log('fromdate', fromdate);
    console.log('todate', todate);
    var object = {
      "employeeid": employeeid,
      "fromdate": fromdate,
      "todate": todate
    }
    await this.profile
    .getleavebydate(object)
    .then(
      result => {
        console.log('leavebydate', result);
        this.leaveinfo = result;
        //return result;
      }
    );
  }

  next() {
    this.refreshprojects();
    this.resetvalues();
    this.today = new Date(this.sunday);
    this.todayNumber = this.today.getDay();
    this.mondayNumber = 1 - this.todayNumber;
    this.tuedayNumber = 2 - this.todayNumber;
    this.wedNumber = 3 - this.todayNumber;
    this.thurNumber = 4 - this.todayNumber;
    this.fridayNumber = 5 - this.todayNumber;
    this.satNumber = 6 - this.todayNumber;
    this.sundayNumber = 7 - this.todayNumber;
    this.monday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + 1
    );
    this.tuesday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + 2
    );
    this.wednesday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + 3
    );
    this.thrusday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + 4
    );
    this.friday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + 5
    );
    this.saturday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + 6
    );
    this.sunday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + 7
    );
    var object = {
      employeeid: localStorage.getItem("employeeid"),
      startdate: this.monday,
      enddate: this.sunday
    };
    this.gettimeoff(localStorage.getItem("employeeid"),this.monday, this.sunday);
    this.profile
      .gettimesheet(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log("timeresultis:", result);
          if (result.status === "find") {
            if (result.response._source.status === "submit") {
              this.submitted = true;
              this.timesheet = result.response._source.weekentry;
              this.holidayentry = result.response._source.weekendentry;
              if (result.response._source.managerstatus === "Approved") {
                this.Managerstatus = "Approved";
                this.unsubmit = false;
              }
              if (result.response._source.managerstatus === "Reject") {
                this.Managerstatus = "Rejected";
                this.unsubmit = true;
                this.rejected = true;
              }
              if (result.response._source.managerstatus === "New") {
                this.unsubmit = true;
                this.unsubmitid = result.response._id;
              }
            }
            if (
              result.response._source.status === "save" ||
              result.response._source.status === "unsubmit"
            ) {
              if (result.response._source.status === "unsubmit") {
                this.unsubmit = true;
                this.unsubmitid = result.response._id;
              }
              this.submitted = false;
              this.timesheet = result.response._source.weekentry;
              console.log("save or unsubmit", this.timesheet);
              this.holidayentry = result.response._source.weekendentry;
              this.addid = result.response._id;
              this.Saveandsubmit = true;
              this.addstatus = true;
            }
          }
        },
        err => {
          console.log("error is:", err);
        }
      );
    this.Datetodisplay = this.getmonthString(
      this.monday.getMonth(),
      this.monday.getDate(),
      this.sunday.getMonth(),
      this.sunday.getDate(),
      this.monday.getFullYear(),
      this.sunday.getFullYear()
    );
    /* this.Datetodisplay =
      this.MonthString(this.sunday.getMonth()) +
      " " +
      this.monday.getDate() +
      " - " +
      this.sunday.getDate() +
      ", " +
      this.today.getFullYear();*/
    this.monthStringcontroller.setValue(this.Datetodisplay);
    this.mondaycontroller.setValue(
      this.getdate(this.sunday.getMonth(), this.monday.getDate())
    );
    this.tuesdaycontroller.setValue(
      this.getdate(this.sunday.getMonth(), this.tuesday.getDate())
    );
    this.wednesdaycontroller.setValue(
      this.getdate(this.sunday.getMonth(), this.wednesday.getDate())
    );
    this.thursdaycontroller.setValue(
      this.getdate(this.sunday.getMonth(), this.thrusday.getDate())
    );
    this.fridaycontroller.setValue(
      this.getdate(this.sunday.getMonth(), this.friday.getDate())
    );
    this.saturdaycontroller.setValue(
      this.getdate(this.sunday.getMonth(), this.saturday.getDate())
    );
    this.sundaycontroller.setValue(
      this.getdate(this.sunday.getMonth(), this.sunday.getDate())
    );
    if (this.sunday.getTime() < this.todaydate.getTime()) {
      this.disablenext = true;
    } else {
      this.disablenext = false;
    }
  }

  addtimesheet() {
    //this.timesheet.push(this.newAttribute);
    //this.newAttribute = {};
    //console.log('fieldArray',this.fieldArray)
    var total = 0.0;
    if (this.addtimeentry.invalid) {
      return;
    }
    if (this.addtimeentry.controls.mon.value !== "") {
      total = total + Number(this.addtimeentry.controls.mon.value);
      this.newAttribute["mon"] = Number(this.addtimeentry.controls.mon.value);
    } else {
      this.newAttribute["mon"] = 0;
    }
    if (this.addtimeentry.controls["tue"].value !== "") {
      total = total + Number(this.addtimeentry.controls["tue"].value);
      this.newAttribute["tue"] = Number(this.addtimeentry.controls.tue.value);
    } else {
      this.newAttribute["tue"] = 0;
    }
    if (this.addtimeentry.controls["wed"].value !== "") {
      total = total + Number(this.addtimeentry.controls["wed"].value);
      this.newAttribute["wed"] = Number(this.addtimeentry.controls.wed.value);
    } else {
      this.newAttribute["wed"] = 0;
    }
    if (this.addtimeentry.controls["thu"].value !== "") {
      total = total + Number(this.addtimeentry.controls["thu"].value);
      this.newAttribute["thu"] = Number(this.addtimeentry.controls.thu.value);
    } else {
      this.newAttribute["thu"] = 0;
    }
    if (this.addtimeentry.controls["fri"].value !== "") {
      total = total + Number(this.addtimeentry.controls["fri"].value);
      this.newAttribute["fri"] = Number(this.addtimeentry.controls.fri.value);
    } else {
      this.newAttribute["fri"] = 0;
    }
    if (this.addtimeentry.controls["sat"].value !== "") {
      total = total + Number(this.addtimeentry.controls["sat"].value);
      this.newAttribute["sat"] = Number(this.addtimeentry.controls.sat.value);
    } else {
      this.newAttribute["sat"] = 0;
    }
    if (this.addtimeentry.controls["sun"].value !== "") {
      total = total + Number(this.addtimeentry.controls["sun"].value);
      this.newAttribute["sun"] = Number(this.addtimeentry.controls.sun.value);
    } else {
      this.newAttribute["sun"] = 0;
    }
    if (total === 0.0) {
      this.addtimeentry.controls.total.setValidators(checkzeroValidator);
      //this.addtimeentry.controls.total.markAsTouched();
      alert("Total cannot be zero");
      this.addtimeentry.controls.total.clearValidators();

      return;
    }

    this.addtimeentry.controls.total.setValue(total);
    this.newAttribute["total"] = Number(total);
    this.newAttribute["client"] = this.addtimeentry.controls.client.value;
    this.newAttribute["project"] = this.addtimeentry.controls.project.value;
    this.newAttribute["task"] = this.addtimeentry.controls["task"].value;
    this.timesheet.push(this.newAttribute);
    this.newAttribute = {};
    this.addtimeentry.reset();
    //console.log("on submitted", total);
    //console.log("on submitted", this.timesheet);
    this.Saveandsubmit = true;
    this.addtimeentry.controls.total.setValue("0.0");
  }
  addholidayentry() {
    var total = 0.0;
    if (this.holidayentrygroup.invalid) {
      return;
    }
    if (this.holidayentrygroup.controls.task.value === "") {
      alert("Task Cannot be empty");
      return;
    }
    if (this.holidayentrygroup.controls.mon.value !== "") {
      total = total + Number(this.holidayentrygroup.controls.mon.value);
      this.holidayAttribute["mon"] = Number(
        this.holidayentrygroup.controls.mon.value
      );
    } else {
      this.holidayAttribute["mon"] = 0;
    }
    if (this.holidayentrygroup.controls["tue"].value !== "") {
      total = total + Number(this.holidayentrygroup.controls["tue"].value);
      this.holidayAttribute["tue"] = Number(
        this.holidayentrygroup.controls.tue.value
      );
    } else {
      this.holidayAttribute["tue"] = 0;
    }
    if (this.holidayentrygroup.controls["wed"].value !== "") {
      total = total + Number(this.holidayentrygroup.controls["wed"].value);
      this.holidayAttribute["wed"] = Number(
        this.holidayentrygroup.controls.wed.value
      );
    } else {
      this.holidayAttribute["wed"] = 0;
    }
    if (this.holidayentrygroup.controls["thu"].value !== "") {
      total = total + Number(this.holidayentrygroup.controls["thu"].value);
      this.holidayAttribute["thu"] = Number(
        this.holidayentrygroup.controls.thu.value
      );
    } else {
      this.holidayAttribute["thu"] = 0;
    }
    if (this.holidayentrygroup.controls["fri"].value !== "") {
      total = total + Number(this.holidayentrygroup.controls["fri"].value);
      this.holidayAttribute["fri"] = Number(
        this.holidayentrygroup.controls.fri.value
      );
    } else {
      this.holidayAttribute["fri"] = 0;
    }
    if (this.holidayentrygroup.controls["sat"].value !== "") {
      total = total + Number(this.holidayentrygroup.controls["sat"].value);
      this.holidayAttribute["sat"] = Number(
        this.holidayentrygroup.controls.sat.value
      );
    } else {
      this.holidayAttribute["sat"] = 0;
    }
    if (this.holidayentrygroup.controls["sun"].value !== "") {
      total = total + Number(this.holidayentrygroup.controls["sun"].value);
      this.holidayAttribute["sun"] = Number(
        this.holidayentrygroup.controls.sun.value
      );
    } else {
      this.holidayAttribute["sun"] = 0;
    }
    if (total === 0.0) {
      this.holidayentrygroup.controls.total.setValidators(checkzeroValidator);
      //this.addtimeentry.controls.total.markAsTouched();
      alert("Timeoff Total cannot be zero");
      this.holidayentrygroup.controls.total.clearValidators();
      return;
    }

    this.holidayentrygroup.controls.total.setValue(total);
    this.holidayAttribute["total"] = Number(total);
    this.holidayAttribute["task"] = this.holidayentrygroup.controls[
      "task"
    ].value;
    console.log("addholidayentry", this.holidayentry);
    this.holidayentry.push(this.holidayAttribute);
    this.holidayAttribute = {};
    this.Saveandsubmit = true;
    this.holidayentrygroup.reset();
    this.holidayentrygroup.controls.total.setValue("0.0");
  }
  deletetimesheet(index) {
    this.timesheet.splice(index, 1);
    if (this.timesheet.length === 0 && this.holidayentry.length === 0) {
      this.Saveandsubmit = false;
    }
  }
  deleteholidayentry(index) {
    this.holidayentry.splice(index, 1);

    if (this.timesheet.length === 0 && this.holidayentry.length === 0) {
      this.Saveandsubmit = false;
    }
  }
  get f() {
    return this.addtimeentry.controls;
  }

  get holiodaycontrol() {
    return this.holidayentrygroup.controls;
  }

  MonthString(month: any) {
    var monthString = "";
    if (month === 0) {
      monthString = "January";
    }
    if (month === 1) {
      monthString = "Febuary";
    }
    if (month === 2) {
      monthString = "March";
    }
    if (month === 3) {
      monthString = "April";
    }
    if (month === 4) {
      monthString = "May";
    }
    if (month === 5) {
      monthString = "June";
    }
    if (month === 6) {
      monthString = "July";
    }
    if (month === 7) {
      monthString = "Augest";
    }
    if (month === 8) {
      monthString = "September";
    }
    if (month === 9) {
      monthString = "October";
    }
    if (month === 10) {
      monthString = "November";
    }
    if (month === 11) {
      monthString = "December";
    }
    return monthString;
  }

  getdate(month: any, day: any) {
    var monthString = "";
    if (month === 0) {
      monthString = "Jan" + " " + day;
    }
    if (month === 1) {
      monthString = "Feb" + " " + day;
    }
    if (month === 2) {
      monthString = "Mar" + " " + day;
    }
    if (month === 3) {
      monthString = "Apr" + " " + day;
    }
    if (month === 4) {
      monthString = "May" + " " + day;
    }
    if (month === 5) {
      monthString = "Jun" + " " + day;
    }
    if (month === 6) {
      monthString = "Jul" + " " + day;
    }
    if (month === 7) {
      monthString = "Aug" + " " + day;
    }
    if (month === 8) {
      monthString = "Sep" + " " + day;
    }
    if (month === 9) {
      monthString = "Oct" + " " + day;
    }
    if (month === 10) {
      monthString = "Nov" + " " + day;
    }
    if (month === 11) {
      monthString = "Dec" + " " + day;
    }
    return monthString;
  }

  getmonthString(
    monmonth: Number,
    mondate: Number,
    sunmonth: Number,
    sundate: Number,
    monyear: Number,
    sunyear: Number
  ) {
    console.log(monmonth, mondate, sunmonth, sundate, monyear, sunyear);
    if (monmonth !== sunmonth) {
      return (
        this.MonthString(monmonth) +
        " " +
        mondate +
        "-" +
        this.MonthString(sunmonth) +
        " " +
        sundate +
        "," +
        sunyear
      );
    } else {
      return (
        this.MonthString(monmonth) +
        " " +
        mondate +
        "-" +
        sundate +
        "," +
        sunyear
      );
    }
  }
  onSubmit() {
    if (this.friday.getTime() > this.todaydate.getTime()) {
      alert("Need to submit time sheet after weekend");
      return;
    }
    this.loading = true;
    var retvalue = this.internalSaveSubmit();
    if (retvalue === false) {
      setTimeout(() => {
        this.loading = false;
      }, 8500);
      return;
    }
    var retvalue = this.checkdays();
    if (retvalue === false) {
      setTimeout(() => {
        this.loading = false;
      }, 8500);
      return;
    }
    this.submitdata("submit");
  }
  onSave() {
    this.spinner.show();
    this.loading = true;
    var retvalue = this.internalSaveSubmit();
    if (retvalue === false) {
      setTimeout(() => {
        this.loading = false;
      }, 8500);
      return;
    }
    this.submitdata("save");
  }

  internalSaveSubmit() {
    if (this.timesheet.length === 0 && this.holidayentry.length === 0) {
      alert("timesheet is empty with no entry");
    }
    //check tasks are unique

    //check date and holiday
    if (this.timesheet.length !== 0 && this.holidayentry.length !== 0) {
      for (let i = 0; i < this.holidayentry.length; i++) {
        for (let j = 0; j < this.timesheet.length; j++) {
          if (
            Number(this.holidayentry[i].mon) !== 0 &&
            Number(this.timesheet[j].mon) !== 0
          ) {
            alert(
              "WARNING:HEY YOUR TIME OFF ON " +
                this.monday +
                " SO YOUR NOT SUPPOSED TO ENTER YOUR TIMESHEET ENRTY"
            );
            return false;
          }

          if (
            Number(this.holidayentry[i].tue) !== 0 &&
            Number(this.timesheet[j].tue) !== 0
          ) {
            alert(
              "WARNING:HEY YOUR TIME OFF ON " +
                this.tuesday +
                " SO YOUR NOT SUPPOSED TO ENTER YOUR TIMESHEET ENRTY"
            );
            return false;
          }
          if (
            Number(this.holidayentry[i].wed) !== 0 &&
            Number(this.timesheet[j].wed) !== 0
          ) {
            alert(
              "WARNING:HEY YOUR TIME OFF ON " +
                this.wednesday +
                " SO YOUR NOT SUPPOSED TO ENTER YOUR TIMESHEET ENRTY"
            );
            return false;
          }
          if (
            Number(this.holidayentry[i].thu) !== 0 &&
            Number(this.timesheet[j].thu) !== 0
          ) {
            alert(
              "WARNING:HEY YOUR TIME OFF ON " +
                this.thrusday +
                " SO YOUR NOT SUPPOSED TO ENTER YOUR TIMESHEET ENRTY"
            );
            return false;
          }
          if (
            Number(this.holidayentry[i].fri) !== 0 &&
            Number(this.timesheet[j].fri) !== 0
          ) {
            alert(
              "WARNING:HEY YOUR TIME OFF ON " +
                this.friday +
                " SO YOUR NOT SUPPOSED TO ENTER YOUR TIMESHEET ENRTY"
            );
            return false;
          }
          if (
            Number(this.holidayentry[i].sat) !== 0 &&
            Number(this.timesheet[j].sat) !== 0
          ) {
            alert(
              "WARNING:HEY YOUR TIME OFF ON " +
                this.saturday +
                " SO YOUR NOT SUPPOSED TO ENTER YOUR TIMESHEET ENRTY"
            );
            return false;
          }
          if (
            Number(this.holidayentry[i].sun) !== 0 &&
            Number(this.timesheet[j].sun) !== 0
          ) {
            alert(
              "WARNING:HEY YOUR TIME OFF ON " +
                this.sunday +
                " SO YOUR NOT SUPPOSED TO ENTER YOUR TIMESHEET ENRTY"
            );
            return false;
          }
        }
      }
    }
  }

  setchecks() {
    this.mondaycheck = 0;
    this.tuesdaycheck = 0;
    this.wednesdaycheck = 0;
    this.thursdaycheck = 0;
    this.fridaycheck = 0;
  }
  resetvalues() {
    this.addtimeentry.reset();
    this.holidayentrygroup.reset();
    this.setchecks();
    this.addstatus = false;
    this.timesheet = [];
    this.newAttribute = {};
    this.holidayentry = [];
    this.holidayAttribute = {};
    this.Saveandsubmit = false;
    this.submitted = false;
    this.Managerstatus = "Not Yet Approved";
    this.addtimeentry.controls.total.setValue("0.0");
    this.holidayentrygroup.controls.total.setValue("0.0");
    this.unsubmit = false;
    this.rejected = false;
    this.rejectdesc = "";
  }
  checkdays() {
    this.setchecks();
    if (this.timesheet.length !== 0 || this.holidayentry.length !== 0) {
      for (let i = 0; i < this.holidayentry.length; i++) {
        if (this.holidayentry[i].mon !== 0) {
          this.mondaycheck++;
        }
        if (this.holidayentry[i].tue !== 0) {
          this.tuesdaycheck++;
        }
        if (this.holidayentry[i].wed !== 0) {
          this.wednesdaycheck++;
        }
        if (this.holidayentry[i].thu !== 0) {
          this.thursdaycheck++;
        }
        if (this.holidayentry[i].fri !== 0) {
          this.fridaycheck++;
        }
      }
      for (let i = 0; i < this.timesheet.length; i++) {
        if (this.timesheet[i].mon !== 0) {
          this.mondaycheck++;
        }
        if (this.timesheet[i].tue !== 0) {
          this.tuesdaycheck++;
        }
        if (this.timesheet[i].wed !== 0) {
          this.wednesdaycheck++;
        }
        if (this.timesheet[i].thu !== 0) {
          this.thursdaycheck++;
        }
        if (this.timesheet[i].fri !== 0) {
          this.fridaycheck++;
        }
      }

      if (this.mondaycheck === 0) {
        alert("No Value find for :" + this.monday);
        return false;
      }
      if (this.tuesdaycheck === 0) {
        alert("No Value find for :" + this.tuesday);
        return false;
      }
      if (this.wednesdaycheck === 0) {
        alert("No Value find for :" + this.wednesday);
        return false;
      }
      if (this.thursdaycheck === 0) {
        alert("No Value find for :" + this.thrusday);
        return false;
      }
      if (this.fridaycheck === 0) {
        alert("No Value find for :" + this.friday);
        return false;
      }
    }
  }
  unsubmittrigger() {
    this.submitted = false;
    this.Saveandsubmit = true;
    this.submitdata("unsubmit");
  }
  submitdata(status) {
    //Preparing the data.
    this.rejected = false;
    this.Managerstatus = "Not Yet Approved";
    var object = {};
    console.log("startdate:", this.monday);
    console.log("end:", this.sunday);
    object["employeeid"] = localStorage.getItem("employeeid");
    object["submitteddate"] = new Date();
    object["startdate"] = this.monday;
    object["enddate"] = this.sunday;
    object["datelist"] = {
      mon: this.mondaycontroller.value,
      tue: this.tuesdaycontroller.value,
      wed: this.wednesdaycontroller.value,
      thur: this.thursdaycontroller.value,
      fri: this.fridaycontroller.value,
      sat: this.saturdaycontroller.value,
      sun: this.sundaycontroller.value
    };
    object["weekentry"] = this.timesheet;
    object["weekendentry"] = this.holidayentry;
    object["managerstatus"] = "New";
    object["status"] = status;
    object["managername"] = this.managername;
    object["manageremail"] = this.manageremail;
    if (status === "save" && this.addid !== "") {
      object["_id"] = this.addid;
    }
    if (this.unsubmit === true) {
      object["_id"] = this.unsubmitid;
    }

    console.log("submited", object);
    this.profile
      .submittimesheet(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log("submittimesheet response", result);
          if (
            result.response.result === "created" ||
            result.response.result === "updated"
          ) {
            this.profile
              .refreshindex("timesheets")
              .pipe(first())
              .subscribe(
                result => {
                  var object = {
                    employeeid: localStorage.getItem("employeeid"),
                    startdate: this.monday,
                    enddate: this.sunday
                  };
                  console.log("afterresult", object);
                  this.profile
                    .gettimesheet(object)
                    .pipe(first())
                    .subscribe(
                      result => {
                        console.log("timeresultis:", result);
                        if (result.status === "find") {
                          if (result.response._source.status === "submit") {
                            this.submitted = true;
                            this.timesheet = result.response._source.weekentry;
                            this.holidayentry =
                              result.response._source.weekendentry;
                            if (
                              result.response._source.managerstatus ===
                              "approved"
                            ) {
                              this.Managerstatus = "Approved";
                            }
                          }
                          if (result.response._source.status === "save") {
                            this.submitted = false;
                            this.timesheet = result.response._source.weekentry;
                            this.holidayentry =
                              result.response._source.weekendentry;
                            this.addid = result.response._id;
                            this.Saveandsubmit = true;
                            this.addstatus = true;
                          }
                        }
                      },
                      err => {
                        console.log("error is:", err);
                        setTimeout(() => {
                          this.loading = false;
                        }, 8500);
                      }
                    );
                },
                err => {
                  console.log("error is:", err);
                  this.loading = false;
                }
              );
          }
          setTimeout(() => {
            this.loading = false;
          }, 8500);
        },
        err => {
          console.log("error is:", err);
          this.loading = false;
        }
      );
  }

  getprojetbyclient(event) {
    //console.log("Inside function");
    if (this.clientnofound === false) {
      // console.log("Inside condition", event.value);
      this.loading = true;
      this.projectlist = [];
      for (let i = 0; i < this.projects.length; i++) {
        if (event.value === this.projects[i].clientname) {
          this.projectlist.push({ name: this.projects[i].projectname });
        }
      }
      this.loading = false;
    }
  }

  refreshprojects() {
    this.clientlist = [];
    this.profile
      .getProfile(localStorage.getItem("username"))
      .pipe(first())
      .subscribe(
        result => {
          this.managername = result._source.reportingmanager;
          this.manageremail = result._source.reportinmanageremail;
          this.projects = result._source.projects;
          for (let i = 0; i < this.projects.length; i++) {
            this.clientlist.push({ name: this.projects[i].clientname });
          }
          if (this.clientlist.length === 0) {
            this.clientlist.push({ name: "Aaravsolutions" });
            this.projectlist.push({ name: "Internal" });
            this.clientnofound = true;
          }
        },
        err => {
          alert("Error while retriving employee info contact admin");
        }
      );
  }
}
