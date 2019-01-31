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
import { RejectleaveComponent } from "../rejectleave/rejectleave.component";

@Component({
  selector: "app-approveleave",
  templateUrl: "./approveleave.component.html",
  styleUrls: ["./approveleave.component.scss"]
})
export class ApproveleaveComponent implements OnInit {
  public loading = false;
  public dontshowview = false;
  public appoveleave: any = [];
  public hits = [];
  public returndialogdata;
  userprof: any;

  constructor(private auth: AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loading = true;
    this.auth
      .getleavestoapprove({ username: localStorage.getItem("username") })
      .pipe(first())
      .subscribe(
        result => {
          if (result.hits.total > 0) {
            for (let i = 0; i < result.hits.hits.length; i++) {
              this.appoveleave.push({
                id: result.hits.hits[i]._id,
                employeeid: result.hits.hits[i]._source.employeeid,
                fromdate: result.hits.hits[i]._source.startdate,
                todate: result.hits.hits[i]._source.enddate,
                leavetype: result.hits.hits[i]._source.leavetype,
                status: result.hits.hits[i]._source.status,
                description: result.hits.hits[i]._source.description,
                employeeemail: result.hits.hits[i]._source.employeeemail,
                days: result.hits.hits[i]._source.appliedleaves,
                appliedon: result.hits.hits[i]._source.createdate
              });
            }
            this.dontshowview = true;
          } else {
            this.dontshowview = false;
          }
          console.log("result is:", this.appoveleave);
          this.loading = false;
        },
        err => {
          alert("Error while retriving leaves contact admin");
          console.log(err);
          this.loading = false;
        }
      );
  }
  viewdescription(index: any) {
    alert(this.appoveleave[index].description);
  }
  onapprove(index: any) {
    this.loading = true;
    this.auth
      .approveleave(this.appoveleave[index].id, {
        doc: {
          status: "Approved"
        }
      })
      .pipe(first())
      .subscribe(
        result => {
          console.log("approved");
          this.appoveleave.splice(index, 1);
          if (this.appoveleave.length === 0) {
            this.dontshowview = false;
          }
          this.loading = false;
        },
        err => {
          alert("Error while approving leave contact admin");
          console.log(err);
          this.loading = false;
        }
      );
  }
  async onreject(index: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "700px";
    dialogConfig.height = "160px";
    dialogConfig.position = { left: "350px" };
    dialogConfig.disableClose = true;
    dialogConfig.data = { id: this.appoveleave[index].id };
    var dialogdata: any;
    await this.auth
          .getProfileById(this.appoveleave[index].employeeid)
          .then(
            result => {
              console.log('userprof', result);
              this.userprof = result;
              //return result;
            }
          );
    const dialogRef = this.dialog.open(RejectleaveComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(val => {
      var object = {
        employeeemail: this.userprof._source.username,
        employeename: this.userprof._source.firstname,
        fromdate: this.appoveleave[index].fromdate,
        todate: this.appoveleave[index].todate
      };
      console.log('object for leave mail', object);
      this.auth.sendrejectleaveemail(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log("leave notify",result);
        },
        err => {
          console.log(err);
        }
      );
      this.appoveleave.splice(index, 1);
      if( this.appoveleave.length === 0 ) {
        this.dontshowview = false;
      }
    });
  }
}
