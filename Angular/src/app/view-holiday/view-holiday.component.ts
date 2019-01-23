import { Component, OnInit } from "@angular/core";
import { AuthService } from "../providers/auth.service";
import { first } from "rxjs/operators";

export interface Holidaylist {
  month: string;
  date: Date;
  day: string;
  occasion: string;
  country: String;
  year: string;
}
@Component({
  selector: "app-view-holiday",
  templateUrl: "./view-holiday.component.html",
  styleUrls: ["./view-holiday.component.scss"]
})
export class ViewHolidayComponent implements OnInit {
  public loading = false;
  public tmp = [];
  public India = [];
  public USA = [];
  step = 0;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.loading = true;
    this.auth
      .getholidaylistelastic()
      .pipe(first())
      .subscribe(
        result => {
          console.log(result);
          if (result._source.holidaylist.length != 0) {
            this.tmp = result._source.holidaylist;
            for (let i = 0; i < result._source.holidaylist.length; i++) {
              if (result._source.holidaylist[i].country === "India") {
                this.India.push(result._source.holidaylist[i]);
              } else {
                this.USA.push(result._source.holidaylist[i]);
              }
            }
          }

          //this.datasourceIndia = this.India;
          //this.datasourceUSA = this.USA;

          console.log(this.India);
          console.log(this.USA);
          this.loading = false;
        },
        err => {
          console.log(err);
          alert("error while getting holiday list details contact admin");
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
}
