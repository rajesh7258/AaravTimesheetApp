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
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
@Component({
  selector: "app-rejectleave",
  templateUrl: "./rejectleave.component.html",
  styleUrls: ["./rejectleave.component.scss"]
})
export class RejectleaveComponent implements OnInit {
  public id: any;
  description: FormControl;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private profile: AuthService
  ) {
    this.id = data.id;
    this.description = new FormControl("");
  }

  ngOnInit() {}

  onreject() {
    if (this.description.value) {
      this.profile
        .approveleave(this.id, {
          doc: {
            status: "Rejected",
            rejectdescription: this.description.value
          }
        })
        .pipe(first())
        .subscribe(
          result => {
            this.closeModal("Reject");
          },
          err => {
            alert("Error while rejecting leave contact admin");
            console.log(err);
          }
        );
    } else {
      alert("Reject Description cannot be empty");
    }
  }

  closeModal(status): void {
    this.dialogRef.close({ status: status });
  }
}
