import { Component, OnInit } from "@angular/core";
import { AuthService } from "../providers/auth.service";
import { first } from "rxjs/operators";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
@Component({
  selector: "app-create-calender",
  templateUrl: "./create-calender.component.html",
  styleUrls: ["./create-calender.component.scss"]
})
export class CreateCalenderComponent implements OnInit {
  public loading = false;
  private holidaylist: Array<any> = [];
  private holidayAttribute: any = {};
  public countryname: FormControl;
  public submitbutton = false;
  maxDate = new Date();
  constructor(private auth: AuthService) {
    this.countryname = new FormControl("", [Validators.required]);
  }

  ngOnInit() {}

  changeholidayview(event) {
    var object = {};
    object["country"] = event.value;
    object["year"] = new Date().getFullYear();
    console.log(object);
    this.holidayAttribute = {};
    this.auth
      .getholidaylist(object)
      .pipe(first())
      .subscribe(
        result => {
          this.loading = true;
          this.holidaylist = [];
          var hits = [];
          console.log(result);
          if (result.response.hits.total != 0) {
            hits =
              result.response.hits.hits[0].inner_hits.holidaylist.hits.hits;
            for (let i = 0; i < hits.length; i++) {
              this.holidaylist.push(hits[i]._source);
            }
          }
          console.log(hits);
          this.loading = false;
          if (hits.length !== 0) {
            this.submitbutton = true;
          }
        },
        err => {
          console.log(err);
          alert("error while get employee details");
          this.loading = false;
        }
      );
  }
  deletesholiday(index) {
    this.holidaylist.splice(index, 1);
    if (this.holidaylist.length === 0) {
      this.submitbutton = false;
    }
  }

  addholiday() {
    if (this.countryname.value === "") {
      alert("please select country");
      return;
    }
    if (!this.holidayAttribute.occasion) {
      alert("Occasion cannot be empty");
      return;
    }
    if (!this.holidayAttribute.date) {
      alert("date cannot be empty");
      return;
    }
    this.holidayAttribute["country"] = this.countryname.value;
    this.holidayAttribute["year"] = new Date(
      this.holidayAttribute.date
    ).getFullYear();
    this.holidayAttribute["month"] = this.MonthString(
      new Date(this.holidayAttribute.date).getMonth()
    );
    this.holidayAttribute["day"] = this.DayString(
      new Date(this.holidayAttribute.date).getDay()
    );
    this.holidaylist.push(this.holidayAttribute);
    this.holidayAttribute = {};
    if (this.holidaylist.length !== 0) {
      this.submitbutton = true;
    }
    console.log(this.holidaylist);

    //console.log('fieldArray',this.fieldArray)
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
  DayString(day: any) {
    var monthString = "";
    if (day === 1) {
      monthString = "Monday";
    }
    if (day === 2) {
      monthString = "Tuesday";
    }
    if (day === 3) {
      monthString = "Wednesday";
    }
    if (day === 4) {
      monthString = "Thrusday";
    }
    if (day === 5) {
      monthString = "Friday";
    }
    if (day === 6) {
      monthString = "Saturday";
    }
    if (day === 7) {
      monthString = "Sunday";
    }
    return monthString;
  }
  onSave() {
    this.loading = true;
    var object = {
      holidaylist: this.holidaylist
    };
    this.auth
      .saveholiday(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log("result", result);
          alert("Data Saved Succesfully");
          this.loading = false;
        },
        err => {
          this.loading = false;
          console.log("error is:", err);
        }
      );
  }
}
