import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../providers/auth.service";
import { first } from "rxjs/operators";

import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ViewleavesComponent } from "../../myrequest/viewleaves/viewleaves.component";
@Component({
  selector: "app-leave",
  templateUrl: "./leave.component.html",
  styleUrls: ["./leave.component.scss"]
})
export class LeaveComponent implements OnInit {
  public leaves = [];
  public earnedleaves = 0;
  public casualleaves = 0;
  public optionalholidays = 0;
  public extension;
  public loading = false;
  public appliedleaves = [];
  constructor(
    private profile: AuthService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.profile
      .getProfile(localStorage.getItem("username"))
      .pipe(first())
      .subscribe(
        result => {
          console.log(result);
          this.leaves = result._source.leaves;
          this.earnedleaves = this.leaves[0].earnedleave;
          this.casualleaves = this.leaves[0].casualleave;
          this.optionalholidays = this.leaves[0].optionalholiday;
          this.extension = result._source.extension;
          this.leaves["extension"] = this.extension;
          this.leaves["earnedleaves"] = this.earnedleaves;
          this.leaves["casualleaves"] = this.casualleaves;
          this.leaves["optionalholidays"] = this.optionalholidays;
          this.leaves["employeeid"] = result._source.employeeid;
          this.leaves["employeemail"] = result._source.username;
          this.leaves["manageremail"] = result._source.reportinmanageremail;
          this.leaves["managername"] = result._source.reportingmanager;
          //console.log(this.leaves);
        },
        err => {
          console.log("error is:", err);
        }
      );
    this.profile
      .getleavesforemployee({ employeeid: localStorage.getItem("employeeid") })
      .pipe(first())
      .subscribe(
        result => {
          console.log("leave results are", result);
          if (result.hits.total > 0) {
            for (let i = 0; i < result.hits.hits.length; i++) {
              this.appliedleaves.push({
                id: result.hits.hits[i]._id,
                fromdate: result.hits.hits[i]._source.startdate,
                todate: result.hits.hits[i]._source.enddate,
                days: result.hits.hits[i]._source.appliedleaves,
                type: result.hits.hits[i]._source.leavetype,
                appliedto: result.hits.hits[i]._source.managername,
                status: result.hits.hits[i]._source.status,
                appliedon: result.hits.hits[i]._source.createdate,
                rejectdesc: result.hits.hits[i]._source.rejectdescription
              });
            }
          }
          console.log("applied leaves array", this.appliedleaves);
        },
        err => {
          console.log("error is:", err);
        }
      );
  }
  applyleave() {
    console.log('leaves before open dialog', this.leaves);
    this.openLoginDialog(this.leaves);
  }
  openLoginDialog(object) {
    console.log('leaves after open dialog', object);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "350px";
    dialogConfig.height = "350px";
    dialogConfig.position = { bottom: "220px" };
    dialogConfig.disableClose = true;
    dialogConfig.data = object;

    const dialogRef = this.dialog.open(ViewleavesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(val => {
      if (val.status === "apply") {
        this.loading = true;
        var type = "";
        if (val.leavetype === "Earned Leave") {
          type = "Earned Leave";
          this.earnedleaves = this.earnedleaves - val.leaveapplied;
        }
        if (val.leavetype === "Casual Leave") {
          type = "Casual Leave";
          this.casualleaves = this.casualleaves - val.leaveapplied;
        }
        if (val.leavetype === "Optional Holiday") {
          type = "Optional Holiday";
          this.optionalholidays = this.optionalholidays - val.leaveapplied;
        }
        var object = {};
        object["employeeid"] = localStorage.getItem("employeeid");
        object["type"] = type;
        object["leave"] = val.leaveapplied;
        this.profile
          .updateleave(object)
          .pipe(first())
          .subscribe(
            result => {
              this.profile
                .getleavesforemployee({
                  employeeid: localStorage.getItem("employeeid")
                })
                .pipe(first())
                .subscribe(
                  result => {
                    this.appliedleaves = [];
                    console.log("leave results are", result);
                    if (result.hits.total > 0) {
                      for (let i = 0; i < result.hits.hits.length; i++) {
                        this.appliedleaves.push({
                          id: result.hits.hits[i]._id,
                          fromdate: result.hits.hits[i]._source.startdate,
                          todate: result.hits.hits[i]._source.enddate,
                          days: result.hits.hits[i]._source.appliedleaves,
                          type: result.hits.hits[i]._source.leavetype,
                          appliedto: result.hits.hits[i]._source.managername,
                          status: result.hits.hits[i]._source.status,
                          appliedon: result.hits.hits[i]._source.createdate,
                          rejectdesc:
                            result.hits.hits[i]._source.rejectdescription
                        });
                      }
                    }
                    console.log("applied leaves array", this.appliedleaves);
                  },
                  err => {
                    console.log("error is:", err);
                  }
                );
              this.loading = false;
            },
            err => {
              this.loading = false;
              console.log("error is:", err);
            }
          );
      }
    });
  }
  oncancelrequest(index: any) {
    this.loading = true;
    console.log(this.appliedleaves[index].id);
    this.profile
      .deleteleaverequest(this.appliedleaves[index].id)
      .pipe(first())
      .subscribe(
        result => {
          console.log("Debug1");
          var object = {};
          object["employeeid"] = localStorage.getItem("employeeid");
          object["type"] = this.appliedleaves[index].type;
          object["leave"] = this.appliedleaves[index].days;
          console.log("leave request", object);
          this.profile
            .reupdateleave(object)
            .pipe(first())
            .subscribe(
              result => {
                console.log("Debug2");
                if (this.appliedleaves[index].type === "Earned Leave") {
                  this.earnedleaves =
                    this.earnedleaves + this.appliedleaves[index].days;
                  this.leaves["earnedleaves"] = this.earnedleaves;
                }
                if (this.appliedleaves[index].type === "Casual Leave") {
                  this.casualleaves =
                    this.casualleaves + this.appliedleaves[index].days;
                  this.leaves["casualleaves"] = this.casualleaves;
                }
                if (this.appliedleaves[index].type === "Optional Holiday") {
                  this.optionalholidays =
                    this.optionalholidays + this.appliedleaves[index].days;
                  this.leaves["optionalholidays"] = this.optionalholidays;
                }
                this.appliedleaves.splice(index, 1);
              },
              err => {
                this.loading = false;
                console.log("error is:", err);
              }
            );
          this.loading = false;
        },
        err => {
          this.loading = false;
          console.log("error is:", err);
        }
      );
  }
  showrejectdescription(index: any) {
    console.log("showrjectdesc", this.appliedleaves[index]);
    alert(this.appliedleaves[index].rejectdesc);
  }
}
