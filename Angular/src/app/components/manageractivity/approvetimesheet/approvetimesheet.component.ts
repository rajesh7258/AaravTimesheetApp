import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { AuthService } from "../../../providers/auth.service";
import { first } from "rxjs/operators";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ViewtimesheetComponent } from "../viewtimesheet/viewtimesheet.component";
import { createOfflineCompileUrlResolver } from "@angular/compiler";
@Component({
  selector: "app-approvetimesheet",
  templateUrl: "./approvetimesheet.component.html",
  styleUrls: ["./approvetimesheet.component.scss"]
})
export class ApprovetimesheetComponent implements OnInit {
  public loading = false;
  public dontshowview = false;
  public approvetimesheet: any = [];
  public hits = [];
  public returndialogdata;
  userprof: any;
  constructor(private auth: AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loading = true;
    this.auth
      .getapprovetimesheet({ username: localStorage.getItem("username") })
      .pipe(first())
      .subscribe(
        result => {
          console.log(result);
          this.hits = result.response.hits.hits;
          if (result.response.hits.total > 0) {
            this.dontshowview = true;
            for (let i = 0; i < result.response.hits.hits.length; i++) {
              this.approvetimesheet.push(result.response.hits.hits[i]._source);
            }
          }
          //tresult._source.firstname;
          this.loading = false;
        },
        err => {
          alert("Error while retriving timesheets contact admin");
          this.loading = false;
        }
      );
  }
  openviewmodal(index: any) {
    console.log(this.approvetimesheet[index]);
    this.openLoginDialog(this.approvetimesheet[index], index);
  }

  async openLoginDialog(object, index) {
    for (let i = 0; i < this.approvetimesheet.length; i++) {
      if (
        this.approvetimesheet[i].startdate === this.hits[i]._source.startdate &&
        this.approvetimesheet[i].enddate === this.hits[i]._source.enddate
      ) {
        object["_id"] = this.hits[i]._id;
      }
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "930px";
    dialogConfig.height = "550px";
    dialogConfig.position = { left: "275px" };
    dialogConfig.disableClose = true;
    dialogConfig.data = object;
    var dialogdata: any = dialogConfig.data;
    console.log('checkin dialog', dialogdata);
    await this.auth
          .getProfileById(dialogdata.employeeid)
          .then(
            result => {
              console.log('userprof', result);
              this.userprof = result;
              //return result;
            }
          );
    const dialogRef = this.dialog.open(ViewtimesheetComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(val => {
      this.returndialogdata = val;
      if (val.status !== "Close") {    
        var obj = {
          employeeemail: this.userprof._source.username,
          employeename: this.userprof._source.firstname,
          fromdate: dialogdata.startdate,
          todate: dialogdata.enddate
        };
        console.log('object for timesheet mail', obj);
        this.auth.sendtimesheetrejectemail(obj)
        .pipe(first())
        .subscribe(
          result => {
            console.log("timesheet notify",result);
          },
          err => {
            console.log(err);
          }
        );
        this.approvetimesheet.splice(index, 1);
        if (this.approvetimesheet.length === 0) {
          this.dontshowview = false;
        }
      }
    });
  }
}
