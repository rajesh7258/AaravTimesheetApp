import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
  MatNativeDateModule,
  MatDatepickerModule
} from "@angular/material";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthService } from "../../../providers/auth.service";
@Component({
  selector: "app-viewtimesheet",
  templateUrl: "./viewtimesheet.component.html",
  styleUrls: ["./viewtimesheet.component.scss"]
})
export class ViewtimesheetComponent implements OnInit {
  public holidayentry: any = [];
  public timesheet: any = [];
  public monday: any;
  public tuesday: any;
  public wednesday: any;
  public thrusday: any;
  public friday: any;
  public saturday: any;
  public sunday: any;
  public employeeid = "";
  public loading = false;
  rejectdescription: FormControl;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private profile: AuthService
  ) {
    this.rejectdescription = new FormControl("");
    console.log("Dialog input data", data);
    this.employeeid = data.employeeid;
    this.monday = data.datelist.mon;
    this.tuesday = data.datelist.tue;
    this.wednesday = data.datelist.wed;
    this.thrusday = data.datelist.thur;
    this.friday = data.datelist.fri;
    this.saturday = data.datelist.sat;
    this.sunday = data.datelist.sun;
    this.timesheet = data.weekentry;
    this.holidayentry = data.weekendentry;
  }

  ngOnInit() {}

  closeModal(status): void {
    this.dialogRef.close({ status: status });
  }
  onAccept() {
    this.loading = true;
    this.submitdata("Approved");
  }
  onReject() {
    if (!this.rejectdescription.value) {
      alert("Reject description is must on timesheet rejection");
      return;
    }
    this.loading = true;
    this.submitdata("Reject");
  }
  submitdata(status) {
    var object = this.data;
    object["managerstatus"] = status;
    object["Rejectdescription"] = this.rejectdescription.value;
    this.profile
      .submittimesheet(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log("submittimesheet response", result);
          this.loading = false;
          this.closeModal("reject");
        },
        err => {
          console.log("error is:", err);
          this.loading = false;
        }
      );
  }
}
