import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../providers/auth.service";
import { first } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-workexp",
  templateUrl: "./workexp.component.html",
  styleUrls: ["./workexp.component.scss"]
})
export class WorkexpComponent implements OnInit {
  public loading = false;
  public step = 0;
  public joiningdate: Date;
  public careerstartdate: Date;
  public today: Date = new Date();
  public Reportingmanager: FormControl;
  public Reportingemail: FormControl;
  public Carrerstartingday: FormControl;
  public Joiningday: FormControl;
  public TotalExp: FormControl;
  public CurrentExp: FormControl;
  public Jobsatuts: FormControl;
  private previousexperince: Array<any> = [];
  private experinceAttribute: any = {};
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.Reportingmanager = new FormControl("");
    this.Reportingemail = new FormControl("");
    this.Carrerstartingday = new FormControl("");
    this.Joiningday = new FormControl("");
    this.TotalExp = new FormControl("");
    this.CurrentExp = new FormControl("");
    this.Jobsatuts = new FormControl("");
    this.loading = true;
    this.auth
      .getemployeedetailselastic(localStorage.getItem("employeeid"))
      .pipe(first())
      .subscribe(
        result => {
          console.log(result._source.joiningdate);
          this.loading = false;
          this.joiningdate = result._source.joiningdate;
          this.careerstartdate = result._source.careerstartingdate;
          this.Reportingmanager.setValue(result._source.reportingmanager);
          this.Jobsatuts.setValue(result._source.jobstatus);
          this.Reportingemail.setValue(result._source.reportinmanageremail);
          this.Joiningday.setValue(result._source.reportinmanageremail);
          var csd = new Date(this.careerstartdate);
          var jd = new Date(this.joiningdate);
          var month = csd.getMonth() + 1;
          this.Carrerstartingday.setValue(
            csd.getFullYear() + "/" + month + "/" + csd.getDate()
          );
          var month = jd.getMonth() + 1;
          this.Joiningday.setValue(
            jd.getFullYear() + "/" + month + "/" + jd.getDate()
          );
          this.CurrentExp.setValue(
            this.joiningdatecalc(this.today, this.joiningdate)
          );
          // console.log(this.joiningdatecalc(this.today, this.joiningdate));
          this.TotalExp.setValue(
            this.totalexpcalc(this.today, this.careerstartdate)
          );
          this.previousexperince = result._source.previousexpreince;
          //console.log(this.totalexpcalc(this.today, this.careerstartdate));
        },
        err => {
          console.log(err);
          alert("error while get employee details");
          this.loading = false;
        }
      );
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
  joiningdatecalc(dates1: Date, dates2: Date) {
    var date2 = new Date(dates2);
    var date1 = dates1;
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
      /*message += secs + " sec ";
      message += mins + " min ";
      message += hours + " hours ";*/
      message += " 1 Day ";
    } else {
      if (years > 0) {
        message += years + " Years ";
      }
      if (months > 0 || years > 0) {
        message += months + " Months ";
      }
      message += days + " Days ";
    }
    return message;
  }

  totalexpcalc(dates1: Date, dates2: Date) {
    var date2 = new Date(dates2);
    var date1 = dates1;
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
      /*message += secs + " sec ";
      message += mins + " min ";
      message += hours + " hours ";*/
      message += " 1 Day ";
    } else {
      if (years > 0) {
        message += years + " Years ";
      }
      if (months > 0 || years > 0) {
        message += months + " Months ";
      }
      message += days + " Days ";
    }
    return message;
  }
}
