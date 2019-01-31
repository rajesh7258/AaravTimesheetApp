import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { Router, NavigationExtras } from "@angular/router";
import { DataService } from "../providers/data/data.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../providers/auth.service";
import { first } from "rxjs/operators";
import { Alert } from "selenium-webdriver";
@Component({
  selector: "app-resetpassword",
  templateUrl: "./resetpassword.component.html",
  styleUrls: ["./resetpassword.component.scss"]
})
export class ResetpasswordComponent implements OnInit {
  resetpasswordform: FormGroup;
  submitted = false;
  checked = false;
  name: string;
  spinnerConfig: object = {
    bdColor: "#333",
    size: "large",
    color: "#fff"
  };
  public error: string;
  public profileinfo: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private data: DataService,
    private spinner: NgxSpinnerService,
    private auth: AuthService
  ) {
    this.name = `ngx-spinner`;
  }

  ngOnInit() {
    this.resetpasswordform = this.formBuilder.group({
      oldpassword: ["", [Validators.required]],
      newpassword: ["", [Validators.required]],
      confirmpassword: ["", [Validators.required]]
    });
  }

  hide = true;

  get f() {
    return this.resetpasswordform.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetpasswordform.invalid) {
      return;
    }

    if (
      this.resetpasswordform.controls.newpassword.value !==
      this.resetpasswordform.controls.confirmpassword.value
    ) {
      alert("New Password and Confirm Password are not matching");
      return;
    }
    this.spinner.show();
    var object = {};
    object["username"] = localStorage.getItem("username");
    object["oldpassword"] = this.resetpasswordform.controls.oldpassword.value;
    object["newpassword"] = this.resetpasswordform.controls.newpassword.value;
    object["employeeid"] = localStorage.getItem("employeeid");
    this.auth
      .updatepassword(object)
      .pipe(first())
      .subscribe(
        result => {
          alert("password update succesfully");
          this.spinner.hide();
          this.router.navigate([""]);
        },
        err => {
          this.error = "Could not authenticate";
          this.spinner.hide(); // To hide the spinner
          alert("Couldnot able to update the password contact admin");
        }
      );
  }
}
