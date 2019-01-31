import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
  MatNativeDateModule,
  MatDatepickerModule
} from "@angular/material";
import { first } from "rxjs/operators";
import { AuthService } from "../../../providers/auth.service";
import { FormControl } from "@angular/forms";
import { IfStmt } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-viewleaves",
  templateUrl: "./viewleaves.component.html",
  styleUrls: ["./viewleaves.component.scss"]
})
export class ViewleavesComponent implements OnInit {
  typecontroller: FormControl;
  fromdate: FormControl;
  todate: FormControl;
  comment: FormControl;
  leave: FormControl;
  types = [];
  public tmp = [];
  public India = [];
  public USA = [];
  public indiadisablearray = [];
  public usadisablearray = [];
  public datefilter;
  public loading = false;
  maxdate = new Date();
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private profile: AuthService
  ) {
    console.log("Dialog input data", data);

    this.profile
      .getholidaylistelastic()
      .pipe(first())
      .subscribe(
        result => {
          console.log(result);
          var date = new Date();

          if (result._source.holidaylist.length != 0) {
            this.tmp = result._source.holidaylist;
            for (let i = 0; i < result._source.holidaylist.length; i++) {
              if (result._source.holidaylist[i].country === "India") {
                this.India.push(result._source.holidaylist[i]);
                this.indiadisablearray.push(result._source.holidaylist[i].date);
              } else {
                this.USA.push(result._source.holidaylist[i]);
                this.usadisablearray.push(result._source.holidaylist[i].date);
              }
            }
          }
          console.log(this.India);
          console.log(this.USA);
        },
        err => {
          console.log(err);
          alert("error while getting holiday list details contact admin");
        }
      );

    this.datefilter = (dates: Date): boolean => {
      const day = dates.getDay();

      if (this.data.extension === "+91") {
        return day !== 0 && day !== 6;
      }
      if (this.data.extension === "+1") {
        return day !== 0 && day !== 6;
      }
    };
    this.typecontroller = new FormControl("");
    this.fromdate = new FormControl();
    this.todate = new FormControl();
    this.comment = new FormControl("");
    this.leave = new FormControl(0);
    if (this.data[0].earnedleaves !== 0) {
      this.types.push({ name: "Sick Leave" });
    }
    if (this.data[0].casualleaves !== 0) {
      this.types.push({ name: "Casual Leave" });
    }
    if (this.data[0].optionalholidays !== 0) {
      this.types.push({ name: "Optional Holiday" });
    }
  }

  ngOnInit() {
  }

  closeModal(object): void {
    this.loading = false;
    this.dialogRef.close(object);
  }
  onclose() {
    this.closeModal({
      leavetype: "NA",
      leaveapplied: 0,
      status: "close"
    });
  }
  expreincetotalexp() {
    var Fromdate: Date;
    var Todate: Date;
    var one: Number = 1;
    var leavedays = 1;
    //check wether to and from date is holiday or not
    if (this.fromdate.value) {
      for (let i = 0; i < this.India.length; i++) {
        var indiadate: Date = new Date(this.India[i].date);
        if (this.fromdate.value.getTime() === indiadate.getTime()) {
          alert("From date is a holiday " + this.India[i].occasion);
          this.fromdate.setValue(new Date());
          return;
        }
      }
      for (let i = 0; i < this.USA.length; i++) {
        var usadate: Date = new Date(this.USA[i].date);
        if (this.fromdate.value.getTime() === usadate.getTime()) {
          alert("From date is a holiday " + this.USA[i].occasion);
          this.fromdate.setValue(new Date());
          return;
        }
      }
    }
    if (this.todate.value) {
      for (let i = 0; i < this.India.length; i++) {
        var indiadate: Date = new Date(this.India[i].date);
        if (this.todate.value.getTime() === indiadate.getTime()) {
          alert("To date is a holiday " + this.India[i].occasion);
          this.todate.setValue(new Date());
          return;
        }
      }
      for (let i = 0; i < this.USA.length; i++) {
        var usadate: Date = new Date(this.USA[i].date);
        if (this.todate.value.getTime() === usadate.getTime()) {
          alert("To date is a holiday " + this.USA[i].occasion);
          this.todate.setValue(new Date());
          return;
        }
      }
    }

    if (this.fromdate.value && this.todate.value) {
      if (this.fromdate.value.getTime() > this.todate.value.getTime()) {
        alert("To date cannot be greater than from date");
        return;
      }
      //console.log("fromdate", this.fromdate.value);
      //console.log("todate", this.todate.value);
      Fromdate = this.fromdate.value;
      Todate = this.todate.value;

      var diff = Math.abs(
        this.fromdate.value.getTime() - this.todate.value.getTime()
      );
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      for (let i = 0; i < diffDays; ++i) {
        var tmpdate: Date = new Date(
          Fromdate.getFullYear(),
          Fromdate.getMonth(),
          Fromdate.getDate() + 1
        );
        Fromdate = tmpdate;
        console.log(tmpdate);
        if (tmpdate.getDay() !== 0 && tmpdate.getDay() !== 6) {
          leavedays = leavedays + 1;
        }
        for (let i = 0; i < this.India.length; i++) {
          var indiadate: Date = new Date(this.India[i].date);
          if (tmpdate.getTime() === indiadate.getTime()) {
            leavedays = leavedays - 1;
          }
        }
        for (let i = 0; i < this.USA.length; i++) {
          var usadate: Date = new Date(this.USA[i].date);
          if (tmpdate.getTime() === usadate.getTime()) {
            leavedays = leavedays - 1;
          }
        }
      }
      this.leave.setValue(leavedays);
      //console.log(leavedays);
    }
  }
  onApply() {
    this.loading = true;
    if (!this.typecontroller.value) {
      alert("Type cannot be empty");
      this.loading = false;
      return;
    }
    if (!this.fromdate.value) {
      alert("From cannot be empty");
      this.loading = false;
      return;
    }
    if (!this.todate.value) {
      alert("To cannot be empty");
      this.loading = false;
      return;
    }
    if (!this.comment.value) {
      alert("Comment cannot be empty");
      this.loading = false;
      return;
    }
    if (this.typecontroller.value === "Earned Leave") {
      if (this.leave.value > this.data.earnedleaves) {
        alert(
          "earned leaves category has only " + this.data.earnedleaves + " left"
        );
        this.loading = false;
        return;
      }
    }
    if (this.typecontroller.value === "Casual Leave") {
      if (this.leave.value > this.data.casualleaves) {
        alert(
          "casual leaves category has only " + this.data.casualleaves + " left"
        );
        this.loading = false;
        return;
      }
    }
    if (this.typecontroller.value === "Optional Holiday") {
      if (this.leave.value > this.data.optionalholidays) {
        alert(
          "optional holidays category has only " +
            this.data.optionalholidays +
            " left"
        );
        this.loading = false;
        return;
      }
    }
    var object = {};
    object["employeeid"] = this.data.employeeid;
    object["createdate"] = new Date();
    object["startdate"] = this.fromdate.value;
    object["enddate"] = this.todate.value;
    object["leavetype"] = this.typecontroller.value;
    object["employeeemail"] = this.data.employeemail;
    object["manageremail"] = this.data.manageremail;
    object["managername"] = this.data.managername;
    object["leavesapplied"] = this.leave.value;
    object["status"] = "Pending";
    object["description"] = this.comment.value;
    console.log("result is:", object);
    this.profile
      .saveleave(object)
      .pipe(first())
      .subscribe(
        result => {
          alert("leave applied successfully");
          this.closeModal({
            leavetype: this.typecontroller.value,
            leaveapplied: this.leave.value,
            status: "apply"
          });
        },
        err => {
          console.log(err);
          alert("error while saving leave contact admin");
        }
      );
  }
}
